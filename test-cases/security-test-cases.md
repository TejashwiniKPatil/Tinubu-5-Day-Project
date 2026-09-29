# Security Test Cases

Manual, non-destructive security cases for Alpha QA only. Based on [day-5/security-checklist.md](../day-5/security-checklist.md).

**Rules for every case**
- Use only approved QA accounts and disposable QA records. No scanners, no production, and no records outside the approved accounts.
- Keep evidence to redacted screenshots and request metadata (method, URL path, status code). Never save token, cookie, or password values.
- If you find a real exposure, stop at once and report the minimum evidence to the project owner. Do not keep probing.

## Summary

| ID | Title | Area | Priority | Automated test | Status (2026-09-29) |
|----|-------|------|----------|----------------|---------------------|
| SEC-001 | Session is invalidated on logout | Session | High | [session-invalidation.spec.ts](../tests/ui/logout/session-invalidation.spec.ts) | Passed |
| SEC-002 | Protected pages redirect a signed-out user to Login | Session | High | [security.spec.ts](../tests/non-functional/security.spec.ts) | Passed |
| SEC-003 | A user cannot read another principal's record by changing its ID | Access control | High | Manual only | Not run (blocked: records and endpoints not captured) |
| SEC-004 | Input is shown as text, not rendered as HTML | Input handling | High | [security.spec.ts](../tests/non-functional/security.spec.ts) (Special Instructions field only) | Passed; intermittent session loss, see below |
| SEC-005 | Repeated failed logins trigger lockout | Authentication | High | [lockout.spec.ts](../tests/ui/login/lockout.spec.ts) (TC-011 to TC-014) | Not run this cycle |
| SEC-006 | No passwords or sensitive data are kept in browser storage | Data exposure | Medium | [security.spec.ts](../tests/non-functional/security.spec.ts) (password check only) | Passed; intermittent session loss, see below |
| SEC-007 | Error responses reveal no internal details | Data exposure | Medium | [security.spec.ts](../tests/non-functional/security.spec.ts) (Login API only) | Passed |
| SEC-008 | All traffic uses HTTPS | Transport | High | [security.spec.ts](../tests/non-functional/security.spec.ts) (Login page and HTTP redirect) | Passed |
| SEC-009 | Password is masked and never appears in the URL | Authentication | Medium | [security.spec.ts](../tests/non-functional/security.spec.ts) | Passed |

## Automated runs

Run: `npm run test:security` (leaves out the lockout and logout cases). SEC-001 runs with the logout specs, and SEC-005 with `npm run test:lockout`.

- The invalid-login checks (SEC-007, SEC-009) use an unknown username, so they never count toward the main account's lockout.
- SEC-006 compares values inside the browser and reports only key names, never the stored values.
- **Open observation:** in 3 of 7 full runs of `security.spec.ts`, SEC-004 and/or SEC-006 failed before the test itself started, because the saved session had been sent back to the Login page. Neither test reproduced this when run alone or paired with any other single test. The cause is not confirmed. Smoke showed a similar one-off failure in TC-016. Capture a trace if it happens again before raising a defect.
- The automated checks cover part of each manual case. The manual steps below remain the full test.

## SEC-001 Session is invalidated on logout

**Steps:**
1. Sign in with the QA account.
2. Open a protected read-only page (for example the Bonds list) and copy its URL.
3. Log out.
4. Paste the URL into the same browser tab.

**Expected result:** The Login page or a 401 response is shown. No protected data is displayed.

**Status:** Passed on 2026-09-29 (automated SEC-001).

## SEC-002 Protected pages redirect a signed-out user to Login

**Steps:**
1. Open a new private browser window (not signed in).
2. Go directly to a protected URL, such as the Bonds list or the new bond page.

**Expected result:** The user is sent to the Login page, and no protected data flashes on screen first.

**Status:** Passed on 2026-09-29 for the Bonds list (automated). Other protected URLs have not been checked.

## SEC-003 A user cannot read another principal's record by changing its ID

**Preconditions:** Two disposable records, each assigned to a different QA principal. The read-only request that loads a record is known.

**Steps:**
1. Sign in as the user who owns record A and open it. Note the request.
2. Change the record ID in that read-only request to record B's ID, **once**.

**Expected result:** 403 or 404, and no fields from record B. Stop at once if any data from record B appears.

**Status:** Not run. Blocked because the record IDs and endpoints have not been captured (see GB-003 in [gray-box-test-design.md](../day-5/gray-box-test-design.md)).

## SEC-004 Input is shown as text, not rendered as HTML

**Test data:** `<b>QA-CHECK</b>`. This is a harmless formatting-only marker. Do not use script payloads.

**Steps:**
1. On the quote form, enter the marker in Special Instructions.
2. Look at how it is displayed, and inspect the element in DevTools.
3. Cancel the quote. Do not submit.

**Expected result:** The text appears exactly as typed, with the angle brackets visible. No bold `<b>` element is added to the page.

**Status:** Passed on 2026-09-29 on the quote form (automated). Where the saved note is displayed later has not been checked.

## SEC-005 Repeated failed logins trigger lockout

**Preconditions:** The dedicated resettable lockout account (`LOCKOUT_TEST_USERNAME`). Never use the main QA account.

**Steps:**
1. Run `npm run test:lockout`, or repeat the steps manually.
2. Stop at the documented limit of 3 attempts. Do not keep guessing.
3. Arrange for the account to be reset afterwards.

**Expected result:** After 3 failed attempts: "Your account has been locked. Try again in 15 minutes." Further attempts are refused while the account is locked.

**Status:** Covered by automated TC-011 to TC-014. Not run this cycle (see [regression-suite.md](regression-suite.md)).

## SEC-006 No passwords or sensitive data are kept in browser storage

**Steps:**
1. Sign in with the QA account.
2. In DevTools, open Application > Local Storage and Session Storage for the Alpha origin.
3. Classify each key name (for example: preference, token, or personal data). Do not copy any values into evidence.

**Expected result:** No password is stored. Any token storage follows the approved policy. No sensitive personal data is stored in plain text.

**Status:** Partly passed on 2026-09-29: the automated check found no password in local or session storage. Token storage and personal data have not been classified. Do not export storage contents.

## SEC-007 Error responses reveal no internal details

**Steps:**
1. Trigger a safe, expected validation error, for example by submitting the quote form with Bond Amount 40000001.
2. Check the on-screen message and the response body in DevTools > Network.

**Expected result:** A user-friendly message only. No stack traces, secrets, internal host names, SQL, or framework details.

**Status:** Partly passed on 2026-09-29: the Login API response for an unknown user showed no internal details (automated). The `execute` validation response has not been checked.

## SEC-008 All traffic uses HTTPS

**Steps:**
1. Open DevTools > Network and enable Preserve log.
2. Sign in, open Bond Creation, and log out.
3. Check the scheme of every request. Also type `http://alphanewui.tinubusurety.com` in the address bar.

**Expected result:** Every request uses HTTPS. The HTTP address redirects to HTTPS.

**Status:** Partly passed on 2026-09-29: every Login page request used HTTPS, and the HTTP address redirected to HTTPS (automated). The signed-in pages have not been checked request by request.

## SEC-009 Password is masked and never appears in the URL

**Steps:**
1. On the Login page, type a password and confirm it is masked.
2. Sign in, then check the address bar and the Network tab for the Login request.

**Expected result:** The Password field is masked (`type="password"`). The password is sent only in the request body, never in the URL or query string.

**Status:** Passed on 2026-09-29 (automated).

A passed automated check covers only what that test checks. These cases are not a full security assessment.
