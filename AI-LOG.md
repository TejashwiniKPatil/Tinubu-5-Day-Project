# AI Log

Each entry records what was requested, what was produced, and what was corrected by the human reviewer.

Date: 2026-09-24
Request: Audit the five-day assignment through Day 4 and identify missing deliverables.
Produced: Repository audit covering plans, test cases, skills, Playwright framework, CI, and white-box artifacts.
Correction: Confirmed the audit against current files and workbook counts before reporting gaps.

Date: 2026-09-24
Request: Select and tag 15 high-value Playwright cases from the uploaded workbook.
Produced: High-value manifest, selection rationale, and Playwright tags.
Correction: Preserved the existing test IDs and titles after review.

Date: 2026-09-24
Request: Review and clean the project against assignment Days 1–4, excluding Day 5.
Produced: Rewrote the README to match the current layout and release evidence, corrected stale project and defect evidence paths, and filled the two empty exploratory session sheets with explicitly unexecuted templates. Removed the unused generated example spec, duplicate unused Login helper, and duplicate override-log placeholder.
Correction: Marked the 15-case selection as a planned selection rather than implying all selected Login tests are implemented; documented this gap and the outstanding execution evidence. No application execution was performed.

Date: 2026-09-24
Request: Bring the framework and Day 1–4 assignment artifacts in line with the requirements and common Playwright practices.
Produced: Added data-driven Login cases and serial, environment-gated lockout cases; standardized ten smoke and fifteen high-value tags; added npm scripts, strict TypeScript typechecking, a reset-aware flaky triage script, `.env.example`, and white-box coverage enforcement. Refactored the test-case-designer skill for progressive disclosure and recorded the missing approval rule matrix. Removed the unused vulnerable `xlsx` package and the unused Anthropic SDK; npm audit then reported zero vulnerabilities. Recorded white-box execution and clean-context Page Object review.
Correction: Kept Alpha execution evidence outstanding. Typechecking passed and Playwright discovery lists 21 cases. The local white-box run has one deliberate failure proving the 10,000 off-by-one defect; coverage is 96.30%, and the true outcome of the unreachable branch remains uncovered.

Review follow-up: A clean-context Page Object review found index-based agency selection, title-only logout confirmation, duplicated profile locator ownership, and an unused message locator helper. Replaced these with name-based agency selection, Login-form verification after logout, single-owner profile location, and removal of the unused helper. The review findings and changes are documented in `day-4/pom-review.md`.

Date: 2026-09-24
Request: Use clear, assignment-relative names for Day 4 white-box artifacts and remove the current need for storage state.
Produced: Renamed the analysis, execution evidence, and unit test to identify the premium-calculation work. Removed storage-state generation and its global setup; authenticated specs now log in through a shared per-test fixture.

Date: 2026-09-24
Request: Make the Day 4 calculator names easy to understand.
Produced: Renamed the calculator, unit and integration tests, analysis, and evidence to identify them as a standalone sample. Clarified that its example rules and recorded defects do not describe Alpha Surety behavior.

Date: 2026-09-24
Request: Add the selected high-value Bond Creation cases from the supplied workbook using the correct case numbers, after reviewing the project workflows and documentation.
Produced: Added a separate 15-case Bond Creation selection, aligned test IDs/titles with workbook rows, added shared page workflows and environment-backed test data, and kept record-creating cases opt-in behind resettable data. Preserved existing workflow and Markdown artifacts.
Correction: No Alpha UI run was performed. Data-dependent test cases need configured QA records; record-creating cases need explicit disposable-data opt-in.

