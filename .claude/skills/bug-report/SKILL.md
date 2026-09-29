---
name: bug-report
description: "Use when converting QA notes, failed tests, exploratory findings, accessibility or security results, or observed application behavior into a reproducible Tinubu Surety defect report (DEF-###) with severity, priority, evidence, and lifecycle status. Also use when retesting, triaging, overriding severity or priority, or moving a defect through its lifecycle."
---

# Bug Report

Turns an observation into a defect file in `day-3/defects/`, in the same shape as the existing DEF-001 to DEF-011.

## Workflow

1. **Separate facts from guesses.** List what was actually seen (screen text, status codes, values) and where the evidence is. Mark anything not seen as an assumption. If there is no evidence yet, say so; do not write the defect as confirmed.
2. **Check it is new.** Search `day-3/defects/` for the same module and symptom. If it matches an open defect, add the new evidence there instead of creating a duplicate.
3. **Take the next ID** (`references/defect-writing-rules.md`) and name the file `DEF-###-kebab-case-summary.md`.
4. **Fill in `templates/defect-report.md`**, following the field rules in `references/defect-writing-rules.md` and the evidence rules in `references/evidence-rules.md`.
5. **Recommend severity and priority** with `references/severity-priority-guide.md`, and give a one-line reason for each.
6. **Set the lifecycle status** with `references/lifecycle.md`. A new defect is `New`.
7. **Record overrides.** If anyone changes the recommended severity or priority, add an entry to `day-3/bug-report-override-log.md` with `templates/override-entry.md`.
8. **Link it.** Name the defect in the failing test case's Actual Result, and name the blocked test cases in the defect's Impact.

## Hard rules

- Never include usernames, passwords, tokens, cookies, or other secrets, in the text or in screenshots.
- Do not claim a defect is reproducible without recorded execution evidence.
- Never change the expected result to match what the app does.
- Quote on-screen messages exactly, including their spelling and punctuation.
- Compare with `examples/worked-example.md` before handing the report over.
- Never run git commands that change anything: no branches, commits, staging, pushes, or resets. The user does all git work.
