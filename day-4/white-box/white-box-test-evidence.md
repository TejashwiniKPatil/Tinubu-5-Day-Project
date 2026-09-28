# White-Box Execution Evidence

- **Date:** 2026-09-28
- **Environment:** Node.js v24.21.0, local TypeScript run with `--experimental-strip-types`

## Unit suites

- **Command:** `npm run test:white-box`
- **Result:** 24 tests: 22 passed, 2 failed
- **Branch coverage:** 94.29% overall (threshold: 90%)

Coverage by module:

- **`login-lockout.ts`:** 80.43% lines, 93.33% branches. Uncovered lines 31 to 32 and 40 to 46.
- **`bond-quote-validator.ts`:** 87.88% lines, 95.00% branches. Uncovered lines 39 to 40 and 61 to 66.

### Expected failures

These two tests stay failing as evidence until the defects are fixed.

**"TC-012: second failed attempt keeps the user signed out"**

- Expected: `{ state: 'signed-out', failedAttempts: 2 }`
- Actual: `{ state: 'locked', failedAttempts: 2 }`
- Reproduces WB-001.

**"TC-044: Special Instructions at exactly 500 characters are accepted"**

- Expected: no errors
- Actual: `['Special Instructions must not exceed 500 characters.']`
- Reproduces WB-003.

### Uncovered lines

- Lines 31 to 32 of `login-lockout.ts` (WB-002) and lines 39 to 40 of `bond-quote-validator.ts` (WB-004) are the unreachable branches.
- Lines 40 to 46 and 61 to 66 are the stub-facing functions, which the integration suite covers.

## Integration suite

- **Command:** `npm run test:white-box:integration`
- **Result:** 2 tests: 2 passed

- `login` returns `authenticated` for the credentials that the `CredentialChecker` stub accepts, and records one failed attempt for the credentials it rejects.
- `validateQuoteForPrincipal` returns no errors when the `PrincipalDirectory` stub supplies one company.

These results apply to the white-box models only. They are not Alpha execution evidence.
