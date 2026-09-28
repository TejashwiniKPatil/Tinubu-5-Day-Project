# Decision Tables and State Transitions

## Decision Tables

Use DT when two or more conditions jointly determine approval, eligibility, routing, or rejection.

For bond approval, vary the following documented or explicitly requested conditions:

Credit Tier
Representative values: High, Medium, Low.

Bond Amount
Representative values: Normal, High, Over configured threshold.

Indemnitor
Representative values: Present, Absent.

Prior Claims
Representative values: None, Present.

Cover the following combinations:

- Apparently eligible combination
- Each single adverse condition
- Multiple adverse conditions

The repository does not define the actual thresholds, approval matrix, or decision text.

Until these rules are verified, mark the expected outcome as:

Configured rule / requirement to confirm

## State Transitions

Use ST when testing valid or invalid movement between application states.

Login states to consider:

- Signed Out
- Authenticated
- Failed Attempt 1
- Failed Attempt 2
- Failed Attempt 3
- Locked Out

Bond Creation states to consider:

- Draft
- Submitted
- Under Review
- Approved
- Declined
- Issued
- Cancelled
- Expired

Use ST plus DT when a decision-table result causes a lifecycle state transition.

Do not classify a simple required-field validation as a state transition.

Do not mark a state transition as verified unless the Actual Result and Status columns contain execution evidence.
