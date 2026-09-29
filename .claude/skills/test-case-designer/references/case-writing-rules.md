# Case Writing Rules

Rules for each of the 11 columns in `templates/test-case-row.csv`. Match the Day 2 workbook exactly.

## TC ID

| Prefix | Used for | Next free number (2026-09-29) |
|--------|----------|-------------------------------|
| `TC-` | Functional Login, Logout, and Bond Creation cases | TC-074 (TC-073 is the end-to-end journey). TC-046 is unused; do not reuse it without checking with the team. |
| `API-` | API-only checks | API-003 |
| `S-` | Sanity checks | S-02 |
| `SEC-` | Security | SEC-010 |
| `PERF-` | Performance | PERF-007 |
| `USA-` | Usability and accessibility | USA-012 |

- Always use three digits after `TC-`, `SEC-`, `PERF-`, and `USA-` (`TC-073`, not `TC-73`).
- Never renumber an existing case. Automated specs, defects, and reports refer to these IDs.
- Before assigning a number, search `day-2/`, `test-cases/`, and `tests/` for it.

## Module

One of `Login`, `Logout`, `Bond Creation`, or `Session`. Use `Login, Bond Creation` only for a check that covers both screens, such as an accessibility scan.

## Test Case Title

- Start with a verb or "Verify": "Login with blank username", "Verify Expiration Date is calculated and read-only".
- Name the one condition being tested. The title must differ from every other title.
- For decision-table rows, start with the rule: "DT R3: high bond amount alone causes referral".
- If an automated spec implements the case, the spec's test name must start with the same ID and title.

## Technique

A tag from `technique-selection.md`.

## Priority

| Priority | Use it when |
|----------|-------------|
| `Critical` | Failure blocks the core business flow or risks data integrity: lockout, maximum Bond Amount, bond submission. |
| `High` | A main path or a common negative case: valid login, required fields, agency selection. |
| `Medium` | Secondary behavior: labels, optional fields, formatting. |
| `Low` | Cosmetic or rare edge cases. |

## Preconditions

The state needed before step 1, separated by semicolons: "User is signed in to Alpha QA; the Agricultural Products Dealer quote form is open; a principal and underwriter are configured". Include any account or data setup, such as "the dedicated lockout account has been reset".

## Test Data

The exact values used, with the partition or boundary named: "Bond Amount = $40,000,000", "Username = blank; valid password". Refer to credentials as "valid QA credentials from environment variables", never the values. Use the records in `test-data/bondCreationData.ts` (principal, underwriter, agency) so the case matches the automation.

## Test Steps

Numbered on one line, as in the workbook: `1. Leave Username blank. 2. Enter valid password. 3. Click Sign In.` One action per step. Use the on-screen names of buttons and fields.

## Expected Result

- One observable outcome that decides pass or fail: a message, a state, a value, a status code.
- Quote on-screen text exactly, and keep the same wording in `test-data/constants.ts` if automation checks it.
- When the rule is not documented, say so: "Quote is issued without referral. Configured rule / requirement to confirm."
- When the expected result comes from something observed in Alpha, say where: "Observed on 2026-09-28: the create-bond API returned Status "Referred"".

## Actual Result

Blank until the case is run. After a run, record what was seen, with the date: "2026-09-29 automated run: HTTP 200 with both tokens." Never copy the expected result into this column without evidence.

## Status

`Passed`, `Failed`, `Partially Passed` (only part of the case was verified; say which part in Actual Result), or `Not Executed` (with the reason in Actual Result when it is blocked).
