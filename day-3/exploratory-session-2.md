# Exploratory Session 2 — Bond Creation

**Status:** Executed.

- **Charter:** Explore the Bond Creation flow end to end, starting a new bond and then focusing on attaching Principal, Companies, and People. Use the documented flow as a baseline, and log any usability, validation, or data-integrity issues found along the way.
- **Timebox:** About 45 minutes.
- **Environment:** Alpha Surety QA (https://alphanewui.tinubusurety.com), QA test account. Build and browser not recorded.
- **Areas covered:** Steps 1, 2, 3, 5, and 8 were explored in depth: Start New Bond, Principal/Company/People attachment, Bond Details, Surcharges & Discounts, and Finalize. Steps 4 (License and Permit), 6 (Team Assignment), and 7 (Notes and Instructions) were opened but not stress-tested.
- **Bugs found:** 7. One blocks submission (DEF-002), one is a data-integrity issue (DEF-008), and five are validation-messaging or cosmetic issues (DEF-006, DEF-007, DEF-009, DEF-010, DEF-011).
- **Time split (estimated, not measured with a stopwatch):**
  - Setup and test data (finding an agency and bond form, building input strings): about 10 minutes
  - Active testing: about 25 minutes
  - Investigation and logging (reading errors, checking DevTools, writing this sheet): about 10 minutes

## Bug summary

- **[DEF-002](defects/DEF-002-submit-blocked-despite-attached-principal-company.md)** (session DEF-01, Step 2 Principal Information): Submit blocked with "at least one person or company required" despite an attached company. High severity, High priority.
- **[DEF-006](defects/DEF-006-duplicate-company-name-required-errors.md)** (session DEF-02, Step 2 Add Company): Duplicate, inconsistently worded "Company Name is required" errors. Low severity, Medium priority.
- **[DEF-007](defects/DEF-007-penalty-limit-error-shows-unformatted-number.md)** (session DEF-04, Step 3 Bond Details): Penalty-limit error shows the raw number 40000000.0000. Low severity, Low priority.
- **[DEF-008](defects/DEF-008-company-saved-as-unknown-instead-of-blocking-save.md)** (session DEF-05, Step 2 Principal & Indemnitors): New company saved and shown as "Unknown" instead of blocking the save. Medium severity, Medium priority.
- **[DEF-009](defects/DEF-009-on-this-page-nav-overlaps-action-buttons.md)** (session DEF-06, Step 2 Principal & Indemnitors): "On this page" navigation overlaps the Principal/People action buttons. Low severity, Low priority.
- **[DEF-010](defects/DEF-010-stray-t2-text-in-surcharges-and-discounts.md)** (session DEF-07, Step 5 Surcharges & Discounts): Stray "t2" text near the Surcharges & Discounts field. Low severity, Low priority.
- **[DEF-011](defects/DEF-011-same-validation-error-shown-three-times.md)** (session DEF-08, Step 3 Pre Pay Selection): One missing-field error shown three times (banner plus two toasts). Low severity, Low priority.

Each defect file has the full reproduction steps and expected and actual results.

## Findings by flow step

- **Step 1, Start New Bond:** Worked as documented. Agency search, the Commercial/Contract toggle, the Bond Form list, and Select all behaved as expected. No issues found.
- **Step 2, Principal / Companies / People:** Four issues: DEF-002, DEF-006, DEF-008, and DEF-009.
- **Step 3, Bond Amount and Pre Pay Selection:** Two issues: DEF-007 and DEF-011.
- **Step 4, License and Permit:** Opened but not stress-tested. No boundary or format checks on license number, dates, or percentages.
- **Step 5, Surcharges and Discounts:** One cosmetic issue: DEF-010.
- **Step 6, Team Assignment:** Opened but not tested. Dropdown contents, the mandatory Assigned Underwriter, and the optional Assigned Producer were not exercised.
- **Step 7, Notes and Instructions:** Opened but not tested. The 500-character limit was not checked at the boundary.
- **Step 8, Finalize:** A successful submit was never reached, because every attempt hit DEF-002. Submit and Cancel on a clean success path remain unverified.

## Follow-up for the next charter

- Run a dedicated 45-minute charter for Steps 4, 6, and 7.
- Retest Step 8 once DEF-002 is fixed, to confirm that a bond can be submitted end to end.
- DEF-006 and DEF-011 share a pattern: one validation failure is shown two or three times. Check whether they share a root cause in how form validation errors are reported.
