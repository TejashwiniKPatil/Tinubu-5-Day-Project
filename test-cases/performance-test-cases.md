# Performance Test Cases

Non-functional cases for Login and Bond Creation response times. Based on [day-5/performance/login-sla.md](../day-5/performance/login-sla.md).

All thresholds are **proposed**. They need approval from the product and QA owners before they count toward a release decision. Run only in Alpha QA, and coordinate with the team before running during a release or another shared test window. Credentials come from `.env`; never put them in a report.

## Summary

| ID | Title | Priority | Automated test | Status (2026-09-29) |
|----|-------|----------|----------------|---------------------|
| PERF-001 | Login API meets latency SLA with 5 concurrent users | High | k6: `npm run perf:login` | Not run at 5 VUs (the earlier 100-VU run failed) |
| PERF-002 | Login and pending-bonds list stay stable for 1 minute with 5 users | Medium | k6: `npm run perf:login-list` | Blocked |
| PERF-003 | Dashboard is ready after Login within the target time | Medium | [performance.spec.ts](../tests/non-functional/performance.spec.ts) | Passed (within 5 s) |
| PERF-004 | Bond search and quote form load within the target time | Medium | [performance.spec.ts](../tests/non-functional/performance.spec.ts) | Passed (each step within 3 s) |
| PERF-005 | Login API responds within the target time (single request) | Medium | [performance.spec.ts](../tests/non-functional/performance.spec.ts) | Passed (within 2 s) |
| PERF-006 | Login page loads within the target time | Medium | [performance.spec.ts](../tests/non-functional/performance.spec.ts) | **Failed**: 4.2 s to 5.9 s over 4 runs; target 3 s |

## Automated runs

Run: `npm run test:performance`. The Playwright checks time a single user; load testing stays with k6. The targets are in `performanceTargets` in [test-data/constants.ts](../test-data/constants.ts). Each run records its measured times as `timing` annotations in the HTML report.

PERF-006 measures the time from the start of navigation to `DOMContentLoaded` on the Login page. It missed the proposed 3 s target in all 4 runs (5.9 s, 4.7 s, 4.2 s, 4.3 s). Before raising a defect, have the owners confirm the target. The test machine's network may add to the time.

## PERF-001 Login API meets latency SLA with 5 concurrent users

**Preconditions:** `URL`, `LOGIN_API`, `TEST_USERNAME`, `TEST_PASSWORD`, `TEST_CLIENT_ID`, and `TEST_GRANT_TYPE` are set in `.env`. k6 v0.57 or newer is installed.

**Test data:** 5 virtual users (VUs), 1 Login request each, so exactly 5 requests. No write operations.

**Steps:**
1. Run `npm run perf:login`.
2. Save the k6 summary output.
3. Compare each metric with its threshold.

**Expected result:**
- `login_samples` count is 5.
- Login latency p95 ≤ 2.0 s and p99 ≤ 4.0 s.
- Login success (HTTP 2xx with an access token) ≥ 99%.
- `http_req_failed` < 1%.

**Status:** Not run at 5 VUs. An earlier 100-VU run **failed**: 86 of 100 requests failed because the remote host closed the connections, and only 14 succeeded. That result is not an SLA measurement. See the SLA document for details.

## PERF-002 Login and pending-bonds list stay stable for 1 minute with 5 users

**Preconditions:** As PERF-001. The Login request URL, body, content type, and token field have been confirmed in browser DevTools, and `LOGIN_PATH`, `LOGIN_BODY`, `LOGIN_CONTENT_TYPE`, and `LOGIN_TOKEN_FIELD` are set.

**Test data:** 5 VUs for 1 minute, each logging in and calling `/bond/bonds/pending-bonds`.

**Steps:**
1. Run `npm run perf:login-list`.
2. Save the k6 summary output.
3. Review `login_duration`, `list_duration`, `login_error_rate`, and `list_error_rate`.

**Expected result:** Error rates < 1%. Latency within the thresholds configured in [login-and-list.ts](../day-5/performance/login-and-list.ts). No growth in response time over the minute.

**Status:** Blocked. The script says not to run it until the Login request details are confirmed in DevTools.

## PERF-003 Dashboard is ready after Login within the target time

**Preconditions:** QA account available. Browser cache cleared.

**Steps:**
1. Open the Login page.
2. Sign in with the QA account.
3. Measure the time from clicking Sign In until the Start a Bond button (`dashboard-start-bond-button`) is visible.
4. Repeat 5 times and record each time.

**Expected result:** Proposed target: the dashboard is ready within 5 s in at least 4 of 5 attempts, and never takes longer than 15 s.

**Status:** Passed on 2026-09-29 (automated, one sign-in per run). The 5-attempt manual measurement has not been done.

## PERF-004 Bond search and quote form load within the target time

**Preconditions:** Signed in to Alpha QA.

**Steps:**
1. Click Start a Bond and measure the time until the agency selector is enabled.
2. Select the test agency and the Commercial family. Search for "Agriculture Dealers Bond" and measure the time until the result card appears.
3. Click Select and measure the time until the quote form's Submit button is visible.
4. Repeat 5 times.

**Expected result:** Proposed target: each step completes within 3 s in at least 4 of 5 attempts.

**Status:** Passed on 2026-09-29 (automated, one attempt per run). The 5-attempt manual measurement has not been done.

## PERF-005 Login API responds within the target time (single request)

**Steps:** Send one Login API request with the QA account and time the response.

**Expected result:** HTTP 200 within 2 s.

**Status:** Passed on 2026-09-29.

## PERF-006 Login page loads within the target time

**Steps:** Open the Login page with an empty cache and read the browser's navigation timing.

**Expected result:** `DOMContentLoaded` within 3 s of the start of navigation.

**Status:** Failed on 2026-09-29: 4.2 s to 5.9 s over 4 runs.
