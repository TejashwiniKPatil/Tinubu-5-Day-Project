# Test Case Review Checklist

Use this list for new cases and when reviewing existing ones. A case passes review only when every item is true.

## Each row

- [ ] The ID is unique, follows the prefix and number rules, and was not already used.
- [ ] The title is unique and names one condition. It is not copied from another row.
- [ ] The technique tag matches how the case was designed.
- [ ] The priority follows the table in `case-writing-rules.md`.
- [ ] The preconditions are enough to run the case on its own.
- [ ] The test data names the exact values and the partition or boundary. It holds no secrets.
- [ ] Each step is one action, and the steps match the title and the test data.
- [ ] The expected result is observable, is decided by one outcome, and says "requirement to confirm" where the rule is not documented.
- [ ] Actual Result and Status are empty or `Not Executed` unless there is execution evidence, and dated when filled in.

## The set of cases

- [ ] Every EP class has a case, and every documented limit has a below, at, and above case.
- [ ] Decision tables cover the eligible combination, each single adverse condition, and multiple adverse conditions.
- [ ] State transitions cover every valid transition and the invalid ones that must be blocked.
- [ ] No two rows test the same thing.
- [ ] Where a spec automates a case, the spec's ID and title match the row.

## Known issues to watch for in this repo

These were found in earlier reviews. Check that new work does not repeat them.

- TC-010's title and steps once duplicated TC-009 (long username instead of long password). See `day-2/test-case-review-notes.md`.
- TC-019's title in the Day 2 workbook reads "es".
- Four specs use a different number from the workbook for the same scenario: spec TC-040 is workbook TC-039, spec TC-041 is TC-040, and spec TC-043 is TC-042.
- The dashboard button was renamed from "Start New Bond" to "Start a Bond", but the Bonds list page still says "Start New Bond". Name the right button for the right page.
