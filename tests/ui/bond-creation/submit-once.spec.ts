import { expect, test } from '../../../src/fixtures/qa';
import { fillRequiredQuoteData, openConfiguredQuote } from '../../../src/helpers/bondCreation';
import { countRequests } from '../../../src/helpers/network';

const executePath = '/bond/bonds/actions/execute';

test(
  'TC-103 - Verify clicking Submit sends the create-bond request exactly once',
  { tag: ['@regression', '@bond-creation', '@stateful-bond'] },
  async ({ authenticatedSession, page, dashboardPage, bondCreationPage }) => {
    void authenticatedSession;
    // A full quote fill plus submit and navigation takes longer than the default 30 s on Alpha.
    test.setTimeout(90_000);

    await test.step('UI: fill every required field', async () => {
      await openConfiguredQuote(dashboardPage, bondCreationPage);
      await fillRequiredQuoteData(bondCreationPage, '1000');
    });

    const executeRequests = countRequests(page, executePath, 'POST');

    const bondId = await test.step('UI: click Submit once and wait for the create-bond response', async () => {
      const responsePromise = page.waitForResponse(
        (response) => response.url().includes(executePath) && response.request().method() === 'POST',
      );
      await bondCreationPage.submitQuote();
      const response = await responsePromise;
      expect(response.status(), 'Create-bond request should succeed').toBe(200);
      const body = await response.json();
      expect(body.Success, 'Response should report success').toBe(true);
      expect(Number.isInteger(body.BondId) && body.BondId > 0, `BondId should be a positive integer, got ${body.BondId}`).toBe(true);
      return body.BondId as number;
    });

    await test.step('Network: exactly one create-bond request after the flow settles', async () => {
      // The bond page opening marks the end of the submit flow, so a late duplicate request would already be counted.
      await expect(page, 'The new bond page should open').toHaveURL(new RegExp(`/bonds/${bondId}$`), { timeout: 20_000 });
      executeRequests.stop();
      expect(executeRequests.count(), 'Submit should send the create-bond request exactly once').toBe(1);
    });
  },
);
