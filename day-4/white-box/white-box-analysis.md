# White-Box Analysis

White-box testing needs source code, and the Alpha Surety source is not available to this project. The two modules below model Alpha behaviour that was tested or observed from the outside, so the white-box work stays tied to the owned features:

- **`login-lockout.ts`** models login lockout after failed attempts. Alpha locks the account on the fourth failed attempt, as observed by the tester on 2026-09-29. This differs from the workbook, where TC-013 expects the lock on the third.
- **`bond-quote-validator.ts`** models the validation errors shown on quote Submit. Its rules come from the messages seen in the Bond Creation exploratory session (DEF-002, DEF-006, DEF-007, DEF-011) and the documented limits in `.claude/skills/test-case-designer/references/bva-ep-rules.md`. It has no Special Instructions limit, because the Alpha create-bond API accepts notes over 500 characters (tester observation, 2026-09-29).

Each module contains one deliberate off-by-one defect and one unreachable branch. These are defects in the models, not proven defects in Alpha. Each one links to the workbook case that checks the same rule in the real application.

## Defects Found

### WB-001 Account locks on the third failed login instead of the fourth (off-by-one)

**Severity:** High. **Priority:** High. Users are locked out one attempt early.

**Location:** `login-lockout.ts`, line 34: `if (failedAttempts >= MAX_FAILED_ATTEMPTS - 1)`, with `MAX_FAILED_ATTEMPTS = 4`

**Steps:** Start from `initialSession()` and call `attemptLogin(session, false)` three times.

**Expected:** `{ state: 'signed-out', failedAttempts: 3 }`. Alpha locks the account on the fourth failure, not the third.

**Actual:** `{ state: 'locked', failedAttempts: 3 }`.

**Evidence:** Unit test "TC-013: third failed attempt keeps the user signed out" fails. The first and second failures (TC-011, TC-012) and "fourth failed attempt locks the account" pass, which isolates the fault to the third attempt.

**Fix:** Use `failedAttempts >= MAX_FAILED_ATTEMPTS`.

**Application link:** `tests/ui/login/lockout.spec.ts` still expects the lock on the third attempt, as the workbook does. If Alpha locks on the fourth, TC-013 there fails; that difference from the requirement needs a defect or a requirement update.

### WB-002 Login "reset" branch is unreachable

**Severity:** Low. **Priority:** Low. It is dead code that suggests a reset path which never runs.

**Location:** `login-lockout.ts`, lines 31 to 33: `if (failedAttempts === 0) { return initialSession(); }`

**Reason:** Line 20 rejects any count that is negative or not an integer. `failedAttempts` is that count plus one, so it is always at least 1 and can never equal 0.

**Evidence:** Lines 32 to 33 are the only uncovered lines in `attemptLogin`. The test "a failed attempt always records at least one failure" confirms that the count is at least 1 after a failure.

**Fix:** Remove the branch.

### WB-003 A bond amount of exactly $40,000,000 is rejected (off-by-one)

**Severity:** High. **Priority:** High. A valid maximum-value bond cannot be quoted.

**Location:** `bond-quote-validator.ts`, line 25: `} else if (quote.bondAmount >= quote.maxBondAmount) {`

**Steps:** Validate a complete quote with `bondAmount: 40_000_000` and `maxBondAmount: 40_000_000`.

**Expected:** No errors. The maximum is inclusive: Alpha accepts exactly $40,000,000 (TC-028) and names it as the limit in "Penalty must not exceed 40000000.0000" (DEF-007).

**Actual:** `['Penalty must not exceed 40000000.']`

**Evidence:** Unit test "TC-028: exactly the maximum bond amount is accepted" fails. "TC-029: one dollar above the maximum is rejected" and the $0 case pass, which isolates the fault to the exact boundary.

**Fix:** Use `> quote.maxBondAmount`.

**Application link:** TC-028 enters exactly 40000000 in Alpha and passes, and TC-048 checks the same boundary through the create-bond API.

**Special Instructions:** the model has no length limit, because the Alpha create-bond API accepts notes over 500 characters. The test "TC-044: Special Instructions of any length are accepted" checks 500, 501, and 5,000 characters. The API does not enforce the documented 500-character maximum, which is a gap to raise as a defect.

### WB-004 "Party count is invalid" branch is unreachable

**Severity:** Low. **Priority:** Low. It is dead code in the check behind the Alpha "At least one person or company is required" message.

**Location:** `bond-quote-validator.ts`, lines 36 to 38: `else if (partyCount < 0)`

**Reason:** `partyCount` is the sum of two array lengths, which can never be negative. The zero case is handled on line 34.

**Evidence:** Lines 37 to 38 are the only uncovered lines in `validateQuote`. The test "the invalid party count message is never produced" checks zero and one party.

**Fix:** Remove the branch.

**Application link:** In Alpha, DEF-002 shows the party check reporting "(0)" companies when one is attached. The integration test checks that the model counts the parties returned by the principal lookup correctly.

### Found while testing, fixed before recording

A `NaN` bond amount passed the original `bondAmount < 0` and `bondAmount > maxBondAmount` checks, because every comparison with `NaN` is false, and the quote was accepted. The check now rejects non-finite amounts, and a unit test covers `NaN`. This was not one of the deliberate defects.

## Cyclomatic Complexity

**`attemptLogin`:** 5 `if` statements (lines 20, 23, 26, 31, 34), so V(G) = 5 + 1 = **6**. Counting each `||` condition separately (lines 20 and 23) gives 7 decisions and V(G) = 8.

**`validateQuote`:** 7 decision points (lines 21, 23, 25, 29, 34, 36, 47), so V(G) = 7 + 1 = **8**. Counting each `||` and `&&` separately (one extra on line 23, one on line 29, two on line 47) gives 11 decisions and V(G) = 12. The `forEach` callback on line 40 is a separate function with V(G) = 2.

**`initialSession`, `login`, and `validateQuoteForPrincipal`:** no decisions, so V(G) = 1 each.

## Coverage

`npm run test:white-box` runs both unit suites with a 90% branch threshold.

- **`login-lockout.ts`:** 93.33% branch coverage. Uncovered: lines 32 to 33 (WB-002, unreachable) and lines 41 to 47 (`login`, covered by the integration test).
- **`bond-quote-validator.ts`:** 94.44% branch coverage. Uncovered: lines 37 to 38 (WB-004, unreachable) and lines 55 to 60 (`validateQuoteForPrincipal`, covered by the integration test).
- **All files:** 93.94% branch coverage.

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
