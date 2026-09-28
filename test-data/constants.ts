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
export const agencySelectPlaceholder = 'Search select agency...';
export const agencyName = 'TEST - *** Test Agency ***';


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