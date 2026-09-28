# Day 5 Security Checklist: Alpha QA Only

Manual checklist only. No scanners, destructive actions, production checks, or attempts to access records outside approved QA accounts. Keep evidence to redacted screenshots and request metadata. Never save token or credential values.

For a suspected real exposure, stop immediately and report the minimum evidence to the project owner. Do not continue probing.

## Session invalidation on logout

**Safe procedure:** Sign in with the approved QA account, record a protected read-only URL, log out, then revisit it in the same browser. Expect Login or 401 and no protected data.

**Status:** Not run.

## IDOR on a record ID

**Safe procedure:** Use only two disposable records explicitly assigned to separate QA principals. Swap the ID in a read-only request once. Expect 403 or 404 and no record fields. Stop on any unexpected data.

**Status:** Not run. See GB-003; IDs and endpoints have not been captured.

## Reflected input rendered as HTML

**Safe procedure:** In Alpha QA, submit a harmless formatting-only sentinel such as `<b>QA-CHECK</b>` in an approved text field. Inspect the rendered DOM. Expect escaped text, not an added element. Do not use script payloads.

**Status:** Not run.

## Login rate limiting

**Safe procedure:** Use the dedicated resettable lockout account and the documented attempt limit. Stop at the limit; do not continue guesses. Confirm controlled throttling or lockout and arrange reset.

**Status:** Not run. No dedicated reset result is attached to this checklist.

## Sensitive data in localStorage

**Safe procedure:** In the authenticated QA browser, inspect key names and classify values without copying them into evidence. Stop and report if passwords, tokens, or sensitive personal data are exposed contrary to policy.

**Status:** Not run. Do not export storage contents.

## Verbose errors

**Safe procedure:** Trigger only a safe, expected validation error. Inspect the UI and response for stack traces, secrets, internal hostnames, or implementation details. Stop and report if a real exposure appears.

**Status:** Not run. The existing `execute` 400 screenshot does not show the response body.

## HTTPS

**Safe procedure:** Confirm the Alpha QA origin uses HTTPS and no authenticated request downgrades to HTTP.

**Status:** Partially observed. Supplied screenshots show an HTTPS address; request-wide verification is pending.

No security check is marked passed. This checklist has not been executed as a security assessment.
