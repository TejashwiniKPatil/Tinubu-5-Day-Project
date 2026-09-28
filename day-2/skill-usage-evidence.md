# Skill Usage Evidence: test-case-designer

The brief asks us to use the skill so that the second feature's cases come out in the same shape as the first, without re-explaining the format. This note records that use.

## How the skill was used

- **Date:** 2026-09-28, in Claude Code
- **Skill:** `.claude/skills/test-case-designer`
- **Prompt:** "Design the missing Bond Creation test cases for the Day 2 workbook: decision-table cases for approval/eligibility (credit tier x bond amount x indemnitor x prior claims), state-transition cases for the bond lifecycle (Draft, Submitted, Under Review, Approved, Declined, Issued, Cancelled, Expired, including invalid transitions), and equivalence-partition cases for premium. Continue numbering after TC-048. Use the CSV template."
- **How it loaded:** The skill was invoked by name. The prompt also contains the trigger words from its description (Bond Creation, decision tables, state transitions, equivalence partitioning, Day 2 workbook). How the description was reworded to trigger reliably is covered in `skill-trigger-note.md`.
- **Output:** 24 cases, TC-049 to TC-072, in `day-2/test-cases-additions.csv`

## What the skill made Claude do

Each step of the skill's workflow shows in the output:

1. **Separate facts from assumptions.** Expected results use observed Alpha behaviour where it exists (status "Referred" for a $40,000,000 bond, the "Penalty must not exceed 40000000.0000." error, and the premium breakdown). Otherwise they say "Configured rule / requirement to confirm". No approval rules were invented.
2. **Choose the technique from the references.**
   - DT cases follow `references/decision-table-guide.md`: an eligible combination, each single adverse condition, and multiple adverse conditions.
   - ST cases use its bond lifecycle states, and include invalid transitions.
   - EP cases use the partitions and the $0 to $40,000,000 limits from `references/bva-ep-rules.md`.
3. **Write rows with `templates/test-case-row.csv`.** Every row has the same 11 columns in the same order.
4. **Leave Actual Result and Status blank.** No case has been executed yet, so no result is claimed.

## Same shape, two features

The first feature (Login) was designed on Day 2. The second feature's new cases (Bond Creation) came out in the identical column layout without the format being explained again.

First feature, Login (from the workbook):

```csv
TC ID,Module,Test Case Title,Technique,Priority,Preconditions,Test Data,Test Steps,Expected Result,Actual Result,Status
TC-005,Login,Login with blank username,EP,High,User is on Login page,Username = blank; valid password,1. Leave Username blank. 2. Enter valid password. 3. Click Sign In.,"""Username is required "" Error message  is displayed and login is not performed.","""Username is required "" Error message is displayed and login is not performed.",Passed
```

Second feature, Bond Creation (produced by the skill):

```csv
TC ID,Module,Test Case Title,Technique,Priority,Preconditions,Test Data,Test Steps,Expected Result,Actual Result,Status
TC-056,Bond Creation,DT R8: amount above maximum is rejected whatever the other conditions,DT+BVA,Critical,...,Any credit tier; Bond Amount $40,000,001; any indemnitor; any prior claims,1. Select any principal. 2. Enter Bond Amount 40000001. 3. Submit the quote.,"Submission is rejected with ""Penalty must not exceed 40000000.0000."" and no bond is created. ...",,
```

The TC-005 row is copied exactly from `day-2/test-cases.xlsx`, including its recorded result. The TC-056 row is shortened with "..." for readability; the full row is in `day-2/test-cases-additions.csv`.

## Next step

Copy the rows from `day-2/test-cases-additions.csv` into `day-2/test-cases.xlsx` so that the workbook contains all 69 designed cases.