Date: 2026-09-25
Request: Complete Day 5 deliverables and remaining assignment evidence, following repository Markdown guidance and the requested safety limits.
Produced: Added gray-box designs, an Alpha-only manual security checklist, a gated k6 script with explicit SLA thresholds, screenshot-backed usability findings, an evidence-based No-Go summary, and a 20-minute demo runbook. Updated triage documentation with the three-run results and README status; clarified duplicate POM locators and isolated logout as a stateful final spec.
Correction: Human reviewer has not yet reviewed this Day 5 work. Known corrections based on execution evidence: removed an ambiguous selector, moved the logout-mutating check out of repeatable triage, and documented that the session/network failures still need Trace Viewer review. Performance, security, smoke, and accessibility results remain unclaimed where they were not run.

Follow-up: Ran `npm run test:smoke` against Alpha on 2026-09-25 after network approval; 10/10 passed in 1.8 minutes. Updated the summary. The CI artifact is still unverified. No performance run was started because the required coordinated window is not yet known.

Date: 2026-09-28
Request: Verify the repository against the five-day assignment, then fix naming and consistency issues so file names follow one standard.
Produced: Renamed files to kebab-case: `day-1/application-analysis.md`, `day-2/test-cases.xlsx`, `day-2/skill-trigger-note.md`, `day-3/exploration-notes.docx`, `day-3/execution-record.md`, `day-4/automation-selection.md`, `day-5/performance/login-100-vus.ts` and `login-and-list.ts`, and `screenshots/ui-bugs/` with descriptive image names. Renamed specs by feature: `tests/bond-creation/start-bond.spec.ts`, `tests/bond-creation/bond-creation-sanity.spec.ts`, `tests/login/profile-menu.spec.ts`, and `tests/logout/logout.spec.ts`. Renamed the API clients to `LoginApi.ts`/`CreateBondApi.ts`, fixed the `LoginAPi` class name and the `playwright/test` import, and renamed the API test IDs to `API-001`/`API-002`. Updated every reference. Pointed `/new-page-object` at `src/pages/` and `src/fixtures/`, reduced the skill CSV template to its header row, added `.env.example` with variable names only, and added a Severity-1/2/3 mapping to the test plan and summary report.
Correction: The review found that the earlier entry claimed a `.env.example` that did not exist; it has now been created. The 2026-09-25 statement that no performance run was started is superseded by the 100-VU run recorded in `day-5/performance/login-sla.md`; the log does not record whether that window was coordinated. Moving the ordering-dependent specs out of the `00-`/`z-` prefixes was checked with `npm run typecheck` and `npx playwright test --list`: logout still runs last in the Chromium project. No Alpha test run was performed for this change.

Date: 2026-09-28
Request: Record the duplicate-bond API issue found during API testing as a high-value issue.
Produced: Updated DEF-005 with the real endpoint, payload source, and steps, and marked it high-value. Added high-value regression case TC-047 (`tests/api/duplicate-bond-api.spec.ts`), which posts the same payload twice and expects a rejection or the original result, plus manifest and selection entries.
Correction: The bug is the tester's observation; response bodies, bond IDs, and a date are still to be attached, so DEF-005 stays New. The test does not assume a bond ID field name, because the response schema has not been captured. It is gated behind `BOND_ALLOW_STATEFUL_SUBMISSIONS` because it creates records, and it was not run.

Date: 2026-09-28
Request: Replace DEF-002 (the white-box sample defect) with the bugs from the tester's Bond Creation exploratory session.
Produced: Replaced DEF-002 with the session's blocking submit bug and logged the other six session bugs as DEF-006 to DEF-011 in the existing defect format. Updated the summary report's defect counts (4 High, 2 Medium, 5 Low) and Severity-1/2 verdicts, the lifecycle note, the override log, and the exploration index with a session-ID mapping.
Correction: Renumbered the session IDs (DEF-01, 02, 04 to 08) because they clashed with the existing DEF-004 and DEF-005. Linked the two existing screenshots only where they match (DEF-007, DEF-009); the other defects are marked as still needing screenshots. The white-box off-by-one stays documented in `day-4/white-box/` without a defect ID.

