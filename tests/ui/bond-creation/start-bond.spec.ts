import { expect, test } from '../../../src/fixtures/qa';
import {
  bondCreationData,
  missingBondCreationData,
} from '../../../test-data/bondCreationData';
import { bondCreationHighValueCases } from '../../../test-data/bondCreationCases';
import { bondFields, quoteHeaderLabels } from '../../../test-data/constants';
import {
  fillRequiredQuoteData,
  openBondSelection,
  openConfiguredQuote,
} from '../../../src/helpers/bondCreation';

const cases = new Map(bondCreationHighValueCases.map((testCase) => [testCase.id, testCase]));
const tags = ['@high-value', '@bond-creation'];

function title(id: string): string {
  const testCase = cases.get(id);
  if (!testCase) throw new Error(`Missing Bond Creation case metadata for ${id}.`);
  return `${id} - ${testCase.title}`;
}

// High-value cases must pass or fail, never skip: missing data fails the test.
function requireData(keys: Parameters<typeof missingBondCreationData>[0]): void {
  const missing = missingBondCreationData(keys);
  if (missing.length > 0) {
    throw new Error(`Configure ${missing.join(', ')} in .env to run this case.`);
  }
}

test(
  title('TC-019'),
  { tag: [...tags, '@smoke'] },
  async ({ authenticatedSession, dashboardPage, bondCreationPage }) => {
    void authenticatedSession;
    await openBondSelection(dashboardPage, bondCreationPage);
  },
);

test(
  title('TC-020'),
  { tag: [...tags, '@smoke'] },
  async ({ authenticatedSession, dashboardPage, bondCreationPage }) => {
    void authenticatedSession;
    await openBondSelection(dashboardPage, bondCreationPage);
    await bondCreationPage.searchAndSelectAgency(bondCreationData.agencyName);
    await expect(bondCreationPage.agencySelector).toContainText(bondCreationData.agencyName);
  },
);

test(
  title('TC-021'),
  { tag: [...tags, '@smoke'] },
  async ({ authenticatedSession, dashboardPage, bondCreationPage }) => {
    void authenticatedSession;
    await openBondSelection(dashboardPage, bondCreationPage);
    await bondCreationPage.selectAgencyDirectly(bondCreationData.agencyName);
    await expect(bondCreationPage.agencySelector).toContainText(bondCreationData.agencyName);
  },
);

test(
  title('TC-023'),
  { tag: tags },
  async ({ authenticatedSession, dashboardPage, bondCreationPage }) => {
    void authenticatedSession;
    await openConfiguredQuote(dashboardPage, bondCreationPage);
    await bondCreationPage.assertQuoteFormVisible(bondCreationData.bondTypeName);
  },
);

test(
  title('TC-024'),
  { tag: tags },
  async ({ authenticatedSession, dashboardPage, bondCreationPage }) => {
    void authenticatedSession;
    await openConfiguredQuote(dashboardPage, bondCreationPage);
    await bondCreationPage.assertQuoteContext({
      [quoteHeaderLabels.agency]: bondCreationData.agencyHeader,
      [quoteHeaderLabels.state]: bondCreationData.state,
      [quoteHeaderLabels.carrier]: bondCreationData.carrier,
      [quoteHeaderLabels.bondType]: bondCreationData.bondTypeName,
    });
  },
);

test(
  title('TC-025'),
  { tag: tags },
  async ({ authenticatedSession, dashboardPage, bondCreationPage }) => {
    void authenticatedSession;
    requireData(['principalSearch']);
    await openConfiguredQuote(dashboardPage, bondCreationPage);
    await bondCreationPage.searchAndSelectPrincipal(bondCreationData.principalSearch!);
    await bondCreationPage.assertPrincipalVisible(bondCreationData.principalSearch!);
  },
);

test(
  title('TC-026'),
  { tag: tags },
  async ({ authenticatedSession, dashboardPage, bondCreationPage }) => {
    void authenticatedSession;
    await openConfiguredQuote(dashboardPage, bondCreationPage);
    await bondCreationPage.fillField(bondFields.bondAmount, '0');
    await bondCreationPage.blurField(bondFields.bondAmount);
    const displayedAmount = await bondCreationPage.fieldValue(bondFields.bondAmount);
    expect(displayedAmount.replace(/[^\d.-]/g, '')).toBe('0');
  },
);

test(
  title('TC-027'),
  { tag: tags },
  async ({ authenticatedSession, dashboardPage, bondCreationPage }) => {
    void authenticatedSession;
    requireData(['principalSearch', 'underwriter']);
    await openConfiguredQuote(dashboardPage, bondCreationPage);
    await fillRequiredQuoteData(bondCreationPage, '10000');
    await bondCreationPage.fillField(bondFields.bondAmount, '-1');
    await bondCreationPage.submitQuoteWithInvalidAmount(bondFields.bondAmount);
  },
);

test(
  title('TC-028'),
  { tag: tags },
  async ({ authenticatedSession, dashboardPage, bondCreationPage }) => {
    void authenticatedSession;
    await openConfiguredQuote(dashboardPage, bondCreationPage);
    await bondCreationPage.fillField(bondFields.bondAmount, '40000000');
    await bondCreationPage.blurField(bondFields.bondAmount);
    const displayedAmount = await bondCreationPage.fieldValue(bondFields.bondAmount);
    expect(displayedAmount.replace(/[^\d.-]/g, '')).toBe('40000000');
  },
);

