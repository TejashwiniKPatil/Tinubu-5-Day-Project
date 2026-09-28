# Day 5 Test Summary Report

- **Date:** 2026-09-25 (updated 2026-09-28)
- **Environment:** Alpha Surety QA automated test runs; no build identifier recorded
- **Verdict:** **GO with accepted risks.** Not all Day 1 exit criteria are met; the open risks and conditions are listed under "Decision" at the end of this report.

## Coverage and results

### Plan coverage

Day 1 owns Login and Application/Bond Creation. The Day 2 workbook contains 45 cases, and `day-2/test-cases-additions.csv` adds 24 designed Bond Creation cases (TC-049 to TC-072): 8 decision-table, 11 state-transition, and 5 premium EP cases. The 24 new cases have not been executed.

**Status:** Defined.

### Workbook execution

The Day 3 record shows 17 Passed, 2 Failed, and 26 Not Executed. That is 17 of 19, or 89.5%, of executed cases. Only 19 of 45 cases, or 42.2%, have a recorded result.

**Status:** Incomplete. The 85% regression exit criterion is not established across the plan.

### Three-run repeatability

Evidence: `reports/flaky-triage/triage-2026-09-25T08-37-34-078Z/summary.json`. All three runs exited 1.

- Run 1: 7 passed, 4 failed, 4 skipped, 1 flaky.
- Run 2: 8 passed, 4 failed, 2 skipped, 2 flaky.
- Run 3: 8 passed, 4 failed, 4 skipped.

**Status:** Failed on 2026-09-25. On 2026-09-28 the three consistently failing tests (TC-024, TC-039, TC-018) were fixed: two ambiguous locators and one test-order problem. They then passed 9 of 9 attempts with no retries (see `day-4/flaky-triage.md`). The full three-run triage has not been repeated.

### Smoke suite

`npm run test:smoke` on 2026-09-25: 10 passed in 1.8 minutes, exit code 0.

**Status:** Passed for this run; no CI artifact is attached.

The `@smoke` tag now selects 13 tests. The 2026-09-25 run covered the 10-case design: TC-001, TC-003, TC-005 to TC-008, TC-016, and TC-019 to TC-021. API-001, API-002, and TC-018 have since been tagged `@smoke` and have no recorded smoke run. API-002 creates a bond on every run.

### CI

The workflow at `.github/workflows/playwright.yml` runs typecheck, `@smoke`, and uploads the HTML report. No GitHub Actions execution URL or artifact is recorded here.

**Status:** Configured; pipeline result unverified.

### Exploratory and error guessing

The Bond Creation exploratory session (45 minutes) found seven bugs, logged as DEF-002 and DEF-006 to DEF-011. See `day-3/exploratory-session-2.md`. The Login session (`day-3/exploratory-session-1.md`) and the 12 error guesses have not been executed.

**Status:** Partially complete.

### Automation

Playwright lists 37 tests in 10 spec files, split into `tests/ui/`, `tests/api/`, and `tests/hybrid/`: 13 `@smoke`, 14 `@regression`, 30 `@high-value`, 1 `@sanity`, and 1 `@hybrid`. No test skips: when data or the lockout account is missing, the test fails with a message naming what to configure, so every high-value result is a pass or a fail. TC-047 was added as a high-value regression case for DEF-005. It runs without a gate in every `@regression` and `@high-value` run and creates two bonds each time. No result is recorded yet.

**Status:** Framework complete; the latest repeatability run failed (see above).

### White-box

`npm run test:white-box` on 2026-09-28 ran 24 tests: 22 passed, and 2 failed as expected (WB-001, WB-003). Branch coverage was 94.29%, against a 90% threshold. The integration suite passed 2 of 2. See `day-4/white-box/white-box-test-evidence.md`.

**Status:** Complete for the white-box models.

### Gray-box

A supplied Network screenshot shows an XHR named `execute` returning 400. Playwright traces show `GET /bond/bonds/pending-bonds` returning 200 and `POST /auth/auth/token` returning 401 for failed stored sessions.

**Status:** Initial evidence captured; request and response fields and controlled retests are outstanding.

### Performance

Evidence: `day-5/performance/login-sla.md`. One 100-VU, login-only k6 run completed 100 requests in 3 seconds. It recorded 86% HTTP request failures and 14 successful Login responses with access tokens. The request logs showed the remote API host forcibly closing TCP connections. The reported custom latency percentile is invalid because failed requests contributed zero-duration samples; successful-response p95 was 1.37 seconds across only 14 responses.

