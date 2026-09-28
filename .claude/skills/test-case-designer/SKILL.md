---
name: test-case-designer
description: "Use when creating or reviewing manual QA test cases for Tinubu Surety Login, Logout, or Application/Bond Creation. Trigger for equivalence partitioning, boundary values, decision tables, state transitions, or formatting cases for the Day 2 workbook."
---

# Test Case Designer

Use this skill when the task is to design or review test cases, especially when the user mentions Login, Bond Creation, EP, BVA, decision tables, state transitions, or the Day 2 workbook.

## Workflow

1. Read the relevant requirements and workflow notes. Separate documented facts from assumptions and unknowns.
2. Choose the technique that fits each behavior. Read `references/bva-ep-rules.md` for equivalence partitions and boundaries; read `references/decision-table-guide.md` for combined rules and lifecycle transitions.
3. Write rows using `templates/test-case-row.csv`. Keep each case independently executable and give it a technique tag and priority.
4. Leave actual result and status blank until execution evidence exists. Do not invent requirements, outcomes, or results.

## Project conventions

- Reuse the case IDs, inputs, and constants already in `day-2/`, `test-data/`, and `test-data/constants.ts`.
- Keep credentials in approved environment variables; never put secret values in cases or evidence.
- For Playwright ideas, use the Page Objects and fixtures under `src/`; put locators in Page Objects and use web-first assertions.
- Use `CLAUDE.md` for repository-wide coding and security rules.
