# Decision Table: Bond Approval and Eligibility

This decision table covers how four conditions combine to decide the outcome of a bond quote. The test cases are TC-049 to TC-056 in `day-2/test-cases-additions.csv`.

Alpha's approval matrix, rates, and referral threshold are not documented anywhere this project can access. Where an outcome has not been observed, the expected result says "Configured rule / requirement to confirm" instead of inventing a rule. Two rules are backed by observed Alpha behaviour, and they are marked below.

## Conditions

- **C1 Credit tier:** High, Medium, or Low
- **C2 Bond amount:** Within limit ($10,000), At maximum ($40,000,000), or Above maximum ($40,000,001)
- **C3 Indemnitor:** Present or Absent
- **C4 Prior claims:** None or Present

## Actions

- **A1** Quote issued without referral
- **A2** Quote referred for underwriter review (status "Referred")
- **A3** Quote declined
- **A4** Submission rejected by validation, and no bond created

## Rules

The rules cover the fully eligible combination, each single adverse condition, multiple adverse conditions, and the validation rule that overrides everything else. The full set would be 3 × 3 × 2 × 2 = 36 combinations; these 8 rules cover every condition value and every action.

- **R1 (TC-049):** High, within limit, indemnitor present, no claims. Expected A1. To confirm.
- **R2 (TC-050):** Low tier; everything else as R1. Only C1 changes. Expected a different decision from R1. To confirm.
- **R3 (TC-051):** At maximum; everything else as R1. Only C2 changes. Expected A2. **Observed:** the create-bond API returned status "Referred" for a $40,000,000 bond on 2026-09-28.
- **R4 (TC-052):** Indemnitor absent; everything else as R1. Only C3 changes. Expected a different decision or rate from R1. To confirm.
- **R5 (TC-053):** Prior claims present; everything else as R1. Only C4 changes. Expected A2 or a surcharge. To confirm.
- **R6 (TC-054):** Low, within limit, indemnitor absent, prior claims present. Three adverse conditions. Expected A3 or A2, never A1. To confirm.
- **R7 (TC-055):** Medium, at maximum, indemnitor present, prior claims present. Two adverse conditions. Expected A2 or A3, never A1. To confirm.
- **R8 (TC-056):** Above maximum, with any value for C1, C3, and C4 (don't-care conditions). Expected A4. **Observed:** Alpha shows "Penalty must not exceed 40000000.0000." and the `execute` call returns HTTP 400.

## How to read the rules

- R2, R4, and R5 each change one condition from R1, so any change in the outcome can be traced to that one condition.
- R8 uses don't-care conditions: once the amount is above the maximum, the other conditions do not matter.
- When the approval rules are published, replace each "To confirm" with the documented action, then execute and record the results.
