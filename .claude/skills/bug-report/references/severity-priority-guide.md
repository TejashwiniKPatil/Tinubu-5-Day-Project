# Severity and Priority

Severity is the **impact on the system**. Priority is **how urgently it must be fixed**. Decide them separately, and give a one-line reason for each.

The Day 1 test plan maps Severity-1 to High, Severity-2 to Medium, and Severity-3 to Low.

## Severity

| Severity | Choose it when | Example in this repo |
|----------|----------------|----------------------|
| `High` | A core flow is blocked, data is lost or duplicated, a server error occurs, or security is weakened. | DEF-002 submit blocked; DEF-005 duplicate bonds; DEF-001 HTTP 500 on long input |
| `Medium` | A feature works incorrectly but there is a workaround, or data is saved in a wrong state. | DEF-003 long note overflows the layout; DEF-008 company saved as Unknown |
| `Low` | Cosmetic, wording, or formatting problems with no effect on the result. | DEF-007 unformatted penalty number; DEF-010 stray "t2" text |

## Priority

| Priority | Choose it when |
|----------|----------------|
| `High` | It blocks testing or a release condition, or many users hit it on a main path. |
| `Medium` | It should be fixed in the current cycle but does not block it. |
| `Low` | It can wait for a later cycle. |

## They can differ

| Combination | Example |
|-------------|---------|
| High severity, high priority | DEF-002: no quote can be submitted in this path. |
| High severity, low priority | Illustrative only (no logged defect fits yet): data loss in a rarely used admin screen. |
| Low severity, high priority | Closest logged example is DEF-006 (Low severity, Medium priority): duplicate "Company Name is required" messages at Submit. |
| Low severity, low priority | DEF-010: stray "t2" text below the Surcharges & Discounts helper text. |

## Accessibility and security findings

- A critical axe violation on a main path (a missing label, invalid ARIA on a required field) is at least `Medium` severity, because some users cannot complete the task.
- Missing visible focus or low contrast on a main control is `Medium` severity when it blocks keyboard or low-vision users, otherwise `Low`.
- A security finding that exposes data or credentials is `High` severity and priority. Stop testing and report it straight away (`day-5/security-checklist.md`).

## Overrides

If a reviewer changes your recommendation, keep both values and record the change in `day-3/bug-report-override-log.md` with `templates/override-entry.md`.