test(
  title('TC-029'),
  { tag: tags },
  async ({ authenticatedSession, dashboardPage, bondCreationPage }) => {
    void authenticatedSession;
    requireData(['principalSearch', 'underwriter']);
    await openConfiguredQuote(dashboardPage, bondCreationPage);
    await fillRequiredQuoteData(bondCreationPage, '10000');
    await bondCreationPage.fillField(bondFields.bondAmount, '40000001');
    await bondCreationPage.submitQuoteWithInvalidAmount(bondFields.bondAmount);
  },
);

test(
  title('TC-040'),
  { tag: tags },
  async ({ authenticatedSession, dashboardPage, bondCreationPage }) => {
    void authenticatedSession;
    await openConfiguredQuote(dashboardPage, bondCreationPage);
    await bondCreationPage.assertFieldsBlank([
      bondFields.contractorLicenseNumber,
      bondFields.contractorLicenseEffectiveDate,
      bondFields.contractorLicenseBondAmount,
    ]);
    await bondCreationPage.assertSurchargesVisible();
  },
);

test(
  title('TC-041'),
  { tag: tags },
  async ({ authenticatedSession, dashboardPage, bondCreationPage }) => {
    void authenticatedSession;
    requireData(['businessStructure', 'stateOfIncorporation', 'yearsHeldLicense', 'businessPercentage']);
    await openConfiguredQuote(dashboardPage, bondCreationPage);
    await bondCreationPage.checkProofOfInsurance();
    await bondCreationPage.assertCheckboxChecked();
    await bondCreationPage.selectOption(bondFields.businessStructure, bondCreationData.businessStructure!);
    await bondCreationPage.selectOption(bondFields.stateOfIncorporation, bondCreationData.stateOfIncorporation!);
    await bondCreationPage.fillField(bondFields.yearsHeldLicense, bondCreationData.yearsHeldLicense!);
    await bondCreationPage.fillField(
      bondFields.businessPercentage,
      bondCreationData.businessPercentage!,
    );
    expect(await bondCreationPage.fieldValue(bondFields.businessStructure)).toBe(bondCreationData.businessStructure);
    expect(await bondCreationPage.fieldValue(bondFields.stateOfIncorporation)).toBe(
      bondCreationData.stateOfIncorporation,
    );
    expect(await bondCreationPage.fieldValue(bondFields.yearsHeldLicense)).toBe(
      bondCreationData.yearsHeldLicense,
    );
    expect(await bondCreationPage.fieldValue(bondFields.businessPercentage)).toBe(
      bondCreationData.businessPercentage,
    );
  },
);

test(
  title('TC-043'),
  { tag: tags },
  async ({ authenticatedSession, dashboardPage, bondCreationPage }) => {
    void authenticatedSession;
    await openConfiguredQuote(dashboardPage, bondCreationPage);
    for (const value of ['3', '90']) {
      await bondCreationPage.fillField(bondFields.modifierValue, value);
      await bondCreationPage.blurField(bondFields.modifierValue);
      expect(await bondCreationPage.fieldValue(bondFields.modifierValue)).toBe(value);
    }
  },
);

test(
  title('TC-044'),
  { tag: [...tags, '@stateful-bond'] },
  async ({ authenticatedSession, dashboardPage, bondCreationPage }) => {
    void authenticatedSession;
    requireData(['principalSearch', 'underwriter']);
    await openConfiguredQuote(dashboardPage, bondCreationPage);
    await fillRequiredQuoteData(bondCreationPage, '10000');
    if (bondCreationData.producer) {
      await bondCreationPage.selectOption(bondFields.producer, bondCreationData.producer);
    }
    const specialInstructions = 'A'.repeat(500);
    await bondCreationPage.fillField(bondFields.specialInstructions, specialInstructions);
    expect(await bondCreationPage.fieldValue(bondFields.specialInstructions)).toBe(specialInstructions);
    await bondCreationPage.submitQuoteSuccessfully();
  },
);

test(
  title('TC-045'),
  { tag: [...tags, '@stateful-bond'] },
  async ({ authenticatedSession, dashboardPage, bondCreationPage }) => {
    void authenticatedSession;
    requireData(['principalSearch', 'underwriter']);
    await openConfiguredQuote(dashboardPage, bondCreationPage);
    await fillRequiredQuoteData(bondCreationPage, '10000');

    await bondCreationPage.submitQuoteSuccessfully();
    await bondCreationPage.startAnotherBondFromNavigation();
    await bondCreationPage.searchAndSelectAgency(bondCreationData.agencyName);
    await bondCreationPage.selectCommercialFamily();
    await bondCreationPage.searchAndSelectBond(
      bondCreationData.bondFormSearch,
      bondCreationData.bondTypeName,
    );
    await fillRequiredQuoteData(bondCreationPage, '10000');

    let executionRequests = 0;
    bondCreationPage.page.on('request', (request) => {
      if (request.url().includes('/execute')) executionRequests += 1;
    });
    await bondCreationPage.cancelQuote();

    await expect(bondCreationPage.page).toHaveURL(/\/bonds(?:\?.*)?$/);
    await bondCreationPage.assertStartNewBondVisible();
    expect(executionRequests).toBe(0);
  },
);
