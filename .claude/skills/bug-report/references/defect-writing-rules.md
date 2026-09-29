# Defect Writing Rules

Rules for each field in `templates/defect-report.md`. Match the layout of the existing files in `day-3/defects/`.

## ID and file name

- IDs are `DEF-` plus three digits, in order. DEF-001 to DEF-011 are used, so the next is **DEF-012**. Check `day-3/defects/` first.
- File name: `DEF-###-short-kebab-case-summary.md`, for example `DEF-002-submit-blocked-despite-attached-principal-company.md`.
- Never renumber or reuse an ID, even for a Rejected defect.

## Title

`# DEF-### <observed problem>` in plain words, describing what goes wrong, not the fix. Quote the key on-screen text when it identifies the problem:
`# DEF-002 Submit blocked with "at least one person or company required" despite an attached principal company`.

## Status, Priority, Severity

Status comes from `lifecycle.md`. Severity and priority come from `severity-priority-guide.md`. Write each as one word: `High`, `Medium`, or `Low`.

## Module

The feature, then the step or section: `Bond Creation — Step 2, Principal Information`, `Login`, `Bond Creation — Step 5, Surcharges & Discounts`.

## Environment

`Alpha Surety QA (https://alphanewui.tinubusurety.com)`, plus the browser, viewport, and build when known. When they are not known, say "build and browser not recorded". Do not guess them.

## Source

Where the defect was found: an exploratory session (with its session bug ID), a failing automated test (with its ID and spec), a test case run (TC ID), an axe scan, or API testing.

## Preconditions

The state before step 1: who is signed in (the role, never the credentials), which bond type or record is open, and any data setup.

## Steps

A numbered list, one action per line, detailed enough that someone new can repeat it. Include the exact values entered.

## Expected result

What should happen, and why: "Submission proceeds, because a valid principal company is already attached." Cite the requirement, workflow note, or test case it comes from. If the expected behavior is not documented, say so.

## Actual result

What happened, quoting on-screen text exactly and naming values and status codes: "A red banner shows "1 error found — please fix before submitting / PEOPLE & COMPANIES: At least one person or company is required" … The COMPANIES counter reads "(0)" while one company is listed."

## Evidence

The paths to the screenshot, trace, report, or saved response (see `evidence-rules.md`). If evidence is still to be attached, say exactly what is missing.

## Impact

Who is affected and what they cannot do. Name the test cases that are blocked or failing because of this defect.

## Lifecycle record

Each status change on its own line, with the date and what caused it: `2026-09-29: New (found by TC-044 automated run).`

## Recommendation

Optional. A short suggestion for the fix direction. Keep it separate from the facts above.
