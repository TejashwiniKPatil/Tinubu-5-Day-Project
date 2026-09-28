# Day 3 Execution Record

## Suite Definitions

Smoke means the ten build-acceptance cases selected from Login and Bond Creation: TC-001, TC-003, TC-005 to TC-008, TC-016, and TC-019 to TC-021. It is intended to run in less than ten minutes and stops release testing when a critical path fails. The `@smoke` tag currently selects 13 tests, because API-001, API-002, and TC-018 were tagged later.

Sanity means a narrow recheck of one module after a fix. A sanity result cannot replace full regression coverage.

Regression means the complete 45-case sheet, including cases that are not automated. Manual cases must record Actual Result and Status in the workbook or an attached execution record.

A case cannot legitimately belong to all three suites just because it is important. Smoke is a small release gate, sanity is change-focused verification, and regression is broad change-impact coverage. The same scenario may be reused only when its purpose and evidence are recorded separately.

## Run Summary

- **R-01, before 2026-09-24, regression (manual workbook):** 17 passed, 2 failed, 26 not executed. Incomplete.
- **R-02, 2026-09-25, repeatability run 1 (automated):** 7 passed, 4 failed, 1 flaky, 4 skipped. Failed.
- **R-03, 2026-09-25, repeatability run 2 (automated):** 8 passed, 4 failed, 2 flaky, 2 skipped. Failed.
- **R-04, 2026-09-25, repeatability run 3 (automated):** 8 passed, 4 failed, 0 flaky, 4 skipped. Failed.
- **R-05, 2026-09-25, smoke (automated):** 10 passed, 0 failed. Passed.
- **R-06, date not recorded, exploratory Bond Creation session (manual):** 7 bugs found. Executed.
- **R-07, 2026-09-28, white-box unit and integration:** 24 passed, 2 expected failures. Defects confirmed.
- **R-08, 2026-09-28, post-fix stability recheck (automated):** 9 passed, 0 failed.
- **R-09, 2026-09-28, logout order check (automated):** 2 passed, 0 failed.

