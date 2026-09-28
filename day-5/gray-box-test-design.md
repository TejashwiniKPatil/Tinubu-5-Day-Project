# Day 5 Gray-Box Evidence and Test Design

## Evidence inspected

### Quote submission screenshot

**Evidence:** `screenshots/ui-bugs/penalty-limit-duplicate-errors.png`

**Direct observation:** DevTools Network shows an XHR named `execute` returning HTTP 400 in 416 ms after quote submission. The UI also shows a validation banner and error notifications with "Penalty must not exceed 40000000.0000." (DEF-007). The same banner-plus-toasts repetition is logged as DEF-011.

**Limits:** The screenshot does not expose the full request URL, payload, or response body. Do not infer server field names or the exact validation contract from it.

### Playwright traces

**Evidence:** `reports/flaky-triage/triage-2026-09-25T08-37-34-078Z/`

**Direct observation:** GET `/bond/bonds/pending-bonds` returned 200. POST `/auth/auth/token` returned 401 in traces from failed saved sessions; later navigation reached the login page.

**Limits:** This was a test-session run, not an intentional authentication security test. Network errors also occurred. Trace Viewer review is still pending.

### Long-note screenshot

**Evidence:** User-supplied screenshot, recorded in [DEF-003](../day-3/defects/DEF-003-bond-note-overflows-layout.md).

**Direct observation:** A 500-character note visibly stretches the bond view and causes horizontal overflow and clipping.

**Limits:** Build, browser, full request and response, and a repository screenshot are not available.

The examples below are test designs, not completed security findings or verified server behavior.

## Candidate gray-box tests

### GB-001: Server validation when client validation is bypassed

1. Capture the full quote `execute` request and response in DevTools Network with a dedicated disposable QA bond.
2. Use the normal UI to establish the valid request shape, then change only Bond Amount to a documented out-of-range value and bypass the client constraint in DevTools.
3. Submit once. Expect a controlled 4xx validation response, no created or updated bond, and a user-safe error message.
4. Stop if the server accepts the request or if the next action could create a real bond. Record the request and response, then report it.

**Known from evidence:** `execute` returned HTTP 400 for one invalid quote submission. The screenshot does not prove whether this was server-side validation or reveal the exact payload and response fields.

### GB-002: Response field is present but not rendered

1. Capture a 200 response from the observed `GET /bond/bonds/pending-bonds` request.
2. Record the response schema and choose a non-sensitive field that requirements say should be visible to the user.
3. Compare the corresponding row in the UI with the response. Report a mismatch only when the field's display requirement is documented.

**Status:** Candidate only. The trace establishes the route and status, but its response body and schema have not been reviewed.

### GB-003: Record ID authorization boundary

1. Use two disposable QA bond records owned by separate authorized test principals.
2. Capture the detail request generated for record A and identify the ID location from the real request.
3. In a read-only request, replace only A's ID with B's ID while authenticated as A.
4. Expect 403 or 404 with no record data. Do not try IDs belonging to other users or continue if any unexpected data is returned.

**Status:** Not executed. The record detail endpoint and test records have not been captured or configured.

### GB-004: Expired authentication response handling

1. Capture a normal authenticated request and the authentication renewal flow from DevTools.
2. With a disposable QA session, let or force only the session token to expire using the approved QA mechanism.
3. Verify that a 401 renewal response returns the user to Login with a safe message and preserves the intended return route. Verify that no protected response data is rendered.

**Observed, not a security conclusion:** Test traces include POST `/auth/auth/token` with HTTP 401 followed by navigation to Login. The run also contained DNS and network failures, so this needs a controlled retest.
