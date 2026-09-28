# DEF-007 Penalty-limit error shows a raw, unformatted number

Status: New

Priority: Low

Severity: Low

Module: Bond Creation — Step 3, Bond Details

Environment: Alpha Surety QA (https://alphanewui.tinubusurety.com/bonds/new); build and browser not recorded

Source: Bond Creation exploratory session (session bug DEF-04)

Preconditions: User is signed in and has a bond quote open at Bond Details.

Steps:

1. Enter a Bond Amount above the allowed maximum ($40,000,000) for this bond type.
2. Submit the quote.

Expected result: A human-readable message, for example "Penalty must not exceed $40,000,000."

Actual result: The message reads "Penalty must not exceed 40000000.0000." with no currency symbol or thousands separators. It appears in the inline banner and again in floating toasts.

Evidence: `screenshots/ui-bugs/penalty-limit-duplicate-errors.png` (banner plus "Error" and "Unable to quote bond" toasts; DevTools shows the `execute` request returning 400).

Lifecycle record: New.

Recommendation: Format currency limits in validation messages the same way as the Bond Amount field.
