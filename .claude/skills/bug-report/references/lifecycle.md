# Defect Lifecycle

The states match `day-3/defect-lifecycle.md`.

| State | Meaning | Evidence needed to move here |
|-------|---------|------------------------------|
| `New` | Reproducible evidence exists; not yet triaged. | Steps and evidence recorded in the defect file. |
| `Triaged` | Severity, priority, owner, and target release reviewed. | Reviewer and date. |
| `In Progress` | Engineering is investigating or fixing it. | Owner named. |
| `Fixed` | Engineering says a change is available. | Build or release reference. |
| `Ready for Retest` | QA has the build and the steps. | Build under test. |
| `Reopened` | The fix did not work, or it caused a regression. | Retest date, build, and the new actual result. |
| `Rejected` | Working as designed, or not reproducible. | The reason and who decided. |
| `Deferred` | Accepted for later, with a reason. | The reason, who decided, and the target cycle. |
| `Closed` | QA verified the fix, or accepted the final decision. | Retest date, build, and result. |

## Allowed moves

```
New -> Triaged -> In Progress -> Fixed -> Ready for Retest -> Closed
                                              Ready for Retest -> Reopened -> In Progress
New or Triaged -> Rejected
New or Triaged -> Deferred -> Triaged (when picked up again)
```

## Rules

- Record every move in the defect's Lifecycle record, with the date and what caused it.
- Never move a defect to `Closed` or `Reopened` without a retest result.
- Never invent a transition to fill the lifecycle demonstration. `day-3/defect-lifecycle.md` notes that no real Reopened, Rejected, or Deferred history exists yet; add one only after the real triage or retest.
- When a failing automated test is the evidence, a pass of that test after the fix is the retest evidence. Record the run date and the command.
