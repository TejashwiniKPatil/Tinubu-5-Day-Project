# Worked Example: From Notes to a Defect

This shows the skill's workflow on real material from this repo. The finished report it is based on is `day-3/defects/DEF-002-submit-blocked-despite-attached-principal-company.md`.

## Input: rough notes

> tried to submit ag dealer quote, attached NUI1157 AAC Probe 0913 as principal, DupCo LLC shows under companies with PRINCIPAL tag. submit -> red banner "at least one person or company required". companies counter says (0)?? blocks submit completely. TC-044 and 45 cant finish.

## Step 1: facts and assumptions

| Observed | Assumed or unknown |
|----------|--------------------|
| The banner text, quoted exactly | The build number and browser (not recorded) |
| The company card is visible with a PRINCIPAL tag | Whether other bond types are affected |
| The COMPANIES counter reads "(0)" | The root cause (the counter and the validation reading a different state is a guess) |
| Submit does not proceed | |

## Step 2: is it new?

`day-3/defects/` had no defect for Principal Information or this banner, so a new ID was used.

## Steps 3 to 6: the report

The result is the DEF-002 file. Points to notice:

- The **title** names the symptom and quotes the banner, not the fix.
- The **actual result** quotes the banner word for word and names the "(0)" counter.
- The **expected result** gives the reason ("because a valid principal company is already attached").
- The **evidence** says what is still missing ("Screenshot of the banner and the "(0)" counter still to be attached") instead of claiming a screenshot exists.
- The **impact** names the blocked test cases, TC-044 and TC-045.
- **Severity High:** a core flow, quote submission, is blocked. **Priority High:** it blocks every quote submission in this path and two Critical test cases.
- The **recommendation** is kept apart from the facts.

## Later evidence

On 2026-09-29, the automated TC-044 and TC-045 runs failed with the app's own message: "Submit was blocked by validation: "1 error found — please fix before submitting PEOPLE & COMPANIES At least one person or company is required"". That is new evidence for the same defect, so it belongs in DEF-002's Evidence and Lifecycle record, not in a new defect.
