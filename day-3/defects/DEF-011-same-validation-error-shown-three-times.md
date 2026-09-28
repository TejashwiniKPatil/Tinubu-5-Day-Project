# DEF-011 One missing-field error is shown three times (banner plus two toasts)

Status: New

Priority: Low

Severity: Low

Module: Bond Creation — Step 3, Pre Pay Selection

Environment: Alpha Surety QA (https://alphanewui.tinubusurety.com); build and browser not recorded

Source: Bond Creation exploratory session (session bug DEF-08)

Preconditions: User is signed in and has a bond quote open at Bond Details.

Steps:

1. Select a bond type that requires Pre Pay Selection (Annual with PrePaidDuration=5).
2. Leave "Pre Pay Selection" at "- Make Selection -".
3. Click Submit.

Expected result: One clear message indicating the missing required field.

Actual result: The same message ("PrePaySelection is required for this bond type... Valid values are 1 through 5.") appears in the inline red banner, in an "Unable to quote bond" toast, and in a separate generic "Error" toast.

Evidence: Exploratory session notes. `screenshots/ui-bugs/penalty-limit-duplicate-errors.png` shows the same banner-plus-two-toasts pattern for the penalty error; recorded as UX-03 in `day-5/usability-accessibility-review.md`.

Related: DEF-006 shows the same pattern; the two may share a root cause in how form validation errors are reported.

Lifecycle record: New.

Recommendation: Show each validation failure once, in the inline banner, and drop the duplicate toasts.
