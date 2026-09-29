---
name: test-case-designer
description: "Use when creating or reviewing QA test cases for Tinubu Surety Login, Logout, or Application/Bond Creation, including security, performance, and usability cases. Trigger for equivalence partitioning, boundary values, decision tables, state transitions, error guessing, test case numbering, or formatting rows for the Day 2 workbook, test-cases-additions.csv, or test-cases/test-cases.xlsx."
---

# Test Case Designer

Designs and reviews test cases that match the Day 2 workbook, one row per case, in the 11 columns of `templates/test-case-row.csv`.

## Workflow

1. **Collect facts.** Read the requirement, `day-1/feature-workflows.md`, and any observed behavior (defects in `day-3/defects/`, execution notes). Write down which facts are documented, which were observed in Alpha, and which are unknown.
2. **Pick the technique** for each behavior with `references/technique-selection.md`. For field limits read `references/bva-ep-rules.md`. For combined rules and lifecycle states read `references/decision-table-guide.md`.
3. **Check for duplicates and the next ID.** Search `day-2/test-cases.xlsx`, `day-2/test-cases-additions.csv`, and `test-cases/test-cases.xlsx` for the same scenario. Number new cases with `references/case-writing-rules.md`.
4. **Write the rows** with `templates/test-case-row.csv`, following every column rule in `references/case-writing-rules.md`. Compare the shape with `examples/example-rows.csv`.
5. **Review before handing over.** Go through `references/review-checklist.md` and fix every failed item.

## Hard rules

- Never invent a requirement, limit, or outcome. When the rule is not documented or observed, write "requirement to confirm" in the expected result.
- Leave Actual Result blank and Status as `Not Executed` until there is execution evidence.
- Never put usernames, passwords, tokens, or other secrets in any column. Refer to "valid QA credentials from environment variables" instead.
- Every case must be executable on its own: its preconditions set up everything it needs.
- A title, ID, and scenario must stay the same in the workbook, the CSV, and any automated spec that implements it.
- Never run git commands that change anything: no branches, commits, staging, pushes, or resets. The user does all git work.
