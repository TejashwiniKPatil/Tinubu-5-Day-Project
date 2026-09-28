# DEF-006 Duplicate and inconsistently worded "Company Name is required" errors

Status: New

Priority: Medium

Severity: Low

Module: Bond Creation — Step 2, Add Company

Environment: Alpha Surety QA (https://alphanewui.tinubusurety.com); build and browser not recorded

Source: Bond Creation exploratory session (session bug DEF-02)

Preconditions: User is signed in and has a bond quote open at Principal Information.

Steps:

1. Click "+ Add another company" to open the Add Company modal.
2. Enter a random test string in Company Name and leave the other required fields (address, city, state, zip) empty.
3. Close or save without a valid Company Name, then submit the quote.

Expected result: One clear, consistently worded validation message per missing field.

Actual result: The same issue (Company 1 missing a name) is reported three times in two formats: "Company 1: Company Name is required." and "Company 1: 'Company Name' is required" (the second wording repeated twice).

Evidence: Exploratory session notes. Screenshot still to be attached.

Related: DEF-011 shows the same pattern of one validation failure rendered several times.

Lifecycle record: New.

Recommendation: Report each validation failure once, with one message format.
