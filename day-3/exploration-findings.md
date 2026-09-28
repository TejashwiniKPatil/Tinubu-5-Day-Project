# Day 3 Exploration Findings

The supplied exploration source is retained as `day-3/exploration-notes.docx`.

This index keeps the source document separate from the structured QA records. Findings should be recorded with observed behavior and linked evidence.

Current repository evidence includes the Login and Bond Creation workflows, the UI bug screenshots in `screenshots/ui-bugs`, and the defect reports in `day-3/defects`. DEF-003 records the supplied screenshot of a long bond note overflowing the page layout.

The Bond Creation exploratory session (`exploratory-session-2.md`) was executed and found seven bugs, logged as follows. The Login session (`exploratory-session-1.md`) has not been executed yet.

- **DEF-002** (session DEF-01): Submit blocked despite an attached principal company. High severity, High priority.
- **DEF-006** (session DEF-02): Duplicate "Company Name is required" errors. Low severity, Medium priority.
- **DEF-007** (session DEF-04): Penalty-limit error shows an unformatted number. Low severity, Low priority.
- **DEF-008** (session DEF-05): Company saved as "Unknown". Medium severity, Medium priority.
- **DEF-009** (session DEF-06): "On this page" navigation overlaps the action buttons. Low severity, Low priority.
- **DEF-010** (session DEF-07): Stray "t2" text in Surcharges & Discounts. Low severity, Low priority.
- **DEF-011** (session DEF-08): The same validation error is shown three times. Low severity, Low priority.

No application behavior is marked as verified in this index unless it has a linked execution result or evidence file.
