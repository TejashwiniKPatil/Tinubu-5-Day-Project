# DEF-010 Stray "t2" placeholder text near the Surcharges & Discounts field

Status: New

Priority: Low

Severity: Low

Module: Bond Creation — Step 5, Surcharges & Discounts

Environment: Alpha Surety QA (https://alphanewui.tinubusurety.com); build and browser not recorded

Source: Bond Creation exploratory session (session bug DEF-07)

Preconditions: User is signed in and can open a new bond quote.

Steps:

1. Open a new blank quote.
2. Scroll to the "Surcharges & Discounts" section.

Expected result: Only the "Allowed: 3% – 90%" helper text and the Value (%) input are visible.

Actual result: An unexplained "t2" text fragment renders just below the helper text. It looks like leftover debug or placeholder content.

Evidence: Exploratory session notes. Screenshot still to be attached.

Lifecycle record: New.

Recommendation: Remove the stray text from the section template.
