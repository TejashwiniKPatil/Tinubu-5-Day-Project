---
name: bug-report
description: "Use when converting QA notes, failed tests, or observed application behavior into a reproducible defect report with severity, priority, evidence, and lifecycle status."
---

# Bug Report Skill

Use this skill when a test fails or observed application behavior differs from the documented expectation.

## Required Report

1. Defect ID and title using the format `[Module] concise observed problem`.
2. Environment, browser, build or URL, date, and test data without secrets.
3. Preconditions.
4. Numbered reproduction steps.
5. Expected result.
6. Actual result.
7. Evidence path for screenshot, trace, console output, or network observation.
8. Severity recommendation with impact reasoning.
9. Priority recommendation with business urgency reasoning.
10. Lifecycle status such as New, Triaged, In Progress, Fixed, Ready for Retest, Reopened, Rejected, Deferred, or Closed.

## Rules

- Separate observed facts from assumptions.
- Never include usernames, passwords, tokens, or other secrets.
- Do not claim reproducibility without recording the execution evidence.
- Do not change the expected result to make a failed test pass.
- Record every override when the recommended severity or priority is changed.

## Output

Return a structured defect report followed by open questions and an override record when applicable.
