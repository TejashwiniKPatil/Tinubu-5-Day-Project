import { expect, test } from '../../src/fixtures/qa';
import { LoginApi } from '../../src/api/LoginApi';
import { openConfiguredQuote } from '../../src/helpers/bondCreation';
import { loginTestData } from '../../test-data/loginData';
import {
  bondFields,
  clientId,
  grantType,
  htmlInjectionMarker,
  PASSWORD,
  protectedPath,
} from '../../test-data/constants';

// Safe, read-only checks from test-cases/security-test-cases.md. Invalid-login checks use an
// unknown username, so they never count toward the main account's lockout limit.
const tags = ['@security'];
const internalDetailPattern = /stack ?trace|exception|\bat [\w.$]+ \(|\.cs:line|\.java:\d+|sql|traceback/i;

test.describe('Security checks for a signed-out user', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('SEC-002 - Protected page redirects a signed-out user to Login', { tag: tags }, async ({ page, loginPage, bondCreationPage }) => {
    await page.goto(protectedPath);
    await loginPage.assertFormVisible();
    await expect(bondCreationPage.allBondsStartButton).toBeHidden();
  });

  test('SEC-008 - Application traffic uses HTTPS', { tag: tags }, async ({ page, loginPage, request, baseURL }) => {
    const insecure: string[] = [];
    page.on('request', (req) => {
      if (req.url().startsWith('http:')) insecure.push(new URL(req.url()).origin);
    });
    await loginPage.open();
    await loginPage.assertFormVisible();
    expect(page.url()).toMatch(/^https:/);
    expect(insecure, 'Requests sent over plain HTTP').toEqual([]);

    const httpUrl = baseURL!.replace(/^https:/, 'http:');
    const response = await request.get(httpUrl, { maxRedirects: 5 });
    expect(response.url(), 'HTTP address should redirect to HTTPS').toMatch(/^https:/);
  });

  test('SEC-009 - Password is masked and never sent in a URL', { tag: tags }, async ({ page, loginPage }) => {
    const password = loginTestData.invalidPassword;
    const urls: string[] = [];
    page.on('request', (req) => urls.push(req.url()));

    await loginPage.open();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    await loginPage.submit(loginTestData.invalidUsername, password);
    await loginPage.assertRejected();

    const leaked = urls.filter((url) => url.includes(encodeURIComponent(password)) || url.includes(password));
    expect(leaked.length, 'Requests with the password in the URL').toBe(0);
  });

  test('SEC-007 - Failed Login API response reveals no internal details', { tag: [...tags, '@api'] }, async ({ request }) => {
    const response = await new LoginApi(request).login(
      loginTestData.invalidUsername,
      loginTestData.invalidPassword,
      grantType,
      clientId,
    );
    expect(response.status(), 'Unknown user should be rejected').toBeGreaterThanOrEqual(400);
    expect(response.status(), 'Rejection should not be a server error').toBeLessThan(500);
    expect(await response.text()).not.toMatch(internalDetailPattern);
  });
});

test.describe('Security checks for a signed-in user', () => {
  test('SEC-006 - Browser storage does not contain the password', { tag: tags }, async ({ authenticatedSession, page }) => {
    void authenticatedSession;
    if (!PASSWORD) throw new Error('Configure TEST_PASSWORD in .env to run this check.');
    // Compares inside the browser and returns only the matching key names, never the values.
    const keysWithPassword = await page.evaluate((secret) => {
      const found: string[] = [];
      for (const store of [window.localStorage, window.sessionStorage]) {
        for (let i = 0; i < store.length; i++) {
          const key = store.key(i)!;
          if ((store.getItem(key) ?? '').includes(secret)) found.push(key);
        }
      }
      return found;
    }, PASSWORD);
    expect(keysWithPassword, 'Storage keys that contain the password').toEqual([]);
  });

  test('SEC-004 - HTML typed into Special Instructions stays plain text', { tag: [...tags, '@bond-creation'] }, async ({
    authenticatedSession,
    dashboardPage,
    bondCreationPage,
  }) => {
    void authenticatedSession;
    await openConfiguredQuote(dashboardPage, bondCreationPage);
    await bondCreationPage.fillField(bondFields.specialInstructions, htmlInjectionMarker);
    await bondCreationPage.blurField(bondFields.specialInstructions);

    expect(await bondCreationPage.fieldValue(bondFields.specialInstructions)).toBe(htmlInjectionMarker);
    await expect(bondCreationPage.page.locator('b', { hasText: htmlInjectionMarker.replace(/<[^>]+>/g, '') })).toHaveCount(0);
  });
});
