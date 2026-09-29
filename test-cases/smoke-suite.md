# Smoke Suite

The critical Login, Logout, and Bond Creation paths. Run it on every build after sanity passes. A smoke failure blocks regression testing until it is triaged.

Run: `npm run test:smoke` (selects tests tagged `@smoke`)

## Cases

| ID | Title | Feature | Spec | Also tagged |
|----|-------|---------|------|-------------|
| TC-001 | Login with valid username and valid password | Login | [login-cases.spec.ts](../tests/ui/login/login-cases.spec.ts) | high-value |
| TC-003 | Login with invalid username and valid password | Login | [login-cases.spec.ts](../tests/ui/login/login-cases.spec.ts) | high-value |
| TC-005 | Login with blank username | Login | [login-cases.spec.ts](../tests/ui/login/login-cases.spec.ts) | high-value |
| TC-006 | Login with blank password | Login | [login-cases.spec.ts](../tests/ui/login/login-cases.spec.ts) | high-value |
| TC-007 | Login with both username and password blank | Login | [login-cases.spec.ts](../tests/ui/login/login-cases.spec.ts) | high-value |
| TC-008 | Verify username and password fields are identified by correct labels | Login | [login-cases.spec.ts](../tests/ui/login/login-cases.spec.ts) | — |
| TC-018 | Verify profile menu contains Log Out option | Login | [profile-menu.spec.ts](../tests/ui/login/profile-menu.spec.ts) | regression |
| TC-019 | Start a new bond | Bond Creation | [start-bond.spec.ts](../tests/ui/bond-creation/start-bond.spec.ts) | high-value |
| TC-020 | Search and select an agency | Bond Creation | [start-bond.spec.ts](../tests/ui/bond-creation/start-bond.spec.ts) | high-value |
| TC-021 | Select agency directly from dropdown | Bond Creation | [start-bond.spec.ts](../tests/ui/bond-creation/start-bond.spec.ts) | high-value |
| TC-016 | Logout from authenticated user session | Logout | [logout.spec.ts](../tests/ui/logout/logout.spec.ts) | high-value, regression, stateful-login |

Total: 11 tests. TC-016 runs last because logging out ends the shared saved session.

To run only the Bond Creation smoke cases: `npm run test:bond-creation:smoke`.

## Latest results

| Date | Environment | Result | Notes |
|------|-------------|--------|-------|
| 2026-09-29 | Alpha QA (Chromium) | 10 passed, 1 failed | TC-016 failed once: after Log out, an element the test expects was not found. The failure details were overwritten by a later run, so the cause is not confirmed. |
| 2026-09-29 | Alpha QA (Chromium) | 11 passed | Re-run immediately after. |
| 2026-09-29 | Alpha QA (Chromium) | 11 passed | Second re-run. |

TC-016 failed in 1 of 3 runs. Treat it as possibly flaky, and capture the trace if it fails again before raising a defect.
