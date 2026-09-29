# White-Box Execution Evidence

- **Date:** 2026-09-29
- **Environment:** Node.js v24.21.0, local TypeScript run with `--experimental-strip-types`
- **Change since 2026-09-28:** the models follow the tester's Alpha observations. The account locks on the fourth failed attempt, and the create-bond API has no Special Instructions limit.

## Unit suites

- **Command:** `npm run test:white-box`
- **Result:** 24 tests: 22 passed, 2 failed
- **Branch coverage:** 93.94% overall (threshold: 90%)

Coverage by module:

- **`login-lockout.ts`:** 80.85% lines, 93.33% branches. Uncovered lines 32 to 33 and 41 to 47.
- **`bond-quote-validator.ts`:** 86.67% lines, 94.44% branches. Uncovered lines 37 to 38 and 55 to 60.

### Expected failures

These two tests stay failing as evidence until the defects are fixed.

**"TC-013: third failed attempt keeps the user signed out"**

- Expected: `{ state: 'signed-out', failedAttempts: 3 }`
- Actual: `{ state: 'locked', failedAttempts: 3 }`
- Reproduces WB-001.

**"TC-028: exactly the maximum bond amount is accepted"**

- Expected: no errors
- Actual: `['Penalty must not exceed 40000000.']`
- Reproduces WB-003.

### Uncovered lines

- Lines 32 to 33 of `login-lockout.ts` (WB-002) and lines 37 to 38 of `bond-quote-validator.ts` (WB-004) are the unreachable branches.
- Lines 41 to 47 and 55 to 60 are the stub-facing functions, which the integration suite covers.

## Integration suite

- **Command:** `npm run test:white-box:integration`
- **Result:** 2 tests: 2 passed

- `login` returns `authenticated` for the credentials that the `CredentialChecker` stub accepts, and records one failed attempt for the credentials it rejects.
- `validateQuoteForPrincipal` returns no errors when the `PrincipalDirectory` stub supplies one company.

These results apply to the white-box models only. They are not Alpha execution evidence.