Date: 2026-09-28
Request: Make the white-box bugs relevant to the application instead of unrelated sample rules.
Produced: Replaced the sample calculator with `bond-premium-calculator.ts`, which models the documented Alpha Bond Details rules (Bond Amount $0 to $40,000,000, Modifier 3% to 90%, Pre Pay 1 to 3 years, plus Day 2 decision-table conditions). Deliberate defects: WB-001, a `>=` off-by-one that rejects exactly $40,000,000 (linked to TC-028 and DEF-007), and WB-002, an unreachable `capped` branch after the modifier range check. Rewrote the unit and stub-based integration tests, the analysis (complexity 12, or 15 counting conditions), and the evidence. Unit run: 15 tests, 14 passed, 1 expected failure (WB-001); 96.43% branch coverage.
Correction: The first combined run reported 100% branch coverage, which was wrong. Running each file alone showed that Node's cross-process coverage merge hid the unreachable branch, so the coverage script now measures the unit suite alone and the integration test has its own script. Also found and fixed an unplanned bug in the new code: a `NaN` Modifier Value passed the range check and produced a `NaN` premium. The rates remain illustrative, and the model's defects are not evidence that Alpha has the same bugs.

Date: 2026-09-28
Request: Replace the premium calculator, which does not exist in the application, with white-box modules based on real application behaviour.
Produced: Removed the bond premium calculator. Added `login-lockout.ts` (lockout after three failed logins, from TC-011 to TC-014) and `bond-quote-validator.ts` (the Submit validation messages seen in the exploratory session and the documented limits), each with one off-by-one and one unreachable branch: WB-001 (locks on the second failure), WB-002 (unreachable login reset), WB-003 (rejects exactly 500 characters), and WB-004 (unreachable negative party count). Added unit suites named after the workbook cases, a stub-based integration suite, `white-box-analysis.md`, and `white-box-test-evidence.md`. Unit run: 24 tests, 22 passed, 2 expected failures (WB-001, WB-003); 94.29% branch coverage. Integration run: 2 of 2 passed.
Correction: Confirmed that the application source is not available, so both modules are models of observed behaviour, and their defects are not claimed as Alpha defects. Found and fixed an unplanned bug in the new validator: a `NaN` bond amount passed both range checks. Kept coverage measurement on the unit suites only, because Node's cross-process merge hides unreachable branches.

Date: 2026-09-28
Request: Review every project file and bring any outdated document up to date with the current results.
Produced: Filled `exploratory-session-2.md` from the tester's Bond Creation session. Updated the summary report with the current tag counts (36 tests, 13 `@smoke`), the exploratory, automation, and white-box sections, and the smoke verdict. Updated the execution record, exploration index, defect-lifecycle quadrant (DEF-002 and DEF-010 as real examples), usability findings UX-04 and UX-05 (from DEF-007 and DEF-006, with heuristics for all five), the automation selection, POM review, gray-box notes, and error-guess notes. Updated the BVA reference with Login and lockout boundaries and the bond-type-specific limits, and updated the Day 1 workflows, application URL, agent file, test plan scope, and README.
Correction: Fixed a factual error in `automation-selection.md`: the screenshot shows a $40,000,000 limit, not $4,000,000. Removed the claim that the Bond Creation specs never ran against Alpha, because the 2026-09-25 triage ran them. Marked the exploratory time split as estimated, because the session sheet said it was not measured with a stopwatch. Flagged that the workbook still shows TC-020 to TC-045 as Not Executed, despite the reported manual passes. Checked the 2026-09-28 HTML report: it came from a `--list` command, not a test run, so no new result was recorded. Error guesses stay Not Tested; related defects are noted but not counted as hits.

Date: 2026-09-28
Request: Prepare a complete demo guide covering every file, the code, and all commands.
Produced: `demo.md` at the project root, with pre-demo fixes, a 20-minute script, a command reference, a file-by-file and code walkthrough, key numbers, the No-Go defence, honest gap answers, and likely questions.
Correction: While reading the code for the guide, found three demo risks and listed them first: TC-018 is tagged `@smoke` but failed in all three repeatability runs; API-001 and API-002 are tagged `@smoke` but CI does not pass `LOGIN_API`, `TEST_CLIENT_ID`, or `TEST_GRANT_TYPE`; and API-002 creates a bond on every smoke run. Also noted the app's "1 attempts remain" message as a possible Low defect.

