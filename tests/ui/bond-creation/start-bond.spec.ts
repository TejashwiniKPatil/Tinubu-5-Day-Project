import { expect, test } from '../../../src/fixtures/qa';
import {
  bondCreationData,
  missingBondCreationData,
} from '../../../test-data/bondCreationData';
import { bondCreationHighValueCases } from '../../../test-data/bondCreationCases';
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
      Agency: bondCreationData.agencyHeader,
      State: bondCreationData.state,
      Carrier: bondCreationData.carrier,
      'Bond Type': bondCreationData.bondTypeName,
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
    await bondCreationPage.fillField('Bond Amount', '0');
    await bondCreationPage.blurField('Bond Amount');
    const displayedAmount = await bondCreationPage.fieldValue('Bond Amount');
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
    await bondCreationPage.fillField('Bond Amount', '-1');
    await bondCreationPage.submitQuoteWithInvalidAmount('Bond Amount');
  },
);

test(
  title('TC-028'),
  { tag: tags },
  async ({ authenticatedSession, dashboardPage, bondCreationPage }) => {
    void authenticatedSession;
    await openConfiguredQuote(dashboardPage, bondCreationPage);
    await bondCreationPage.fillField('Bond Amount', '40000000');
    await bondCreationPage.blurField('Bond Amount');
    const displayedAmount = await bondCreationPage.fieldValue('Bond Amount');
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
    await bondCreationPage.fillField('Bond Amount', '40000001');
    await bondCreationPage.submitQuoteWithInvalidAmount('Bond Amount');
  },
);

test(
  title('TC-040'),
  { tag: tags },
  async ({ authenticatedSession, dashboardPage, bondCreationPage }) => {
    void authenticatedSession;
    await openConfiguredQuote(dashboardPage, bondCreationPage);
    await bondCreationPage.assertFieldsBlank([
      'Contractor License Number',
      'Contractor License Effective Date',
      'Contractor License Bond Amount',
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
    await bondCreationPage.selectOption('Business Structure', bondCreationData.businessStructure!);
    await bondCreationPage.selectOption('State of Incorporation', bondCreationData.stateOfIncorporation!);
    await bondCreationPage.fillField('How many years have you held this license?', bondCreationData.yearsHeldLicense!);
    await bondCreationPage.fillField(
      'Percentage of business done in state of incorporation',
      bondCreationData.businessPercentage!,
    );
    expect(await bondCreationPage.fieldValue('Business Structure')).toBe(bondCreationData.businessStructure);
    expect(await bondCreationPage.fieldValue('State of Incorporation')).toBe(
      bondCreationData.stateOfIncorporation,
    );
    expect(await bondCreationPage.fieldValue('How many years have you held this license?')).toBe(
      bondCreationData.yearsHeldLicense,
    );
    expect(await bondCreationPage.fieldValue('Percentage of business done in state of incorporation')).toBe(
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
      await bondCreationPage.fillField('Value (%)', value);
      await bondCreationPage.blurField('Value (%)');
      expect(await bondCreationPage.fieldValue('Value (%)')).toBe(value);
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
      await bondCreationPage.selectOption('Assigned Producer', bondCreationData.producer);
    }
    const specialInstructions = 'A'.repeat(500);
    await bondCreationPage.fillField('Special Instructions', specialInstructions);
    expect(await bondCreationPage.fieldValue('Special Instructions')).toBe(specialInstructions);
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
