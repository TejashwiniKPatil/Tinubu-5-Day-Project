import { APIRequestContext } from '@playwright/test';
import { expect, test } from '../../src/fixtures/qa';
import { LoginApi } from '../../src/api/LoginApi';
import { fillRequiredQuoteData, openConfiguredQuote } from '../../src/helpers/bondCreation';
import { getApiBaseUrl } from '../../src/utils/environment';
import { clientId, grantType, PASSWORD, payload2, protectedPath, USERNAME } from '../../test-data/constants';

// Grey-box cases from day-5/gray-box-test-design.md: UI flows checked against the network calls behind them.
const tags = ['@grey-box', '@regression'];
const executePath = '/bond/bonds/actions/execute';
// The All Bonds grid's data call, observed in Network on /bonds.
const bondsListPath = '/bond/bond-types/bonds';
const overMaximumPenalty = payload2.penalty + 1;
const internalDetailPattern = /stack ?trace|exception|\bat [\w.$]+ \(|\.cs:line|\.java:\d+|sql|traceback/i;

function apiUrl(pathname: string): string {
  return new URL(pathname, getApiBaseUrl()).toString();
}

async function accessToken(request: APIRequestContext): Promise<string> {
  const response = await new LoginApi(request).login(USERNAME, PASSWORD, grantType, clientId);
  expect(response.status(), 'Login API should issue a token').toBe(200);
  return (await response.json()).access_token;
}

test.describe('Grey-box: server-side validation', () => {
  test(
    'GB-001 - Execute API rejects a penalty above the $40,000,000 maximum',
    { tag: [...tags, '@api', '@bond-creation', '@stateful-bond'] },
    async ({ request }) => {
      const token = await accessToken(request);
      const response = await request.post(apiUrl(executePath), {
        headers: { Authorization: `Bearer ${token}` },
        data: { ...payload2, penalty: overMaximumPenalty },
      });

      expect(response.status(), 'Over-maximum penalty should get a 4xx validation response').toBeGreaterThanOrEqual(400);
      expect(response.status(), 'Validation should not be a server error').toBeLessThan(500);
      const body = await response.text();
      expect(body, 'Response should not report a created bond').not.toMatch(/"Success"\s*:\s*true/);
      expect(body).not.toMatch(internalDetailPattern);
    },
  );

  test(
    'GB-005 - Quote submission with client validation bypassed is rejected by the server',
    { tag: [...tags, '@hybrid', '@bond-creation', '@stateful-bond'] },
    async ({ authenticatedSession, page, dashboardPage, bondCreationPage }) => {
      void authenticatedSession;

      await test.step('UI: fill a valid quote', async () => {
        await openConfiguredQuote(dashboardPage, bondCreationPage);
        await fillRequiredQuoteData(bondCreationPage, '1000');
      });

      await test.step('Network: raise the penalty above the maximum after client validation', async () => {
        let tampered = false;
        await page.route(`**${executePath}`, async (route) => {
          const body = route.request().postDataJSON();
          if (!body || typeof body.penalty !== 'number') {
            throw new Error('Execute request has no numeric "penalty" field; recapture the request shape.');
          }
          tampered = true;
          await route.continue({ postData: JSON.stringify({ ...body, penalty: overMaximumPenalty }) });
        });

        const responsePromise = page.waitForResponse((r) => r.url().includes(executePath));
        await bondCreationPage.submitQuote();
        const response = await responsePromise;

        expect(tampered, 'The execute request should have been intercepted').toBe(true);
        expect(response.status(), 'Server should reject the bypassed penalty').toBeGreaterThanOrEqual(400);
        expect(response.status()).toBeLessThan(500);
        await expect(page).not.toHaveURL(/\/bonds\/\d+$/);
      });
    },
  );
});

test.describe('Grey-box: API behind the bonds list', () => {
  test(
    'GB-002 - Bonds list call behind the All Bonds grid returns JSON without credentials',
    { tag: tags },
    async ({ authenticatedSession, page }) => {
      void authenticatedSession;
      const responsePromise = page.waitForResponse((r) => new URL(r.url()).pathname === bondsListPath, { timeout: 20_000 });
      await page.goto(protectedPath);
      const response = await responsePromise;

      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toMatch(/json/);
      const body = await response.text();
      expect(() => JSON.parse(body)).not.toThrow();
      if (PASSWORD) expect(body.includes(PASSWORD), 'Response should not contain the password').toBe(false);
      expect(body).not.toMatch(/"password"\s*:/i);
    },
  );
});

test.describe('Grey-box: unauthenticated API access', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test(
    'GB-003 - Bonds list API rejects requests without a valid token',
    { tag: [...tags, '@api', '@security'] },
    async ({ request }) => {
      const cases: Array<[string, Record<string, string>]> = [
        ['no token', {}],
        ['tampered token', { Authorization: 'Bearer qa-invalid-token' }],
      ];
      for (const [name, headers] of cases) {
        const response = await request.get(apiUrl(bondsListPath), { headers });
        expect(response.status(), `Bonds list with ${name}`).toBeGreaterThanOrEqual(401);
        expect(response.status(), `Bonds list with ${name}`).toBeLessThanOrEqual(403);
        expect(await response.text()).not.toMatch(internalDetailPattern);
      }
    },
  );
});

test.describe('Grey-box: expired authentication handling', () => {
  test(
    'GB-004 - UI returns to Login when the API reports the session has expired',
    { tag: [...tags, '@security'] },
    async ({ authenticatedSession, page, loginPage, bondCreationPage }) => {
      void authenticatedSession;
      // Answer locally so no refresh or logout call reaches Alpha and the shared saved session stays valid.
      await page.route(/\/(bond|auth)\//, (route) =>
        route.fulfill({ status: 401, contentType: 'application/json', body: '{"error":"invalid_token"}' }),
      );

      await page.goto(protectedPath);
      await loginPage.assertFormVisible();
      await expect(bondCreationPage.allBondsStartButton).toBeHidden();
    },
  );
});