Date: 2026-09-28
Request: Stop skipping TC-047.
Produced: Removed the `BOND_ALLOW_STATEFUL_SUBMISSIONS` gate from `tests/api/duplicate-bond-api.spec.ts`, and updated DEF-005, the automation selection, summary report, execution record, README, and demo guide.
Correction: TC-047 now creates two bonds in Alpha on every `@regression` or `@high-value` run. It keeps its `@stateful-bond` tag, so flaky triage still excludes it. TC-044 and TC-045 stay gated.

Date: 2026-09-28
Request: Do not put any test that can be skipped in the smoke, sanity, regression, or high-value groups.
Produced: Removed `@high-value` and `@regression` from the lockout cases TC-011 to TC-014, and `@high-value` from TC-025, TC-027, TC-029, TC-041, TC-044, and TC-045, which now use a `conditionalTags` list in `start-bond.spec.ts`. The groups now list 13 `@smoke`, 1 `@sanity`, 10 `@regression`, and 20 `@high-value` tests. Updated the summary report and automation selection.
Correction: Checked with `--list` that none of the ten conditional tests remains in any of the four groups, and that all 36 tests are still discovered. The lockout and data-gated tests still run through `npm run test:lockout`, `npm run test:bond-creation`, and `npm test`.

Date: 2026-09-28
Request: High-value tests must pass or fail, never skip. Undo the tag removal.
Produced: Restored `@high-value` and `@regression` on the lockout cases and `@high-value` on TC-025, TC-027, TC-029, TC-041, TC-044, and TC-045. Replaced every `test.skip`: `requireData` now throws when `.env` data is missing, the lockout suite fails in `beforeEach` when the lockout account is missing, and the `BOND_ALLOW_STATEFUL_SUBMISSIONS` gate on TC-044 and TC-045 is removed. The groups are back to 13 `@smoke`, 14 `@regression`, and 30 `@high-value`. Updated CLAUDE.md, README, the POM review, automation selection, execution record, summary report, and demo guide.
Correction: The previous change removed tags instead of fixing skips; this request reversed it. TC-044, TC-045, and TC-047 now create bonds on every run. The `npm run test:high-value` and `test:regression` scripts still exclude `@lockout`, so the lockout cases run through `npm run test:lockout` or `npm run test:full`.

Date: 2026-09-28
Request: Make TC-047 expect a 409 Conflict for the duplicate request.
Produced: TC-047 now asserts that the second identical create-bond request returns HTTP 409. Updated DEF-005 with the real evidence from the tester's 13:40 run: both requests returned `Success: true` and created BondId 1012032 and BondId 1012033. Updated the automation selection and demo guide.
Correction: The earlier assertion also accepted any 4xx, or a replay of the first response. The tester chose the stricter, standard 409 Conflict. The duplicate-bond evidence came from the failure report of the tester's own run, not from an assumption.

Date: 2026-09-28
Request: Organise the tests folder by type into ui, api, and hybrid, without changing the api folder.
Produced: Moved `tests/bond-creation/`, `tests/login/`, and `tests/logout/` under `tests/ui/`, created `tests/hybrid/` (empty, with `.gitkeep`), and fixed the moved specs' relative imports and the `test:bond-creation:smoke` script path. Updated CLAUDE.md, README, the demo guide, and the white-box analysis.
Correction: Left `tests/api/` unchanged, as asked. Checked with typecheck and `--list` that all 36 tests are still discovered, that the login project still picks up `login-cases` and `lockout`, and that logout still runs last in the Chromium project.

