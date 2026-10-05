import { expect, test } from '../../../src/fixtures/qa';
import { fillRequiredQuoteData, openConfiguredQuote } from '../../../src/helpers/bondCreation';
import { dropNetworkOnRequest } from '../../../src/helpers/network';
import { bondCreationData } from '../../../test-data/bondCreationData';
import { bondFields } from '../../../test-data/constants';

const executeGlob = '**/bond/bonds/actions/execute';
const bondAmount = '1000';
const note = 'TC-102 offline submit check';

test(
  'TC-102 - Verify quote submission fails safely when the network drops after clicking Submit',
  { tag: ['@regression', '@bond-creation', '@stateful-bond'] },
  async ({ authenticatedSession, page, context, dashboardPage, bondCreationPage }) => {
    void authenticatedSession;
    // Full quote fill, a failed submit, and a retry take longer than the default 30 s on Alpha.
    test.setTimeout(90_000);

    await test.step('UI: fill every required field and a note', async () => {
      await openConfiguredQuote(dashboardPage, bondCreationPage);
      await fillRequiredQuoteData(bondCreationPage, bondAmount);
      await bondCreationPage.fillField(bondFields.specialInstructions, note);
    });

    const drop = await dropNetworkOnRequest(page, context, executeGlob);

    await test.step('Network: the connection drops as Submit sends the quote', async () => {
      await bondCreationPage.submitQuote();
      await bondCreationPage.assertSubmitFailedByNetwork();
      expect(drop.attempts(), 'Submit should send exactly one execute request').toBe(1);
      await expect(page, 'No bond page should open while offline').toHaveURL(/\/bonds\/new$/);
    });

    await test.step('UI: everything entered is still on the form', async () => {
      expect(await bondCreationPage.fieldValue(bondFields.bondAmount), 'Bond Amount should be kept').toMatch(/^1,?000(\.00)?$/);
      expect(await bondCreationPage.fieldValue(bondFields.underwriter), 'Underwriter should be kept').toBe(bondCreationData.underwriter);
      expect(await bondCreationPage.fieldValue(bondFields.specialInstructions), 'Special Instructions should be kept').toBe(note);
      if (await bondCreationPage.isFieldShown(bondFields.selectTrade)) {
        expect(await bondCreationPage.fieldValue(bondFields.selectTrade), 'Select Trade should be kept').toBe(bondCreationData.trade);
      }
    });

    await test.step('Network: back online, one retry creates exactly one bond', async () => {
      await drop.restore();
      const executeResponses: number[] = [];
      page.on('response', (response) => {
        if (response.url().includes('/bond/bonds/actions/execute')) executeResponses.push(response.status());
      });
      await bondCreationPage.submitQuoteSuccessfully();
      expect(executeResponses, 'The retry should send one successful execute request').toEqual([200]);
    });
  },
);
