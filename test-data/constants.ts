import dotenv from 'dotenv';

dotenv.config();

export const profileName = 'Interns Test';
export const logoutText = 'Log out';
export const signInText = 'Sign In';
export const loginLabels = {
  username: 'Username',
  password: 'Password',
};

export const URL = process.env.URL ?? '';
export const USERNAME = process.env.TEST_USERNAME ?? '';
export const PASSWORD = process.env.TEST_PASSWORD ?? '';

export const firstFailedLoginAttemptMessage =
  'Invalid credentials. Please try again. 2 attempts remain before your account is locked out.';
export const secondFailedLoginAttemptMessage =
  'Invalid credentials. Please try again. 1 attempts remain before your account is locked out.';
export const accountLockedMessage = 'Your account has been locked. Try again in 15 minutes.';

export const bondCreationHeading = 'Start your Quote';
// Renamed from 'Start New Bond'; the sanity check fails if the label changes again.
export const startBondButtonText = 'Start a Bond';
// The Bonds list page button kept the old label (observed 2026-09-29).
export const allBondsStartButtonText = 'Start New Bond';
export const agencySelectPlaceholder = 'Search select agency...';
export const agencyName = 'TEST - *** Test Agency ***';

// UI text used only where the element has no data-testid. Update here when the app wording changes.
export const bondNavText = 'Bonds';
export const surchargesHeading = 'Surcharges & Discounts';
export const specialInstructionsPlaceholder = 'Add special instructions (optional)...';
export const unsavedChangesMessage =
  'You have unsaved changes. Are you sure you want to leave without saving?';
export const quoteHeaderLabels = {
  agency: 'Agency',
  state: 'State',
  carrier: 'Carrier',
  bondType: 'Bond Type',
};

/** Bond Creation field names; BondCreationPage maps each to its data-testid. */
export const bondFields = {
  bondAmount: 'Bond Amount',
  prePay: 'Pre Pay Selection',
  existingBondNumber: 'Existing Bond Number',
  effectiveDate: 'Effective Date',
  expirationDate: 'Expiration Date',
  bondUserVersion: 'Bond User Version',
  contractorLicenseNumber: 'Contractor License Number',
  contractorLicenseEffectiveDate: 'Contractor License Effective Date',
  contractorLicenseBondAmount: 'Contractor License Bond Amount',
  businessStructure: 'Business Structure',
  stateOfIncorporation: 'State of Incorporation',
  yearsHeldLicense: 'How many years have you held this license?',
  businessPercentage: 'Percentage of business done in state of incorporation',
  modifierValue: 'Value (%)',
  underwriter: 'Assigned Underwriter',
  producer: 'Assigned Producer',
  specialInstructions: 'Special Instructions',
} as const;
export type BondField = (typeof bondFields)[keyof typeof bondFields];
export const prePayOneYear = '1 Year';


export const clientId = process.env.TEST_CLIENT_ID ?? '';
export const grantType = process.env.TEST_GRANT_TYPE ?? '';

export const payload={"actionType":1,
    "bondTypeId":700000,
    "accountId":1000262,
    "agencyId":500000,
    "obligeeId":700000,
    "penalty":2000,
    "effectiveDate":"2026-09-25",
    "responsibleUnderwriterId":700018,
    "riskStateId":13,
    "prePaySelection":1,
    "billingTypeId":1,
    "overriddenBondNumber":null,
    "applicantName":"NUI1157 DupCo LLC",
    "applicantType":2,
    "applicantIndex":1,
    "applicantTaxExempt":true,
    "lifeCycleEventId":1,
    "questionAnswers":[{"questionGroupTemplateId":700042,
      "index":1,"existingCompanyId":1000125,
      "answers":[{"questionTemplateId":700204,
        "answer":""},{"questionTemplateId":700205,
          "answer":"991234567"},
          {"questionTemplateId":500007,
            "answer":"NUI1157 DupCo LLC"}]}]}

export const payload2={"actionType":1,
  "bondTypeId":500008,"accountId":1000157,
  "agencyId":700014,"obligeeId":500087,
  "penalty":40000000,
  "effectiveDate":"2026-09-25",
  "responsibleUnderwriterId":700109,
  "riskStateId":66,"prePaySelection":3,
  "billingTypeId":1,
  "overriddenBondNumber":null,
  "applicantName":"qwADSF",
  "applicantType":2,
  "applicantIndex":1,
  "lifeCycleEventId":1,
  "questionAnswers":[{"questionGroupTemplateId":1000057,
    "index":1,"answers":[{"questionTemplateId":1000328,
      "answer":"qwADSF"},{"questionTemplateId":1000332,"answer":""}]},
      {"questionGroupTemplateId":700006,
        "index":1,
        "answers":[{"questionTemplateId":1000099,
          "answer":"15702 W New Ct|WEDW4|Wasilla|2|99623-9650|0|Alaska|0|AK|Matanuska Susitna|||USA"},
          {"questionTemplateId":700034,"answer":""},
          {"questionTemplateId":1000100,"answer":""},
          {"questionTemplateId":1000101,"answer":"1"},
          {"questionTemplateId":1000102,"answer":""},
          {"questionTemplateId":1000103,"answer":""},
          {"questionTemplateId":1000104,"answer":""},
          {"questionTemplateId":1000105,"answer":""},
          {"questionTemplateId":1000158,"answer":""}]},
          {"questionGroupTemplateId":1000020,"index":1,
            "answers":[{"questionTemplateId":1000170,"answer":""}]}]}
// Non-functional checks (@security, @performance, @usability).
export const protectedPath = '/bonds';
export const htmlInjectionMarker = '<b>QA-CHECK</b>';
/** Proposed targets; they need product and QA owner approval before release use. */
export const performanceTargets = {
  loginPageLoadMs: 3_000,
  dashboardReadyMs: 5_000,
  bondStepMs: 3_000,
  loginApiMs: 2_000,
};