Date: 2026-09-28
Request: Add one hybrid test built from the existing work.
Produced: TC-048 in `tests/hybrid/bond-amount-maximum.spec.ts`. The UI step opens the configured quote and checks that the form keeps a Bond Amount of 40000000. The API step logs in and creates a bond with `payload2` (penalty 40,000,000), then checks for HTTP 200, `Success: true`, and `Quote.Penalty` 40000000. Added the `test:hybrid` script and updated README, the summary report, the automation selection, and the demo guide.
Correction: Chose a boundary both layers already exercise, so the test adds no new locators or API code, and `tests/api/` is unchanged. The response fields come from the tester's 13:40 run, not from a guess. The API step creates a bond on each run, so the test is tagged `@stateful-bond`. It has not been run yet.

Date: 2026-09-28
Request: Fix the three tests that failed in all three repeatability runs.
Produced: Diagnosed each failure from the 2026-09-25 failure reports and snapshots. TC-024 had a strict-mode clash on the bond type text; TC-039 (automated TC-040) had one on "Surcharges & Discounts"; TC-018 ran after logout. Changed `assertQuoteContext()` to check each header item by its label, and gave the dashboard-ready check a 15 s timeout. Reran: 9 of 9 passed with `--repeat-each=3 --retries=0`, and the logout order check passed 2 of 2. Documented the root causes and fixes in `flaky-triage.md` (R-08, R-09).
Correction: The earlier `.first()` workaround for TC-024 passed by matching the page title, so it never checked the header; it was replaced. Saved the tester's 15:02 TC-047 result (expected 409, received 200) to `day-3/evidence/` before rerunning, because Playwright clears `test-results/` on each run. The full three-run triage was not repeated.

Date: 2026-09-28
Request: Fill the test-design gaps (decision table, bond lifecycle, premium EP), show evidence of using the skill, and build the stretch playwright-pom skill.
Produced: Used the test-case-designer skill to write 24 cases, TC-049 to TC-072, in `day-2/test-cases-additions.csv`, in the template's 11 columns: 8 DT, 11 ST (including 4 invalid transitions), and 5 premium EP. Rewrote the decision table as conditions, actions, and 8 rules (renamed to `day-2/decision-table.md`), and added `day-2/bond-lifecycle-state-transitions.md` with a state diagram. Added `day-2/skill-usage-evidence.md` and the `playwright-pom` skill (SKILL.md, `references/conventions.md`, and Page Object and spec templates). Updated the demo guide, README, and summary report.
Correction: Expected results are observed behaviour only where Alpha showed it: status "Referred" for a $40,000,000 bond, the over-maximum penalty error, and the premium breakdown (Base 199,920.00 + Fee 1,999.20 = Total 201,919.20). All other outcomes say "Configured rule / requirement to confirm". Actual Result and Status are blank, because nothing has been executed. The Login example in the skill evidence was first written from memory, then replaced with the exact TC-005 row from the workbook. The first spec template read a locator in the spec; it now calls a Page Object assertion. The 24 cases still need to be copied into `test-cases.xlsx`.

