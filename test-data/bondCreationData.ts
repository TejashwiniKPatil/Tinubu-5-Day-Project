import { getOptionalEnvironmentVariable } from '../src/utils/environment';
import { agencyName } from './constants';

/** QA data used by Bond Creation; account-specific values come from the local environment. */
export const bondCreationData = {
  agencyName: getOptionalEnvironmentVariable('BOND_AGENCY_NAME') ?? agencyName,
  agencyHeader: getOptionalEnvironmentVariable('BOND_AGENCY_HEADER') ?? '*** Test Agency ***',
  state: getOptionalEnvironmentVariable('BOND_STATE') ?? 'Virginia',
  carrier: getOptionalEnvironmentVariable('BOND_CARRIER') ?? 'FAKE A BONDING COMPANY (GOLDEN)',
  bondFormSearch: getOptionalEnvironmentVariable('BOND_FORM_SEARCH') ?? 'Agriculture Dealers Bond',
  bondTypeName: getOptionalEnvironmentVariable('BOND_TYPE_NAME') ?? 'Agricultural Products Dealer',
  principalSearch: getOptionalEnvironmentVariable('BOND_PRINCIPAL_SEARCH'),
  underwriter: getOptionalEnvironmentVariable('BOND_UNDERWRITER'),
  producer: getOptionalEnvironmentVariable('BOND_PRODUCER'),
  businessStructure: getOptionalEnvironmentVariable('BOND_BUSINESS_STRUCTURE'),
  stateOfIncorporation: getOptionalEnvironmentVariable('BOND_STATE_OF_INCORPORATION'),
  yearsHeldLicense: getOptionalEnvironmentVariable('BOND_LICENSE_YEARS'),
  businessPercentage: getOptionalEnvironmentVariable('BOND_BUSINESS_PERCENTAGE'),
  effectiveDate: getOptionalEnvironmentVariable('BOND_EFFECTIVE_DATE'),
};

export type BondCreationDataKey = keyof typeof bondCreationData;

export function missingBondCreationData(keys: BondCreationDataKey[]): string[] {
  return keys.filter((key) => !bondCreationData[key]);
}
