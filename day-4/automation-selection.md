# Day 4 High Value Automation Selection

The uploaded workbook contains Login, Logout, and Bond Creation cases. The 15 selected cases below are the highest value repeatable checks for the current Playwright framework.

Each case is scored from 1 to 5 for execution frequency, feature stability, data dependency, and business risk. A higher total means stronger automation value.

1. TC-001. Login with valid username and valid password. Scores: frequency 5, stability 5, data dependency 4, business risk 5, total 19.
2. TC-002. Login with valid username and invalid password. Scores: frequency 5, stability 5, data dependency 4, business risk 5, total 19.
3. TC-003. Login with invalid username and valid password. Scores: frequency 4, stability 5, data dependency 4, business risk 5, total 18.
4. TC-004. Login with invalid username and invalid password. Scores: frequency 4, stability 5, data dependency 4, business risk 4, total 17.
5. TC-005. Login with blank username. Scores: frequency 4, stability 5, data dependency 5, business risk 4, total 18.
6. TC-006. Login with blank password. Scores: frequency 4, stability 5, data dependency 5, business risk 4, total 18.
7. TC-007. Login with username and password blank. Scores: frequency 4, stability 5, data dependency 5, business risk 4, total 18.
8. TC-011. First failed login attempt. Scores: frequency 4, stability 4, data dependency 3, business risk 5, total 16.
9. TC-012. Second failed login attempt. Scores: frequency 3, stability 4, data dependency 3, business risk 5, total 15.
10. TC-013. Account locked after third failed attempt. Scores: frequency 3, stability 4, data dependency 2, business risk 5, total 14.
11. TC-014. Verify login cannot proceed after account lockout. Scores: frequency 3, stability 4, data dependency 2, business risk 5, total 14.
12. TC-016. Logout from authenticated session. Scores: frequency 5, stability 5, data dependency 4, business risk 5, total 19.
13. TC-019. Start a new bond workflow. Scores: frequency 5, stability 4, data dependency 3, business risk 5, total 17.
14. TC-020. Select an agency using supported search criteria. Scores: frequency 4, stability 4, data dependency 3, business risk 5, total 16.
15. TC-021. Select the Contract bond family and verify downstream choices. Scores: frequency 4, stability 3, data dependency 2, business risk 5, total 14.

The typed source of this selection is `test-data/highValueCases.ts`. The Playwright specs retain the workbook case IDs and use the same IDs in their titles. The manifest identifies the 15 Day 4 high-value workbook cases. Login cases TC-001–TC-010 and TC-015 are also data-driven regression coverage; they are not all part of this 15-case selection.

TC-046 is an additional project-created high-value regression case for DEF-003, outside the source workbook's 15-case selection. It covers entering a 500-character bond note and checking that the resulting page layout remains usable. Its expected result is based on the supplied screenshot and should be refined after reproducing the issue on a recorded build/browser.

TC-048 is a project-created hybrid case in `tests/hybrid/bond-amount-maximum.spec.ts`. It checks the $40,000,000 Bond Amount maximum through both layers: the quote form keeps the value, and the create-bond API accepts a bond with that penalty (`Success: true`, `Quote.Penalty` 40000000). It creates one bond per run, so it is tagged `@stateful-bond` and excluded from flaky triage.

TC-047 is an additional project-created high-value regression case for DEF-005, also outside the workbook's 15-case selection. It sends the same create-bond API payload twice and passes only if the second request returns HTTP 409 Conflict. Scores: frequency 3, stability 4, data dependency 2, business risk 5, total 14. It creates two bonds per run, so it is tagged `@stateful-bond` and excluded from flaky triage. It is not skipped: it runs in every `@regression` and `@high-value` run. It is expected to fail while DEF-005 is open.

## Why These Cases Are Automated

These cases run frequently, use stable user-facing flows, have controlled or environment-backed test data, and protect authentication, session termination, and the Bond Creation entry path. The Login state transition cases are included because lockout is a high risk security behavior. They require an account reset or disposable account for isolated execution.

## What Remains Manual

1. TC-008 to TC-010 and TC-015 remain outside this selected set because they are lower priority or boundary and format cases. They have supplementary data-driven regression automation. The workbook records long-input failures as HTTP 500; the tests assert controlled rejection and should remain failing until the defect is fixed rather than encode the 500 as expected behavior.
2. TC-017 and TC-018 remain useful logout checks, but are lower priority than the authenticated logout path in TC-016 for this 15 case selection.
3. Bond cases not in the additional Bond Creation selection (TC-022, TC-030–TC-039, and TC-042) require inactive accounts, approval/referral rules, authority limits, purchase flows, aggregate exposure, or duplicate-submission setup. These need configured accounts, stable downstream data, and stateful setup.
4. Visual, exploratory, usability, and volatile screen checks remain manual because functional assertions cannot replace human visual judgment or discovery.

No result is marked as passed by this document. The 10-case smoke design and the high-value and regression tags are wired into specs. No high-value test skips: every one must pass or fail. When required data or the lockout account is missing, the test fails with a message naming what to configure. The `@smoke` tag now selects 13 tests, because API-001, API-002, and TC-018 were tagged later. Global setup creates the saved state used by authenticated workflow cases; Login equivalence and lockout specs use empty storage state and perform their own login submissions. Execution status must come from the Playwright report or recorded manual evidence. The lockout subset fails with a clear message unless a dedicated resettable account is configured.

## Additional Bond Creation Selection

The separate `test-data/bondCreationCases.ts` manifest keeps the 15 selected workbook Bond Creation IDs: TC-019, TC-020, TC-021, TC-023–TC-029, TC-040, TC-041, TC-043, TC-044, and TC-045. The manifest titles and priorities follow `day-2/test-cases.xlsx`. The tester reports that these flows passed manual verification, but the workbook still records TC-020 to TC-045 as Not Executed. Add the manual results and dates to the workbook before counting them. Playwright scripts cover agency selection, product/header selection, principal search, bond amount boundaries, optional License and Permit fields, insurance/business details, modifier boundaries, submission, and cancellation.

`BOND_PRINCIPAL_SEARCH`, `BOND_UNDERWRITER`, and the TC-041 business data must be supplied from the approved QA records/options in `.env`. TC-044 and TC-045 create a bond on every run; use approved disposable QA data. The non-stateful Bond Creation specs ran against Alpha in the 2026-09-25 three-run triage, and the smoke subset passed on 2026-09-25. The triage runs still had failures; see `day-4/flaky-triage.md`. The screenshot’s "Penalty must not exceed 40000000.0000" error matches the documented $0–$40,000,000 Bond Amount range. Its missing currency formatting is logged as DEF-007.
