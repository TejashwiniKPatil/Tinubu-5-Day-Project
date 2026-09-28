# Tinubu Surety QA

QA planning, test design, defect evidence, and Playwright automation for Tinubu Surety Alpha. Day 5 evidence and demo materials are recorded under `day-5/`.

## Application and owned features

- Application: Tinubu Surety Alpha
- URL: `https://alphanewui.tinubusurety.com` (override with `URL`)
- Features: Login, Logout, and Application/Bond Creation
- Automation: Playwright Test, TypeScript, Chromium

## Setup

1. Install Node.js 24 or newer.
2. Run `npm ci`.
3. Install Chromium with `npx playwright install chromium`.
4. Copy `.env.example` to `.env` and configure `URL`, `TEST_USERNAME`, and `TEST_PASSWORD`, or provide them through an approved secret store. Global setup creates Playwright storage state for authenticated scenarios; login and lockout specs use their dedicated login paths. Never commit or print credentials.

## Run automation

```powershell
npm run typecheck
npm test
npm run test:full
npm run test:smoke
npm run test:bond-creation
npm run test:bond-creation:smoke
npm run test:regression
npm run test:sanity
npm run test:hybrid
npm run test:high-value
npm run test:lockout
npm run test:list
npm run test:white-box
npm run test:white-box:integration
npm run test:flaky-triage
npm run report
```

The standard `npm test`, regression, and high-value commands leave out the account-lockout group. Run `npm run test:full` to run the standard suite first and lockout cases last, or use `npm run test:lockout` to run only that group. Lockout cases change account state and require a dedicated resettable account configured through `LOCKOUT_TEST_USERNAME` and `LOCKOUT_TEST_PASSWORD`; reset it before running. Flaky triage excludes stateful Login and Bond Creation cases, runs the remaining Chromium suite three times, and writes evidence to a timestamped directory under `reports/flaky-triage/`.

## Project map

- **`day-1/`:** Test plan, SDLC and QA mapping, owned workflows, initial application analysis
- **`day-2/`:** 45-case test workbook, 24 additional cases in `test-cases-additions.csv` (decision table, bond lifecycle, and premium), the decision table, the bond lifecycle state diagram, skill usage evidence, the skill trigger note, and the workbook review note
- **`day-3/`:** Execution record, exploratory records, error guesses, defect reports, and lifecycle guidance
- **`day-4/`:** Automation selection, clean-context POM review, flaky triage notes, white-box models (login lockout and bond quote validator), tests, and execution evidence
- **`day-5/`:** Gray-box designs, Alpha-only security checklist, k6 performance scripts and SLA evidence, usability and accessibility evidence, summary report, and demo runbook
- **`.claude/commands/`:** `/explore-features` and `/new-page-object` instructions
- **`.claude/skills/`:** `test-case-designer`, `bug-report`, and `playwright-pom` skills, including references and templates
- **`src/pages/`:** Page Object Models; selectors and user-facing assertions live here
- **`src/helpers/`:** Reusable Bond Creation workflows built on the Page Objects
- **`src/utils/`:** Small shared utilities, including required environment variable lookup
- **`src/fixtures/`:** Shared Page Object fixtures and data-driven Login cases
- **`src/api/`:** API client classes used by the API specs
- **`src/global-setup.ts`:** One-time authentication and storage-state creation
- **`tests/`:** Playwright spec files only, grouped by test type: `ui/` (with `bond-creation/` including sanity, `login/` including lockout and profile menu, and `logout/`, which runs last because it ends the shared session), `api/`, and `hybrid/` for tests that combine UI and API steps
- **`test-data/`:** Environment-backed constants, Login data, and high-value case manifests
- **`screenshots/ui-bugs/`:** UI defect evidence, named by the observed problem
- **`.github/workflows/`:** CI workflow: typecheck, then smoke, regression, and high-value, then the Login lockout tests last, with one HTML report per suite uploaded as an artifact

