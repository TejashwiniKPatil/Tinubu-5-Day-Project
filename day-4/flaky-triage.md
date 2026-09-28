# Flaky Triage Record

## Execution

The repeatable command is:

`npm run test:flaky-triage`

The script runs the repeatable Chromium test cases three times and allows one retry per test so the configured `on-first-retry` tracing can capture failures and instability.

Cases tagged `@stateful-login` or `@stateful-bond` are excluded from the repeatable triage run:

* `@stateful-login` cases can mutate account state or trigger account lockout.
* `@stateful-bond` cases can create persistent bond records.

These cases should be executed separately using approved, resettable QA test data.

## Results and Artifacts

Each triage run produces:

* A log file
* A separate Playwright result directory
* Trace artifacts when captured
* A summary of the three executions

Artifacts are stored under the timestamped directory:

`reports/flaky-triage/triage-*/`

Generated triage results are excluded from Git through `.gitignore`.

## Credentials and Test Data

The triage command must be executed only with an approved QA account because some login scenarios can mutate account state.

Credentials are supplied through environment variables and are not intentionally written to the generated logs.

No real credentials, access tokens, refresh tokens, or other secrets should be committed to the repository.

## Trace Investigation

For every inconsistent test result, the generated trace ZIP should be opened using Playwright Trace Viewer.

Review:

* Action timeline
* Locator resolution
* Screenshots and DOM snapshots
* Network requests and responses
* Console output
* Timing of actions and assertions

Classify the identified cause as one of:

* Locator
* Timing/synchronization
* Test data
* Environment
* Application behavior
* Test implementation

Record the observed evidence, root cause, and corrective action.

After applying a fix, rerun the same test case three times to verify that the instability has been addressed.

## Current Status (2026-09-25)

The three-run triage completed at `reports/flaky-triage/triage-2026-09-25T08-37-34-078Z/summary.json`. All three runs exited 1. Run 1: 7 passed, 4 failed, 4 skipped, 1 flaky; Run 2: 8 passed, 4 failed, 2 skipped, 2 flaky; Run 3: 8 passed, 4 failed, 4 skipped. See the timestamped logs and traces for run-level evidence.

Observed causes in the failure output include strict-mode locator ambiguity for “Agricultural Products Dealer” and “Surcharges & Discounts”; session invalidation after the logout case; and intermittent Alpha DNS/network failures. Failed stored-session traces included `POST /auth/auth/token` returning 401; `GET /bond/bonds/pending-bonds` returned 200 in the inspected trace. These observations do not establish whether Alpha or the test session caused every auth failure.

Follow-up changes: disambiguated the quote context and surcharge heading locators in `src/pages/BondCreationPage.ts`; moved the profile assertion into an authenticated-session spec that runs before bond specs; isolated the state-mutating logout case in `tests/z-logout.spec.ts`, tagged `@stateful-login`, so triage excludes it and the smoke run reaches it last. On 2026-09-28 these specs were renamed to `tests/login/profile-menu.spec.ts` and `tests/logout/logout.spec.ts`; logout still runs last in the Chromium project (confirmed with `npx playwright test --list`), and the profile check now runs after the Bond Creation specs. The UI specs were later moved under `tests/ui/` (for example `tests/ui/logout/logout.spec.ts`), and logout still runs last.

The root causes, fixes, and post-fix verification for the three consistently failing tests are in the next section. Opening each trace in the Trace Viewer UI during the demo is still recommended, so you can show the same evidence live.

## Root Causes and Fixes (2026-09-28)

The three tests that failed in all three runs on 2026-09-25 were diagnosed from their failure reports and page snapshots, which record what the Trace Viewer shows at the failing step. Each has a separate root cause.

### TC-024 Verify selected bond header information

- **Trace evidence:** 5 of 6 attempts failed with a strict-mode violation. `getByTestId('new-bond-main-content').getByText('Agricultural Products Dealer', { exact: true })` matched 2 elements: the page title and the Bond Type value in the header. The sixth attempt (run 3, first try) failed because `dashboard-start-bond-button` was not visible within the default 5 seconds on a slow network. Run 1 took 51.6 minutes in total.
- **Root cause:** The locator matched a value by text alone, and that text appears twice on the page. The earlier `.first()` workaround passed by matching the page title, so it did not check the header at all.
- **Fix:** `BondCreationPage.assertQuoteContext()` now takes label and value pairs, finds each header item by its label (Agency, State, Carrier, Bond Type), and checks that the item contains the value. `DashboardPage.assertDashboardReady()` waits up to 15 seconds for the dashboard.

### TC-039 [automated TC-040] Optional License and Permit fields can remain blank

- **Trace evidence:** Strict-mode violation. `getByText('Surcharges & Discounts', { exact: true })` matched an `h4` heading and a sidebar navigation button with the same text.
- **Root cause:** The text-only locator was ambiguous.
- **Fix:** `BondCreationPage.assertSurchargesVisible()` uses `getByRole('heading', { name: 'Surcharges & Discounts', exact: true })`, which matches only the section heading.

### TC-018 Verify profile menu contains Log Out option

- **Trace evidence:** The navigation log shows a redirect to `/login?returnUrl=%2F`, and the page snapshot shows the Sign In form. In each run, TC-016 (logout) had already run earlier in the same spec file.
- **Root cause:** Test order. Logging out ends the shared saved session, so every later test that reuses it lands on the login page.
- **Fix:** The logout test is now in `tests/ui/logout/logout.spec.ts`, which runs last in the Chromium project.

### Post-fix verification

- **Command:** `npx playwright test --project=chromium --grep "TC-024|TC-040|TC-018" --repeat-each=3 --retries=0 --trace=on`
- **Result:** 9 of 9 passed in 2.2 minutes: each test passed 3 times in a row with no retries.
- **Order check:** `--grep "TC-018|TC-016"` passed 2 of 2, with logout running after the profile-menu test.
- **Evidence:** Traces for every attempt are in `reports/stability-2026-09-28/results/`. Open one with `npx playwright show-trace reports/stability-2026-09-28/results/<test-folder>/trace.zip`.

The full three-run triage (`npm run test:flaky-triage`) has not been repeated. Since high-value tests now fail instead of skipping, it will also report TC-025, TC-027, TC-029, and TC-041 as failed until their Bond Creation data is added to `.env`.
