# Defect Lifecycle and Severity Guidance

## Lifecycle

New means the defect has reproducible evidence and has not been triaged.

Triaged means severity, priority, owner, and target release have been reviewed.

In Progress means engineering is actively investigating or fixing it.

Fixed means engineering reports a change is available for verification.

Ready for Retest means QA has a build and reproducible steps for verification.

Reopened means the fix did not resolve the original behavior or caused a regression.

Rejected means the behavior is working as designed or lacks reproducible evidence.

Deferred means the defect is accepted for later work with an explicit reason.

Closed means QA verified the fix or accepted the final disposition.

## Required Evidence

Every defect needs environment, preconditions, numbered steps, expected result, actual result, evidence path, severity, priority, and lifecycle status.

## Priority and Severity Examples

Examples come from logged defects where one fits. Otherwise the example is illustrative and labelled as such.

- **High severity, high priority:** DEF-002. Submit is blocked even though a principal company is attached, so no quote can be submitted in this path.
- **High severity, low priority:** Illustrative, because no logged defect fits yet. A data-loss error in a rarely used administrative screen.
- **Low severity, high priority:** Closest logged defect is DEF-006 (Low severity, Medium priority). Duplicate "Company Name is required" messages confuse users at the Submit step.
- **Low severity, low priority:** DEF-010. Stray "t2" text appears below the Surcharges & Discounts helper text.

## Required Lifecycle Demonstration

Use one real defect to demonstrate New, Triaged, In Progress, Fixed, Ready for Retest, Reopened, Fixed, and Closed. Use a separate evidence-backed case for Rejected or Deferred. Do not invent these transitions when no execution evidence exists.

**Current evidence gap:** The repository records DEF-001 to DEF-011 as New. No state-transition history demonstrates Reopened or a Rejected/Deferred disposition yet; add those only after the corresponding real triage and retest events.
