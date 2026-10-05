import { bondCreationData, missingBondCreationData } from '../../test-data/bondCreationData';
import { bondFields, prePayOneYear } from '../../test-data/constants';
import { BondCreationPage } from '../pages/BondCreationPage';
import { DashboardPage } from '../pages/DashboardPage';

/** Opens the bond picker from the authenticated dashboard. */
export async function openBondSelection(
  dashboardPage: DashboardPage,
  bondCreationPage: BondCreationPage,
): Promise<void> {
  await dashboardPage.openBondCreation();
  await bondCreationPage.assertAgencySelectorReady();
}

/** Follows the selected agency and Commercial form path into the quote. */
export async function openConfiguredQuote(
  dashboardPage: DashboardPage,
  bondCreationPage: BondCreationPage,
): Promise<void> {
  await openBondSelection(dashboardPage, bondCreationPage);
  await bondCreationPage.searchAndSelectAgency(bondCreationData.agencyName);
  await bondCreationPage.selectCommercialFamily();
  await bondCreationPage.searchAndSelectBond(
    bondCreationData.bondFormSearch,
    bondCreationData.bondTypeName,
  );
}

/** Fills the required fields used by validation and submission cases. */
export async function fillRequiredQuoteData(
  bondCreationPage: BondCreationPage,
  amount: string,
): Promise<void> {
  const missing = missingBondCreationData(['principalSearch', 'underwriter']);
  if (missing.length) throw new Error(`Configure ${missing.join(', ')} in .env for this case.`);

  await bondCreationPage.searchAndSelectPrincipal(bondCreationData.principalSearch!);
  await bondCreationPage.fillField(bondFields.bondAmount, amount);
  await bondCreationPage.selectOption(bondFields.prePay, prePayOneYear);
  if (await bondCreationPage.isFieldShown(bondFields.selectTrade)) {
    await bondCreationPage.selectOption(bondFields.selectTrade, bondCreationData.trade);
  }
  if (bondCreationData.effectiveDate) {
    await bondCreationPage.fillField(bondFields.effectiveDate, bondCreationData.effectiveDate);
  }
  await bondCreationPage.selectOption(bondFields.underwriter, bondCreationData.underwriter!);
}