The run used a script version that threw while parsing empty responses, so its `login_failure` rate is invalid. The script now handles empty/error responses and records HTTP status codes, but has not been rerun. Run timestamp and build identifier were not recorded.

**Status:** Failed. Both k6 scripts are now set to 5 VUs (`login-5-vus.ts` and `login-and-list.ts`), and a 5-VU run in a coordinated window is outstanding.

### Security

An Alpha-only manual checklist is prepared. No scanner or destructive check was used.

**Status:** Not run.

### Usability and accessibility

Five Nielsen findings are recorded (UX-01 to UX-05). Three have screenshots; UX-01 and UX-05 still need repository screenshots. The axe, Lighthouse, and keyboard checks have not been run.

**Status:** Incomplete.

## Open defect counts

### Alpha application

- **High:** 4
- **Medium:** 2
- **Low:** 5

All 11 defects are New.

- High: DEF-001 (long login input returns HTTP 500), DEF-002 (submit blocked despite an attached principal company), DEF-004 (created principal disappears after refresh), DEF-005 (identical create-bond requests create duplicates).
- Medium: DEF-003 (500-character note breaks layout), DEF-008 (company saved as "Unknown").
- Low: DEF-006, DEF-007, DEF-009, DEF-010, DEF-011 (validation messaging and cosmetic issues).

DEF-002 and DEF-006 to DEF-011 come from the Bond Creation exploratory session. DEF-002 blocks quote submission, so TC-044 and TC-045 cannot pass while it is open.

The Day 4 white-box defects WB-001 to WB-004 are in the login lockout and bond quote validator models, not proven in Alpha. They are recorded in `day-4/white-box/white-box-analysis.md`. WB-001 points to the lockout cases TC-011 to TC-014, and WB-003 points to TC-044.

The Day 1 test plan maps Severity-1 to High and Severity-2 to Medium. Open Alpha defects remain at both levels.

## Exit-criteria verdict

### Zero open Severity-1 defects

**Verdict:** Not met. DEF-001, DEF-002, DEF-004, and DEF-005 remain open High (Severity-1).

### Zero open Severity-2 defects

**Verdict:** Not met. DEF-003 and DEF-008 remain open Medium (Severity-2).

### 100% of smoke tests passed

**Verdict:** Met for the 10-case smoke design, which passed on 2026-09-25. Not demonstrated for the current 13-test `@smoke` suite, because three tests have been added without a new run. This does not erase the separate triage failures or establish CI execution.

### At least 85% of regression tests passed

**Verdict:** Not demonstrated. Twenty-six of 45 cases have no recorded result. The executed subset rate alone is insufficient for full-plan exit.

### Critical Login scenarios executed

**Verdict:** Not demonstrated. No current case-level Login execution record is attached.

### Critical Application/Bond Creation scenarios executed

**Verdict:** Not met. The repeatability run contains failures and skipped cases, and DEF-002 blocks quote submission, so TC-044 and TC-045 cannot complete.

### Failed tests documented

**Verdict:** Met. Workbook failures, defects, and triage logs are recorded. The three tests that failed every repeatability run were diagnosed, fixed, and then passed 9 of 9 attempts (see `day-4/flaky-triage.md`).

## Decision: GO with accepted risks

By the strict Day 1 exit criteria, the release does not qualify: the Severity-1, Severity-2, regression, and critical-scenario criteria above are not met. The criteria have not been changed. The pod has decided to release with the known risks accepted and recorded.

### Reasons

- The build-acceptance smoke suite passed (10 of 10 on 2026-09-25).
- The automation instability came from test issues (two ambiguous locators and one test-order problem). It is fixed and verified.
- Five of the 11 open defects are Low severity (messaging and cosmetic).
- Every open High and Medium defect is logged with reproduction steps and evidence, so the risks are known.

### Accepted risks

- **DEF-002 (High):** Quote submission is blocked in the attached-principal path until it is fixed.
- **DEF-005 (High):** A repeated create-bond request creates a duplicate bond (reproduced on 2026-09-28: BondId 1012032 and 1012033).
- **DEF-001 (High):** Very long login input returns HTTP 500.
- **DEF-004 (High):** A created principal disappears after refresh.
- **DEF-003 and DEF-008 (Medium):** A long note breaks the layout, and an incomplete company is saved as "Unknown".
- **Coverage:** 26 of the 45 workbook cases, the security checklist, and the accessibility pass have not been executed.

### Conditions

1. Fix and retest DEF-002 and DEF-005 first, before users rely on quote submission and bond creation.
2. Fix and retest the remaining High and Medium defects in the next cycle.
3. Execute the remaining workbook cases, the security checklist, and the accessibility pass, and rerun regression.