Date: 2026-09-28
Request: (Found while checking the tester's git staging.) Keep secrets out of the repository.
Produced: Unstaged `reports/` with `git rm -r --cached`, so the files stay on disk, and changed the ignore rule from `/reports/flaky-triage/` to `/reports/`.
Correction: The staged `reports/stability-2026-09-28/` traces contained session and token data (270 matches), because the login fixture injects the saved session into each page. Traces are local evidence only and must never be committed or shared.

Date: 2026-09-28
Request: Fix the CI failure "page.goto: Cannot navigate to invalid URL" in global setup.
Produced: Added `getBaseUrl()` to `src/utils/environment.ts`, and used it in `playwright.config.ts`, `src/global-setup.ts`, and `src/fixtures/qa.ts` instead of reading `URL` directly in three places. It trims whitespace and quotes, adds `https://` when the scheme is missing, returns only the origin, falls back to a built-in default address when `URL` is unset (removed in the next entry), and fails with a clear message for an address that is still invalid.
Correction: The CI log showed that `URL` was set (config loading did not fail) but was not a full address, most likely a `vars.URL` value without `https://`. Checked the helper against empty, scheme-less, quoted, padded, path, and invalid values without touching Alpha. The CI run itself has not been repeated.

Date: 2026-09-28
Request: Do not hardcode the application URL; read it only from `.env`.
Produced: Removed `DEFAULT_BASE_URL` and the fallback from `getBaseUrl()`. It now reads `URL` through `getRequiredEnvironmentVariable`, so a missing or empty value stops the run with "Required environment variable URL is not configured." The cleanup (trimming, removing quotes, adding `https://`) stays.
Correction: The earlier version silently fell back to a built-in Alpha address, which hid missing configuration and put an environment value in code. Checked unset, empty, scheme-less, quoted, and invalid values; typecheck passes.

Date: 2026-09-28
Request: In CI, run the Login lockout tests (locked after three failed logins) after all the other suites.
Produced: Added a final "Run Login lockout tests" step (`npm run test:lockout`, TC-011 to TC-014) after smoke, regression, and high-value, and passed `LOCKOUT_TEST_USERNAME` and `LOCKOUT_TEST_PASSWORD` from the `qa` environment secrets. Marked the regression, high-value, and lockout steps `if: ${{ !cancelled() }}`, so each suite still runs after an earlier failure. Gave each suite its own report folder with `PLAYWRIGHT_HTML_OUTPUT_DIR`, uploaded together as one artifact.
Correction: Without separate folders, each `npm run` overwrote `playwright-report/`, so only the last suite's report would have been uploaded. Checked locally that the lockout step lists exactly the four lockout tests, that none of smoke, regression, or high-value includes them, and that the report folder variable works. The CI run itself has not been checked.

Date: 2026-09-28
Request: When a test fails in the GitHub CI run, take a screenshot and save it in `screenshots/Errors`.
Produced: Added an automatic `failureScreenshot` fixture to `src/fixtures/qa.ts`. After any failed UI or hybrid test, it saves a full-page screenshot to `screenshots/Errors/<test-title>-<project>-attempt-<n>.png` and attaches it to the HTML report. Added a CI step that uploads `screenshots/Errors/` as the `failure-screenshots` artifact, because files on the runner are deleted after the job.
Correction: Verified locally: TC-025, which fails without `BOND_PRINCIPAL_SEARCH`, produced one screenshot, and the passing TC-019 produced none. The screenshot was checked for visible secrets (none) and then deleted, because it was only a check. API-only specs have no browser page, so they produce no screenshot; their errors are in the report.

Date: 2026-09-28
Request: CI run #9 failed in global setup: the dashboard button was not visible after login, in every suite.
Produced: Restored the alert check in `LoginPage.assertAuthenticated()`. It waits up to 15 s for the dashboard or a login alert, and on an alert fails with the alert text. Global setup now saves `screenshots/Errors/global-setup-login-failure.png` and reports the page address when login fails, because global setup is not a test and the failure-screenshot fixture does not run there.
Correction: The alert check had been removed, so CI showed only "element(s) not found" and hid why login failed. Verified locally: a normal login passed, and a login with a non-existent username failed with "Login was rejected: Your account has been locked. Try again in 15 minutes." and a screenshot. A non-existent user was used so that the real account's failed-attempt count was not touched. The CI cause is not confirmed yet; the next run will show the real message.

Date: 2026-09-28
Request: CI run #10 failed in every step with "Login was rejected: Your account has been locked. Try again in 10 minutes."
Produced: The new login diagnostics confirmed the cause: the CI account was locked. In the workflow, the regression and high-value steps now run `npx playwright test --grep <tag> --grep-invert "@lockout|@stateful-login"`, which leaves out TC-002 and TC-010. Both submit the real username with a wrong password, and running them in both steps made three failed logins per pipeline. Checked with `--list`: the CI steps now select 6 regression and 23 high-value tests, with no wrong-password cases.
Correction: This confirms the lockout risk raised before run #10. The `@stateful-login` exclusion also removes TC-016 (logout) from those two steps; smoke still covers it. TC-002 and TC-010 now run only locally. The account must unlock (10 to 15 minutes) before the next CI run can pass global setup.

Date: 2026-09-28
Request: Change the release decision from No-Go to Go, because the tester judges the open bugs not critical enough to block.
Produced: Changed the verdict to "Go with accepted risks" in the summary report, README, demo runbook, and demo guide. The report now has a Decision section with the reasons, each accepted risk (DEF-002, DEF-005, DEF-001, DEF-004, DEF-003, DEF-008, and the unexecuted coverage), and three conditions, starting with fixing DEF-002 and DEF-005 first. Marked "failed tests documented" as met, based on the triage fixes and the 9 of 9 rerun.
Correction: Claude advised keeping No-Go, because the brief grades the decision against the Day 1 criteria and four High defects are open. The tester chose Go. The exit-criteria results were kept exactly as measured (not met stays not met), the Day 1 criteria were not changed, and no severity was lowered without a reason. A line in the demo guide saying "numbers say Go" was reworded, because the numbers do not meet the criteria.

Date: 2026-09-28
Request: CI run #11: login now works and 11 of 13 smoke tests passed, but API-001 and API-002 failed with "TypeError: Invalid URL" in `LoginApi.ts`.
Produced: Added `getApiBaseUrl()`, which reads `LOGIN_API` through a shared helper (`getWebAddress`) that is also used by `getBaseUrl()`. It trims spaces and quotes, adds `https://` when missing, and fails with a clear message when the value is unset or invalid. `LoginApi.ts` and `CreateBondApi.ts` now use it instead of `process.env.LOGIN_API ?? ''`. Verified locally: API-001 passed with the `.env` value and with a value missing `https://`.
Correction: The old code turned a missing `LOGIN_API` into an empty string, so the real cause showed only as "Invalid URL". The CI value of `vars.LOGIN_API` is still unconfirmed: if it is empty, the next run now says "Required environment variable LOGIN_API is not configured." `tests/api/` specs were not changed.

Date: 2026-09-28
Request: Keep only 5 VUs in the performance tests.
Produced: Set both k6 scripts to 5 VUs: `login-5-vus.ts` (renamed from `login-100-vus.ts`) and `login-and-list.ts` (default `VUS` changed from 10 to 5). Changed the login sample threshold from `count==100` to `count==5`. Updated the SLA document (workload and run command), README, summary report, and demo guide. The earlier 100-VU result is kept and labelled as an earlier run.
Correction: The tester had already set `vus: 5`, but the threshold still required 100 samples, so every 5-VU run would have failed that check. A draft line in the demo guide claimed Alpha was not sized for 100 users, which is unproven; it was changed to give the actual reason (the brief asks for small checks on a shared environment). No 5-VU run has been done yet.

Date: 2026-09-28
Request: The first 5-VU k6 run failed: all 5 logins were rejected (http_req_failed 100%), with p95 389 ms.
Produced: `login-5-vus.ts` now prints the HTTP status and the server's error message for each failed login, because the summary did not show the status. Added `scripts/run-k6.ts` and the `perf:login` and `perf:login-list` npm scripts, which run k6 with the same `.env` values that Playwright uses (Node `--env-file`). Updated the README and SLA document.
Correction: The rejections came back quickly, which points to a credential or configuration problem rather than performance. k6 does not read `.env`, and in cmd `set VAR="value"` keeps the quotes as part of the value. The cause is not confirmed yet. Claude did not rerun k6: the brief requires a coordinated window, and more failed logins could lock the account. The 389 ms p95 measures rejected requests, so it is not evidence against the SLA.
