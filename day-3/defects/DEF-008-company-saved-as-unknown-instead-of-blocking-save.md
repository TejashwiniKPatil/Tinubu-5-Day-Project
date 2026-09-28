# DEF-008 New company is saved and displayed as "Unknown" instead of blocking the save

Status: New

Priority: Medium

Severity: Medium

Module: Bond Creation — Step 2, Principal & Indemnitors

Environment: Alpha Surety QA (https://alphanewui.tinubusurety.com); build and browser not recorded

Source: Bond Creation exploratory session (session bug DEF-05)

Preconditions: User is signed in and has a bond quote open at Principal Information.

Steps:

1. Add a company through the Add Company modal without a valid Company Name reaching save.
2. Return to the Principal & Indemnitors panel.

Expected result: The modal blocks save until Company Name is provided, or the name the user typed is shown back.

Actual result: The company is persisted and shown with the placeholder name "Unknown", flagged orange "INCOMPLETE" with "Missing: Company Name — Click to fix before submitting."

Evidence: Exploratory session notes. Screenshot still to be attached.

Impact: Data integrity. Incomplete company records are saved instead of being rejected at entry.

Lifecycle record: New.

Recommendation: Validate required company fields in the modal before the record is saved.
