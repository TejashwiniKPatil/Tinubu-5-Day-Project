# Playwright Conventions for This Repository

## Folders

- `src/pages/`: Page Objects, one class per page or feature, named `<Name>Page.ts` in PascalCase. All locators live here.
- `src/api/`: API client classes such as `LoginApi.ts` and `CreateBondApi.ts`.
- `src/helpers/`: Reusable multi-step workflows built from Page Objects, for example `openConfiguredQuote()`.
- `src/fixtures/qa.ts`: The extended `test` that provides Page Object fixtures and `authenticatedSession`. Register every new Page Object here.
- `src/utils/environment.ts`: `getRequiredEnvironmentVariable()` and `getOptionalEnvironmentVariable()`.
- `test-data/`: Constants (`constants.ts`), environment-backed data, and case manifests. Put UI text, labels, and messages here, never in Page Objects or specs.
- `tests/ui/<feature>/`: Browser specs, with kebab-case names ending in `.spec.ts`.
- `tests/api/`: API-only specs.
- `tests/hybrid/`: Specs that combine UI and API steps in one test.
- `tests/ui/logout/`: Must sort last, because logout ends the shared saved session.

## Locators

UI wording in Alpha changes often, so prefer them in this order:

1. `getByTestId()`, which uses the `data-testid` attribute. Inspect the live page for one before falling back.
2. A CSS attribute selector when a test ID contains a changing number. Match its stable prefix and suffix, as `bondFormCards` does.
3. `getByRole()` without a name (for example `alert`), or with a name taken from data or constants
4. `getByLabel()`, `getByPlaceholder()`, or `getByText()` with `exact: true`, only when the element has no test ID

Never hardcode UI text in a Page Object or spec. Keep it in `test-data/constants.ts` (for example `bondNavText`, `bondFields`) so a wording change is a one-line fix.

Avoid XPath, generated CSS class names (for example `_tagValue_a4asz_69`), and index-based selection such as `.nth(2)`.

When text appears more than once on a page, scope the locator. For example, find a header value by its label, or use a role such as `heading`. Do not add `.first()` to silence a strict-mode error, because it can pass by matching the wrong element (this happened in TC-024).

## Page Object shape

- The constructor takes `page: Page` and assigns `readonly` locators.
- User actions are async methods, such as `submit()` or `searchAndSelectAgency()`.
- Checks are async methods named `assert...`, and they use web-first assertions.
- Map readable labels to test IDs in one private method, as `BondCreationPage.field(label)` does, so specs pass labels such as "Bond Amount".
- Keep each Page Object to one page or feature. Do not build a "god" Page Object.

## Specs

- Import `test` and `expect` from `src/fixtures/qa.ts` for UI tests, or from `@playwright/test` for API-only tests.
- Request `authenticatedSession` for tests that need a logged-in user, and write `void authenticatedSession;` as the first line.
- Login specs start with empty storage: `test.use({ storageState: { cookies: [], origins: [] } })`.
- Start the title with the workbook case ID: `TC-0xx - <workbook title>`. Use the exact workbook number.
- Use `test.step()` to label the UI and API halves of a hybrid test.

## Tags

- `@smoke`: The 10-case build-acceptance set only.
- `@sanity`: A narrow recheck of one module.
- `@regression`: The broad suite.
- `@high-value`: The scored Day 4 selection.
- Feature tags: `@bond-creation`, `@api`, `@hybrid`, and `@lockout`.
- State tags: `@stateful-bond` for tests that create bonds, and `@stateful-login` for tests that change the account state. Flaky triage excludes both.

## Waiting

- Rely on Playwright auto-waiting for clicks and fills.
- Use `await expect(locator).toBeVisible()` and the other web-first assertions.
- Wait for real events, such as `page.waitForResponse((r) => r.url().includes('/execute'))`.
- If Alpha is slow, give that one assertion a longer timeout, for example `{ timeout: 15_000 }`. Never use `waitForTimeout`.

## Test data and secrets

- Read credentials with `process.env` through `test-data/constants.ts` or `getRequiredEnvironmentVariable()`.
- Read QA records, such as the principal or underwriter, from `.env` through `test-data/bondCreationData.ts`.
- When required data is missing, fail with a message naming the variable, as `requireData()` does. Do not skip.

## Verification

1. Run `npm run typecheck`.
2. Run `npx playwright test --list --grep "<ID>"` to confirm the test is discovered.
3. Run the test against Alpha, and use `--repeat-each=3 --retries=0` to check stability.
4. If a test fails, open its trace with `npx playwright show-trace <trace.zip>`, find the root cause, and fix that cause.