Environment for all Alpha runs: Alpha Surety QA (https://alphanewui.tinubusurety.com), Chromium. No build identifier was recorded. The repository had no commits at the time of these runs. Credentials are omitted.

## Automated and Manual ID Mapping

The automated Bond Creation specs use different case numbers from the workbook for three cases. This record uses workbook IDs, with the automated ID in brackets.

- **Workbook TC-039** (optional License and Permit fields can remain blank) is **TC-040** in automation.
- **Workbook TC-040** (Contractor Insurance, Business Structure and State of Incorporation) is **TC-041** in automation.
- **Workbook TC-042** (Modifier Value boundary values) is **TC-043** in automation.

Align the IDs in `test-data/bondCreationCases.ts` with the workbook before the next run, so failures trace to the right case.

## R-01 Regression (manual workbook)

- **Run ID:** R-01
- **Run date:** Before 2026-09-24. The exact date was not recorded in the workbook.
- **Build or commit:** Not recorded
- **Suite and command:** Regression, full 45-case sheet, executed manually
- **Browser:** Chrome, per the test plan. The workbook does not record the browser per case.
- **Case IDs:** TC-001 to TC-045
- **Passed:** 17
- **Failed:** 2
  - TC-009, excessively long username: HTTP 500
  - TC-010, excessively long password: HTTP 500
- **Blocked:** None recorded. 26 cases (TC-020 to TC-045) are Not Executed. TC-044 and TC-045 should be recorded as Blocked while DEF-002 prevents quote submission.
- **Evidence:** `day-2/test-cases.xlsx`
- **Defects raised:** DEF-001

The tester reports that the Bond Creation flows passed manual verification. The workbook still shows TC-020 to TC-045 as Not Executed, so those passes are not counted until the workbook is updated with results and dates.

## R-02 to R-04 Repeatability Runs (automated)

- **Run ID:** R-02 (run 1), R-03 (run 2), R-04 (run 3)
- **Run date:** 2026-09-25
- **Build or commit:** Not recorded; the repository had no commits yet
- **Suite and command:** Repeatable Chromium suite, run 3 times with `npm run test:flaky-triage`, one retry per test. Stateful Login and Bond cases were excluded.
- **Browser:** Chromium (Playwright Desktop Chrome)
- **Case IDs:** 16 tests per run: TC-016, TC-018, the Bond Creation cases in `startbond.spec.ts`, and the sanity spec. The spec files were later split and renamed (`tests/login/session.spec.ts`, `tests/bond-creation/startbond.spec.ts`, `tests/sanity.spec.ts`).
- **Passed:** Run 1: 7. Run 2: 8. Run 3: 8.
- **Failed:** 4 in each run. Flaky: 1 in run 1, 2 in run 2, 0 in run 3.
- **Blocked:** Skipped because of data or stateful gates: 4 in run 1, 2 in run 2, 4 in run 3.
- **Evidence:** `reports/flaky-triage/triage-2026-09-25T08-37-34-078Z/` (`run-1.log` to `run-3.log`, `summary.json`, and a `trace.zip` for each retried test)
- **Defects raised:** None. The failures are not yet classified as application defects.

Results per test, using workbook IDs:

- **TC-024, selected bond header information:** failed in runs 1, 2, and 3.
- **TC-039 [TC-040], optional License and Permit fields blank:** failed in runs 1, 2, and 3.
- **TC-018, profile menu contains Log Out:** failed in runs 1, 2, and 3.
- **TC-016, logout from authenticated session:** failed in run 1, passed in runs 2 and 3.
- **Bond Creation entry flow (sanity):** passed in run 1, failed in runs 2 and 3.
- **TC-042 [TC-043], Modifier Value boundary values:** flaky in run 1, passed in runs 2 and 3.
- **TC-027, bond amount below minimum:** flaky in run 2, passed in runs 1 and 3.
- **TC-040 [TC-041], Contractor Insurance, Business Structure and State:** flaky in run 2, passed in runs 1 and 3.

Run 1 took 51.6 minutes; runs 2 and 3 took 5.6 and 5.3 minutes.

The failure output shows three causes (see `day-4/flaky-triage.md`):

- strict-mode locator ambiguity for "Agricultural Products Dealer" and "Surcharges & Discounts"
- the saved session invalidated after the logout case
- intermittent Alpha DNS and network failures

Locator fixes were made in `src/pages/BondCreationPage.ts`, and logout was isolated as the last spec. The post-fix rerun and the Trace Viewer review have not been done yet.

## R-05 Smoke (automated)

- **Run ID:** R-05
- **Run date:** 2026-09-25
- **Build or commit:** Not recorded; the repository had no commits yet
- **Suite and command:** Smoke, `npm run test:smoke`
- **Browser:** Chromium (Playwright Desktop Chrome)
- **Case IDs:** TC-001, TC-003, TC-005 to TC-008, TC-016, and TC-019 to TC-021
- **Passed:** 10, in 1.8 minutes, exit code 0
- **Failed:** 0
- **Blocked:** 0
- **Evidence:** Recorded in `day-5/test-summary-report.md` and `AI-LOG.md`. The HTML report from this run was not kept, and no CI run exists yet.
- **Defects raised:** None

The `@smoke` tag now selects 13 tests. Rerun it to cover API-001, API-002, and TC-018, or remove those tags.

## R-06 Exploratory Session, Bond Creation (manual)

- **Run ID:** R-06
- **Run date:** Not recorded on the session sheet
- **Build or commit:** Not recorded
- **Suite and command:** Exploratory charter session, about 45 minutes (time split estimated)
- **Browser:** Not recorded
- **Case IDs:** Charter-based, not case-based. It covered Bond Creation Steps 1, 2, 3, 5, and 8 in depth, and opened Steps 4, 6, and 7.
- **Passed:** Step 1 (Start New Bond) behaved as documented
- **Failed:** Steps 2, 3, and 5 produced 7 bugs
- **Blocked:** Step 8 (Finalize). No successful submit was reached because of DEF-002.
- **Evidence:** `exploratory-session-2.md`; screenshots `screenshots/ui-bugs/penalty-limit-duplicate-errors.png` and `screenshots/ui-bugs/on-this-page-nav-overlap.png`
- **Defects raised:** DEF-002 (High, blocks submission), DEF-006, DEF-007, DEF-008, DEF-009, DEF-010, and DEF-011

## R-07 White-Box (unit and integration)

- **Run ID:** R-07
- **Run date:** 2026-09-28
- **Build or commit:** Not applicable; local white-box models, not Alpha
- **Suite and command:** `npm run test:white-box` (unit, with coverage) and `npm run test:white-box:integration`
- **Browser:** Not applicable; Node.js v24.21.0
- **Case IDs:** Lockout model TC-011 to TC-014; quote validator model TC-026 to TC-044; two stub-based integration tests
- **Passed:** 22 unit tests and 2 integration tests. Branch coverage 94.29%.
- **Failed:** 2 expected failures. "TC-012" reproduces WB-001 (locks on the second failure), and "TC-044" reproduces WB-003 (500 characters rejected).
- **Blocked:** 0
- **Evidence:** `day-4/white-box/white-box-test-evidence.md`
- **Defects raised:** WB-001 to WB-004, recorded in `day-4/white-box/white-box-analysis.md`. These are model defects, not Alpha defects.

## R-08 and R-09 Post-Fix Stability Recheck (automated)

- **Run ID:** R-08 (stability), R-09 (order check)
- **Run date:** 2026-09-28
- **Build or commit:** Not recorded
- **Suite and command:** R-08: `npx playwright test --project=chromium --grep "TC-024|TC-040|TC-018" --repeat-each=3 --retries=0 --trace=on`. R-09: `--grep "TC-018|TC-016"`.
- **Browser:** Chromium (Playwright Desktop Chrome)
- **Case IDs:** TC-024, TC-039 [TC-040], and TC-018, three times each; then TC-018 and TC-016
- **Passed:** R-08: 9 of 9 in 2.2 minutes. R-09: 2 of 2, with logout last.
- **Failed:** 0
- **Blocked:** 0
- **Evidence:** `reports/stability-2026-09-28/` (a trace for every attempt); root causes and fixes in `day-4/flaky-triage.md`
- **Defects raised:** None. All three failures were test issues: two ambiguous locators and one test-order problem.

## Sanity Status

The `@sanity` spec, the Bond Creation entry flow, ran inside the repeatability runs. It passed in run 1 and failed in runs 2 and 3. No dedicated post-fix sanity run is recorded.

## Runs Still Needed

Record each of these as a new run (R-08 onward) with the same fields as above.

- Sanity: run `npm run test:sanity` after the locator fixes.
- Regression: execute the 26 unexecuted workbook cases, or add the reported manual results with dates.
- Smoke: rerun the current 13-test `@smoke` suite.
- Repeatability: the three consistently failing tests pass after the fixes (R-08). Rerun the full three-run triage once the Bond Creation data is in `.env`.
- Exploratory: run the Login session (`exploratory-session-1.md`).
- Stateful cases: TC-044, TC-045, and TC-047 run with the regression and high-value suites and create bonds each time. Use approved disposable data.
- Lockout: run `npm run test:lockout` with the dedicated resettable account.
