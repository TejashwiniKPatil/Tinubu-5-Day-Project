# Regression Suite

Broader Login, Logout, and API coverage, including negative and boundary cases. Run it after smoke passes, and before a release.

Run: `npm run test:regression` (selects tests tagged `@regression`, leaving out `@lockout`)

Lockout cases: `npm run test:lockout`. These use a separate config and a dedicated resettable account (`LOCKOUT_TEST_USERNAME`, `LOCKOUT_TEST_PASSWORD`), so they never lock the main account.

## Cases

| ID | Title | Feature | Spec | Also tagged |
|----|-------|---------|------|-------------|
| API-001 | Login API Test | Login (API) | [login-api.spec.ts](../tests/api/login-api.spec.ts) | api, high-value |
| API-002 | Create Bond API Test | Bond Creation (API) | [create-bond-api.spec.ts](../tests/api/create-bond-api.spec.ts) | api, high-value |
| TC-002 | Login with valid username and invalid password | Login | [login-cases.spec.ts](../tests/ui/login/login-cases.spec.ts) | high-value, stateful-login |
| TC-004 | Login with invalid username and invalid password | Login | [login-cases.spec.ts](../tests/ui/login/login-cases.spec.ts) | high-value |
| TC-009 | Login with excessively long username | Login | [login-cases.spec.ts](../tests/ui/login/login-cases.spec.ts) | — |
| TC-010 | Login with excessively long password | Login | [login-cases.spec.ts](../tests/ui/login/login-cases.spec.ts) | — |
| TC-015 | Verify login with username containing leading/trailing spaces | Login | [login-cases.spec.ts](../tests/ui/login/login-cases.spec.ts) | — |
| TC-018 | Verify profile menu contains Log Out option | Login | [profile-menu.spec.ts](../tests/ui/login/profile-menu.spec.ts) | smoke |
| TC-016 | Logout from authenticated user session | Logout | [logout.spec.ts](../tests/ui/logout/logout.spec.ts) | smoke, high-value, stateful-login |

Total: 9 tests.

### Lockout group (`npm run test:lockout`)

| ID | Title | Spec |
|----|-------|------|
| TC-011 | Login reaches first failed-attempt state | [lockout.spec.ts](../tests/ui/login/lockout.spec.ts) |
| TC-012 | Login reaches second failed-attempt state | [lockout.spec.ts](../tests/ui/login/lockout.spec.ts) |
| TC-013 | Account is locked after third failed login attempt | [lockout.spec.ts](../tests/ui/login/lockout.spec.ts) |
| TC-014 | Verify login cannot proceed after account reaches locked state | [lockout.spec.ts](../tests/ui/login/lockout.spec.ts) |

These four run in order, and each depends on the account state left by the one before. Reset the lockout account before each run.

## Notes

- API-002 creates a real bond in Alpha on every run.
- The Bond Creation UI cases (TC-023 to TC-045) are tagged `@high-value`, not `@regression`. Run them with `npm run test:high-value` or `npm run test:bond-creation`. TC-044 and TC-045 currently fail because of [DEF-002](../day-3/defects/DEF-002-submit-blocked-despite-attached-principal-company.md) ("At least one person or company is required" blocks submit).

## Latest results

| Date | Environment | Suite | Result |
|------|-------------|-------|--------|
| 2026-09-29 | Alpha QA (Chromium) | Regression | 9 passed |
| — | — | Lockout | Not run in this cycle (needs the dedicated lockout account) |
