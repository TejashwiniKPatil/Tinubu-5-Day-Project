# Evidence Rules

## Where evidence goes

| Evidence | Save it in | Note |
|----------|-----------|------|
| Screenshots of UI problems | `screenshots/ui-bugs/` | kebab-case file name, for example `penalty-limit-duplicate-errors.png` |
| Screenshots from failing automated tests | `screenshots/Errors/` | Created automatically by the failure-screenshot fixture |
| Saved API responses, reports, and copies of traces | `day-3/evidence/` | Copy them here: `test-results/` is cleared on every Playwright run |
| Axe and Lighthouse reports | `day-3/evidence/` | Save the report, not only a summary |

## What counts as evidence

- A screenshot of the problem on screen.
- A Playwright trace or error context (`test-results/<test>/error-context.md`), copied to `day-3/evidence/`.
- A response status code and body from DevTools > Network or an API test, with any tokens removed.
- A dated test run, naming the command, for example `npm run test:high-value` on 2026-09-29.

Exploratory notes on their own are a start, not proof. Say what is still to be attached.

## Keeping secrets out

- Before saving a screenshot, check that it shows no username, password, token, cookie, or personal data. Crop or blur it if it does.
- Remove `access_token`, `refresh_token`, `Authorization` headers, and cookies from saved responses.
- Playwright traces can record typed values, including passwords. Do not attach a trace from a test that typed the real password; describe the step instead.
- Refer to accounts by role ("the QA test account", "the lockout account"), never by name or credential.
