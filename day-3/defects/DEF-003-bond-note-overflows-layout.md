# DEF-003 500-character bond note breaks page layout

Status: New

Priority: High

Severity: Medium

Module: Bond Creation

Environment: Alpha Surety QA (as shown in the supplied screenshot; build and browser not recorded)

Preconditions: User can create a bond and reach the notes field.

Steps:

1. Start a new bond and complete the required fields to reach Notes.
2. Enter a 500-character note.
3. Continue through the bond workflow and inspect the resulting bond view at the normal viewport size.

Expected result: The note is displayed or constrained within its content area. The page remains usable without horizontal overflow or clipping of unrelated content.

Actual result: The supplied screenshot shows the long note extending across the page, with a horizontal scrollbar and bond content clipped beyond the viewport.

Evidence: User-provided attachment `Screenshot 2026-09-24 164822.png` (attached to the request; the image was not copied into the repository).

Lifecycle record: New. Reproduce on a recorded build/browser and capture repository evidence before triage or claiming additional behavior.

Recommendation: Constrain long note rendering to its content container and preserve usable page layout; validate with boundary-length notes.
