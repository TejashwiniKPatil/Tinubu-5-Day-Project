# Choosing a Technique

Tag every case with the technique that produced it, in the Technique column. Use a combination such as `ST+BVA` when two techniques drive one case.

| Technique tag | Use it when | Example in this repo |
|---------------|-------------|----------------------|
| `EP` (equivalence partitioning) | Inputs fall into classes that should behave the same (valid, invalid, blank, overlong). Write one case per class. | TC-003 invalid username, TC-005 blank username |
| `BVA` (boundary value analysis) | A field has a numeric, length, or count limit. Test the limit, just below it, and just above it. | TC-026 to TC-029 Bond Amount 0, -1, 40000000, 40000001 |
| `DT` (decision table) | Two or more conditions together decide the outcome (approval, referral, rejection). One case per rule. | TC-049 to TC-056 credit tier x amount x indemnitor x prior claims |
| `ST` (state transition) | The system moves between states (lockout, bond lifecycle). Cover each valid transition and each invalid transition that must be blocked. | TC-011 to TC-014 lockout, TC-057 onward bond lifecycle |
| `EG` (error guessing) | Experience suggests a likely failure that the other techniques miss (duplicate submit, refresh mid-flow, leading spaces). | TC-015 username with leading/trailing spaces |
| `API` | The behavior is checked at the API, not the UI. | API-001 Login API, TC-047 duplicate create-bond request |
| `Hybrid (UI + API)` | One scenario needs both layers. | TC-048 Bond Amount maximum in the form and the API |
| `Security` | Session, access control, input handling, data exposure, or transport. Safe, Alpha-only checks. | SEC-001 to SEC-009 |
| `Performance` / `Performance (load)` | Response time for one user, or behavior under concurrent users (k6). | PERF-003 to PERF-006, PERF-001 |
| `Usability (Nielsen heuristic)` | A usability problem judged against a named heuristic. | USA-001 to USA-005 |
| `Accessibility (axe)`, `(keyboard)`, `(screen reader)` | WCAG checks by tool, keyboard only, or assistive technology. | USA-006 to USA-011 |

## Rules of thumb

- Start with EP to find the classes, then add BVA at every documented limit.
- If a case's expected result depends on "it depends on X and Y", it belongs in a decision table.
- If the same action gives a different result the second or third time, model it as a state transition.
- Keep negative and positive cases as separate rows. Do not combine "valid and invalid" into one case.
- For security cases, never design a destructive or high-volume check. Stop-and-report on any real exposure (see `day-5/security-checklist.md`).
