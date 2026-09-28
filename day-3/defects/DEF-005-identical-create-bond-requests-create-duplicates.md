# DEF-005 Identical create-bond requests create duplicate bonds

Status: New

Priority: High

Severity: High

High-value: Yes. Duplicate bonds are a data-integrity and financial risk, and client retries, double submits, or network replays can trigger them.

Module: Bond Creation API

Environment: Alpha Surety QA API (`LOGIN_API` host). Build not recorded.

Preconditions: A QA user can get an access token from `POST /auth/auth/token`. Credentials come from environment variables.

Steps:

1. Get an access token with `POST /auth/auth/token`.
2. Send `POST /bond/bonds/actions/execute` with `Authorization: Bearer <token>` and the `payload2` body from `test-data/constants.ts` (bond type 500008, account 1000157, agency 700014, penalty 40,000,000).
3. Send the same request with the identical payload again.
4. Compare the two responses and check the bond list for the resulting records.

Expected result: The second identical request does not create another bond. The API rejects it as a duplicate with HTTP 409 Conflict.

Actual result: Both identical requests returned `Success: true` and created separate bonds: BondId 1012032 (BondActionLogId 1031578) and BondId 1012033 (BondActionLogId 1031579). Both have status "Referred" and a penalty of 40,000,000.

Evidence: TC-047 run on 2026-09-28 at 13:40 against Alpha. The failure report `test-results/api-duplicate-bond-api-TC--6af07-ue-regression-stateful-bond-chromium/error-context.md` contains both response bodies. Still to attach: a screenshot of both bonds in the bond list. Keep a copy of the failure report, because `test-results/` is overwritten by the next run.

Regression coverage: `tests/api/duplicate-bond-api.spec.ts` (TC-047, tagged `@high-value @regression @stateful-bond`). It sends the same payload twice and expects the second request to return HTTP 409 Conflict. It runs in every `@regression` and `@high-value` run and creates bonds in Alpha each time. It is excluded from flaky triage by its `@stateful-bond` tag. It is expected to fail until the defect is fixed.

Related: Error guess #1 in `day-3/intuition-error-guessing.md` (double-clicking Submit creates a duplicate bond). The API result does not prove the UI case; verify it separately.

Lifecycle record: New. Reproduced on 2026-09-28 by TC-047.

Recommendation: Add duplicate detection or an idempotency key to bond creation so retries cannot create unintended duplicate bonds.
