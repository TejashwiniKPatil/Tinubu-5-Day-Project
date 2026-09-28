# DEF-002 Submit blocked with "at least one person or company required" despite an attached principal company

Status: New

Priority: High

Severity: High

Module: Bond Creation — Step 2, Principal Information

Environment: Alpha Surety QA (https://alphanewui.tinubusurety.com); build and browser not recorded

Source: Bond Creation exploratory session (session bug DEF-01)

Preconditions: User is signed in with the QA test account and can start a new bond quote.

Steps:

1. Start a new bond quote for Agricultural Products Dealer (Step 1).
2. Under Principal Information, use Find or Create Principal to attach "NUI1157 AAC Probe 0913".
3. Confirm that company "NUI1157 DupCo LLC" appears under Companies with a PRINCIPAL tag.
4. Submit the quote (Step 8).

Expected result: Submission proceeds, because a valid principal company is already attached.

Actual result: A red banner shows "1 error found — please fix before submitting / PEOPLE & COMPANIES: At least one person or company is required", even though the company card is visible. The COMPANIES counter reads "(0)" while one company is listed.

Evidence: Exploratory session notes. Screenshot of the banner and the "(0)" counter still to be attached.

Impact: Blocks every quote submission in this path, so Step 8 (Finalize) cannot be verified. TC-044 and TC-045 are blocked while this is open.

Lifecycle record: New.

Recommendation: Make submit validation and the COMPANIES counter read the same attached-principal state that the UI shows.
