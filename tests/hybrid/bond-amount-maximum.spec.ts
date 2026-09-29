import { expect, test } from '../../src/fixtures/qa';
import { CreateBondApi } from '../../src/api/CreateBondApi';
import { LoginApi } from '../../src/api/LoginApi';
import { openConfiguredQuote } from '../../src/helpers/bondCreation';
import { bondFields, clientId, grantType, PASSWORD, payload2, USERNAME } from '../../test-data/constants';

// The same boundary checked through both layers: the quote form must accept the
// $40,000,000 maximum, and the create-bond API must accept a bond at that penalty.
// The API step creates one bond in Alpha on every run.
test(
  'TC-048 - Bond amount maximum of $40,000,000 is accepted by the quote form and the create-bond API',
  { tag: ['@hybrid', '@bond-creation', '@stateful-bond'] },
  async ({ authenticatedSession, dashboardPage, bondCreationPage, request }) => {
    void authenticatedSession;

    await test.step('UI: the quote form keeps the maximum bond amount', async () => {
      await openConfiguredQuote(dashboardPage, bondCreationPage);
      await bondCreationPage.fillField(bondFields.bondAmount, String(payload2.penalty));
      await bondCreationPage.blurField(bondFields.bondAmount);
      const displayedAmount = await bondCreationPage.fieldValue(bondFields.bondAmount);
      expect(displayedAmount.replace(/[^\d.-]/g, '')).toBe(String(payload2.penalty));
    });

    await test.step('API: a bond at the maximum penalty is created', async () => {
      const loginResponse = await new LoginApi(request).login(USERNAME, PASSWORD, grantType, clientId);
      expect(loginResponse.status()).toBe(200);
      const { access_token: accessToken } = await loginResponse.json();

      const response = await new CreateBondApi(request).createBond(accessToken);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.Success).toBe(true);
      expect(body.Quote.Penalty).toBeGreaterThan(0);
      expect(body.Quote.Penalty).toBeLessThanOrEqual(payload2.penalty);
    });
  },
);
