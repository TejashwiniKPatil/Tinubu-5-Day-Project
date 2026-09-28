# DEF-004 Created person or company disappears after refresh

Status: New

Priority: High

Severity: Medium

Module: Bond Creation — Principal Information

Environment: Alpha Surety QA (as shown in the supplied screenshot; build and browser not recorded)

Preconditions: User can open Start your Quote and create or select a person or company as a principal.

Steps:

1. Open Start your Quote and create or select a person or company under Principal Information.
2. Confirm the entry appears in the principal list.
3. Refresh the page.
4. Search for the same person or company.

Expected result: The created person or company remains saved and available after refresh, so it can be selected again without creating duplicate records.

Actual result: The user reports that the created person or company disappears after refresh and must be added again.

Evidence: User-provided screenshot in the request shows the Principal Information section and person/company lists. The refresh behavior is reported by the user; no post-refresh screenshot or recording was supplied.

Lifecycle record: New. Reproduce on a recorded build/browser and capture post-refresh evidence before triage or claiming additional behavior.

Recommendation: Persist newly created principal records and reload them when the quote page is refreshed; verify that the same record can be found and reused without duplication.