`CLAUDE.md` contains project conventions and safety rules. `AI-LOG.md` records significant AI-assisted work and reviewer corrections. `.env`, `node_modules/`, `test-results/`, and `playwright-report/` are local or generated; they are excluded from version control.

## Day 1–5 status

The workbook records 45 test cases. The Day 3 execution note reports 17 passed, 2 failed, and 26 not executed. These results are not a release pass: the failed and unexecuted cases remain outstanding, and sanity evidence is not recorded as completed. The 10-case `@smoke` suite passed locally on 2026-09-25. The tag now selects 13 tests, because API-001, API-002, and TC-018 were tagged after that run. See `day-5/test-summary-report.md`.

The Bond Creation exploratory session found seven bugs (DEF-002, DEF-006 to DEF-011). With the earlier reports, there are 11 open Alpha defects: 4 High, 2 Medium, and 5 Low. The Login exploratory session and the error guesses have not been executed yet.

The decision table in `day-2/decision-table.md` combines credit tier, bond amount, indemnitor, and prior claims into 8 rules (TC-049 to TC-056). Two rules match observed Alpha behaviour; the others say "requirement to confirm", because Alpha's approval matrix is not documented. The bond lifecycle, with a state diagram, is in `day-2/bond-lifecycle-state-transitions.md` (TC-057 to TC-067).

The workbook also duplicates the long-username title/steps for TC-009 and TC-010, while the automation uses TC-010 for the long-password partition. See `day-2/test-case-review-notes.md` and reconcile the workbook before presenting it.

Day 4 includes the 15 selected high-value case IDs in tagged specs, data-driven Login coverage, global setup that saves authentication state for protected scenarios, a GitHub Actions smoke workflow, and two white-box modules that model Alpha behaviour: login lockout and bond quote validation. Login and lockout specs use empty storage state. The four account-lockout cases are serial and require a dedicated resettable account. See `day-4/automation-selection.md` and `day-4/white-box/white-box-analysis.md` for rationale and limitations.

The 15 selected Bond Creation cases from the latest workbook are automated in `tests/ui/bond-creation/start-bond.spec.ts`, with titles in `test-data/bondCreationCases.ts`. Configure principal, underwriter, and business-structure values in `.env` for dependent cases. TC-044 and TC-045 submit bonds, and the TC-047 API case (`tests/api/duplicate-bond-api.spec.ts`) checks DEF-005 duplicate bond creation. None of them is skipped, so each run creates bonds; use approved disposable QA data. No high-value test skips: missing data or a missing lockout account makes the test fail with a clear message. Typechecking and test discovery do not count as Alpha execution evidence. See `day-4/automation-selection.md` for the exact case set and limits.

The white-box unit run enforces at least 90% branch coverage and reached 94.29%. It found four defects: WB-001 (the account locks on the second failed login instead of the third), WB-002 (an unreachable login reset branch), WB-003 (exactly 500 characters of Special Instructions are rejected), and WB-004 (an unreachable party-count branch). The WB-001 and WB-003 tests intentionally stay failing as evidence. The Day 5 summary records the latest failed three-run triage and distinguishes observed evidence from checks that have not run.

## Current release position

The Day 5 verdict is **No-Go**: 11 defects remain open, including 4 High (DEF-002 blocks quote submission), regression execution is incomplete, the latest three-run triage failed, and smoke has only a local passing run without a verified CI artifact. Performance, security, and accessibility checks are incomplete. See `day-5/test-summary-report.md`; do not describe planned or missing execution evidence as completed.

## Run k6

k6 does not read `.env`; export the required variables first, and run only in a coordinated window (see `day-5/performance/login-sla.md`). Run from the project root:

```powershell
k6 run day-5/performance/login-100-vus.ts
k6 run day-5/performance/login-and-list.ts
```

If `k6` is not on your PATH, use the full path to `k6.exe` from your k6 installation folder.
