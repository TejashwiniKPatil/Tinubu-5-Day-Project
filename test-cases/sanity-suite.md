# Sanity Suite

A quick check that the Bond Creation entry point works after a new build or a UI change. Run it before smoke. If it fails, the build is not ready for further testing.

Run: `npm run test:sanity` (selects tests tagged `@sanity`)

Spec: [tests/ui/bond-creation/bond-creation-sanity.spec.ts](../tests/ui/bond-creation/bond-creation-sanity.spec.ts)

## Cases

| # | Test | What it checks | Expected result |
|---|------|----------------|-----------------|
| S-01 | Sanity check for Bond Creation entry flow | 1. The dashboard Start Bond button (`dashboard-start-bond-button`) shows the label **Start a Bond**. 2. Clicking it opens bond search. 3. The agency selector is visible and enabled. | Label matches, bond search opens, agency selector is ready. |

## Button label check

The dashboard button was renamed from **Start New Bond** to **Start a Bond**. The test finds the button by its test ID and compares the label with `startBondButtonText` in [test-data/constants.ts](../test-data/constants.ts), so the check keeps working after a rename and fails with a clear message:

```
Expected substring: "Start a Bond"
Received string:    "+ Start a Bond"
```

If the label changes again and the change is intended, update `startBondButtonText`. If it is not intended, raise a defect. The on-screen label also includes a leading "+" icon, so the check matches on "contains" rather than on exact text.

## Latest result

| Date | Environment | Result |
|------|-------------|--------|
| 2026-09-29 | https://alphanewui.tinubusurety.com (Chromium) | 1 passed |
