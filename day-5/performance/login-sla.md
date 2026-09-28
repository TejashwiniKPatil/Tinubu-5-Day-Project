# Login Performance SLA

**Status:** Proposed. Thresholds require product and QA owner approval before use in a release decision.

**Workload:** 5 concurrent virtual users. Each VU makes one Login request, so the run makes 5 Login attempts and performs no write operations. `login-and-list.ts` also runs 5 VUs by default, each logging in and calling one list endpoint for 1 minute.

**Target:** Alpha QA UI and API hosts configured in the script. Credentials are read from environment variables.

## Service objectives

- **Login latency:** p95 ≤ 2.0 s and p99 ≤ 4.0 s, measured as HTTP request duration.
- **Login success:** ≥ 99%, measured as an HTTP 2xx response with an access token.
- **HTTP transport failure:** < 1%, measured by the k6 `http_req_failed` rate.
- **Load:** 5 VUs with one journey each, so exactly 5 Login attempts.

## Run and acceptance

Run `npm run perf:login`, which loads `.env` and starts `k6 run day-5/performance/login-5-vus.ts`. Failed logins now print their HTTP status and error message. You can also run `k6 run day-5/performance/login-5-vus.ts` directly with k6 v0.57 or newer. Load `URL`, `LOGIN_API` (or `API_BASE_URL`), `TEST_USERNAME`, `TEST_PASSWORD`, `TEST_CLIENT_ID`, and `TEST_GRANT_TYPE` into the environment first. k6 does not load `.env` files automatically.

The run passes only if all thresholds pass and all 5 Login requests are measured. Preserve the k6 summary and investigate failures before rerunning. This is a short capacity check, not a soak test or production capacity guarantee.

## Execution evidence

**Earlier run, before the change to 5 VUs. Result: Failed.** One 100-VU run completed 100 iterations and sent 100 Login requests in 3 seconds. The run timestamp and build identifier were not included in the output.

- **Login requests:** 100. All configured iterations completed.
- **HTTP request failures:** 86 of 100 (86%). Failed; the threshold is < 1%.
- **Login 2xx with access token:** 14 of 100 (14%). Failed; the SLA requires at least 99%.
- **Successful-response latency:** p95 1.37 s, from `http_req_duration{expected_response:true}`. Based on only 14 successful responses, so it is not enough to establish SLA latency.
- **Custom `login_latency`:** p95 629.2 ms. Not valid for the SLA, because failed requests contributed zero-duration samples.
- **`login_failure` metric:** 0% (0 of 14). Invalid for this run, because script exceptions occurred before failures were added to the rate.
- **Peak active VUs:** 81 of 100 configured. All 100 iterations completed, but peak concurrency stayed below the configured maximum.

The captured request errors say the remote host forcibly closed TCP connections to the API. The output does not establish whether the cause was gateway policy, backend capacity, network infrastructure, or another issue. The token check also threw when failed requests had no response body. The script has since been updated to handle empty/error responses and count failures; this run predates that fix. Review gateway/backend logs before another 100-user run. Do not treat this result as an SLA pass.

The draft thresholds are provisional because no business-approved SLO or baseline is recorded in this repository. Compare runs against the same environment and dataset when establishing a baseline. Coordinate before running during a release or another shared-environment test window.
