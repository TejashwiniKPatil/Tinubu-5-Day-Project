# White-Box Analysis

White-box testing needs source code, and the Alpha Surety source is not available to this project. The two modules below model Alpha behaviour that was tested or observed from the outside, so the white-box work stays tied to the owned features:

- **`login-lockout.ts`** models login lockout after failed attempts. Its rules come from workbook cases TC-011 to TC-014 and `tests/ui/login/lockout.spec.ts`.
- **`bond-quote-validator.ts`** models the validation errors shown on quote Submit. Its rules come from the messages seen in the Bond Creation exploratory session (DEF-002, DEF-006, DEF-007, DEF-011) and the documented limits in `.claude/skills/test-case-designer/references/bva-ep-rules.md`.

Each module contains one deliberate off-by-one defect and one unreachable branch. These are defects in the models, not proven defects in Alpha. Each one links to the workbook case that checks the same rule in the real application.

## Defects Found

### WB-001 Account locks on the second failed login instead of the third (off-by-one)

**Severity:** High. **Priority:** High. Users are locked out one attempt early.

**Location:** `login-lockout.ts`, line 33: `if (failedAttempts >= MAX_FAILED_ATTEMPTS - 1)`

**Steps:** Start from `initialSession()` and call `attemptLogin(session, false)` twice.

**Expected:** `{ state: 'signed-out', failedAttempts: 2 }`. The workbook locks the account on the third failure (TC-013), not the second (TC-012).

**Actual:** `{ state: 'locked', failedAttempts: 2 }`.

**Evidence:** Unit test "TC-012: second failed attempt keeps the user signed out" fails. TC-011 (first failure) and TC-013 (locked after three) pass, which isolates the fault to the second attempt.

**Fix:** Use `failedAttempts >= MAX_FAILED_ATTEMPTS`.

**Application link:** `tests/ui/login/lockout.spec.ts` checks the same behaviour on Alpha with a dedicated resettable account.

### WB-002 Login "reset" branch is unreachable

**Severity:** Low. **Priority:** Low. It is dead code that suggests a reset path which never runs.

**Location:** `login-lockout.ts`, lines 30 to 32: `if (failedAttempts === 0) { return initialSession(); }`

**Reason:** Line 19 rejects any count that is negative or not an integer. `failedAttempts` is that count plus one, so it is always at least 1 and can never equal 0.

**Evidence:** Lines 31 to 32 are the only uncovered lines in `attemptLogin`. The test "a failed attempt always records at least one failure" confirms that the count is at least 1 after a failure.

**Fix:** Remove the branch.

### WB-003 Special Instructions of exactly 500 characters are rejected (off-by-one)

**Severity:** Medium. **Priority:** Medium. A valid maximum-length note cannot be submitted.

**Location:** `bond-quote-validator.ts`, line 53: `if ((quote.specialInstructions ?? '').length >= MAX_SPECIAL_INSTRUCTIONS)`

**Steps:** Validate a complete quote whose `specialInstructions` is 500 characters long.

**Expected:** No errors. The documented limit is a maximum of 500 characters.

**Actual:** `['Special Instructions must not exceed 500 characters.']`

**Evidence:** Unit test "TC-044: Special Instructions at exactly 500 characters are accepted" fails. The 499-character (accepted) and 501-character (rejected) tests pass, which isolates the fault to the exact boundary.

**Fix:** Use `> MAX_SPECIAL_INSTRUCTIONS`.

**Application link:** TC-044 enters exactly 500 characters in Alpha, and DEF-003 shows how a 500-character note renders.

### WB-004 "Party count is invalid" branch is unreachable

**Severity:** Low. **Priority:** Low. It is dead code in the check behind the Alpha "At least one person or company is required" message.

**Location:** `bond-quote-validator.ts`, lines 38 to 40: `else if (partyCount < 0)`

**Reason:** `partyCount` is the sum of two array lengths, which can never be negative. The zero case is handled on line 36.

**Evidence:** Lines 39 to 40 are the only uncovered lines in `validateQuote`. The test "the invalid party count message is never produced" checks zero and one party.

**Fix:** Remove the branch.

**Application link:** In Alpha, DEF-002 shows the party check reporting "(0)" companies when one is attached. The integration test checks that the model counts the parties returned by the principal lookup correctly.

### Found while testing, fixed before recording

A `NaN` bond amount passed the original `bondAmount < 0` and `bondAmount > maxBondAmount` checks, because every comparison with `NaN` is false, and the quote was accepted. The check now rejects non-finite amounts, and a unit test covers `NaN`. This was not one of the deliberate defects.

## Cyclomatic Complexity

**`attemptLogin`:** 5 `if` statements (lines 19, 22, 25, 30, 33), so V(G) = 5 + 1 = **6**. Counting each `||` condition separately (lines 19 and 22) gives 7 decisions and V(G) = 8.

**`validateQuote`:** 8 decision points (lines 23, 25, 27, 31, 36, 38, 49, 53), so V(G) = 8 + 1 = **9**. Counting each `||` and `&&` separately (one extra on line 25, one on line 31, two on line 49) gives 12 decisions and V(G) = 13. The `forEach` callback on line 43 is a separate function with V(G) = 2. The `??` default on line 53 is not counted.

**`initialSession`, `login`, and `validateQuoteForPrincipal`:** no decisions, so V(G) = 1 each.

## Coverage

`npm run test:white-box` runs both unit suites with a 90% branch threshold.

- **`login-lockout.ts`:** 93.33% branch coverage. Uncovered: lines 31 to 32 (WB-002, unreachable) and lines 40 to 46 (`login`, covered by the integration test).
- **`bond-quote-validator.ts`:** 95.00% branch coverage. Uncovered: lines 39 to 40 (WB-004, unreachable) and lines 61 to 66 (`validateQuoteForPrincipal`, covered by the integration test).
- **All files:** 94.29% branch coverage.

The unit tests are named after the workbook cases they model: TC-011 to TC-014 and TC-026 to TC-044.

The integration test runs separately with `npm run test:white-box:integration`. When a unit file and the integration file load the same module in one coverage run, Node merges coverage across the test processes. That merge wrongly reports unreachable branches as covered, so coverage is measured on the unit suites only.

## Test Doubles and Integration Direction

**Stub:** returns fixed answers through an interface and does not verify how it was called. The integration tests use two stubs:

- a `CredentialChecker` stub that accepts one username and password pair, for `login`
- a `PrincipalDirectory` stub that returns one company for principal `NUI-1157`, for `validateQuoteForPrincipal`

**Mock:** also returns canned answers, but additionally verifies the interaction, such as call count or arguments, and fails if it is wrong.

**Driver:** calls the unit under test from above when the real caller does not exist yet. For example, a test harness that calls `validateQuote` before the Submit button is built. Playwright acts as a driver for the real browser UI.

**Top-down integration:** starts from the higher-level function and replaces its lower dependencies with stubs, as `login` and `validateQuoteForPrincipal` are tested here.

**Bottom-up integration:** starts from the lowest-level units, such as `attemptLogin` and `validateQuote`, calls them through drivers, and then adds the real higher-level modules step by step.

This project uses top-down integration with stubs.
