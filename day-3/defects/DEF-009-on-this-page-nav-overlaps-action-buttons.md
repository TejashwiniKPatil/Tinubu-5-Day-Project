# DEF-009 "On this page" side navigation overlaps Principal/People action buttons

Status: New

Priority: Low

Severity: Low

Module: Bond Creation — Step 2, Principal & Indemnitors

Environment: Alpha Surety QA (https://alphanewui.tinubusurety.com/bonds/new); build, browser, and viewport not recorded

Source: Bond Creation exploratory session (session bug DEF-06)

Preconditions: User is signed in and has a bond quote open at Principal Information.

Steps:

1. Add enough companies and people that the Principal & Indemnitors cards grow taller than one row.
2. Look at the right-hand "ON THIS PAGE" navigation at that scroll position.

Expected result: The navigation links stay clear of form content, whatever the card height.

Actual result: The "Projects", "Team Assignment", and "Notes & Instructions" links render on top of the INDEMNITOR buttons in the People card.

Evidence: `screenshots/ui-bugs/on-this-page-nav-overlap.png`. Also recorded as UX-02 in `day-5/usability-accessibility-review.md`.

Lifecycle record: New.

Recommendation: Keep the side navigation in its own column, or make it sticky without overlapping form content.
