# New Page Object

Create a new TypeScript Page Object Model for the page or feature named by the user.

## Conventions

- Create the file under `src/pages/<PascalCaseName>Page.ts`.
- Import `Page` and `Locator` from `@playwright/test`.
- Use async methods for user actions.
- Keep all locators inside the page object.
- Prefer:
  - `getByRole()`
  - `getByLabel()`
  - `getByText()`
  - `getByPlaceholder()`
  - `getByTestId()`
- Avoid XPath and fragile CSS selectors unless no better locator is available.
- Put reusable labels, titles, messages, and test IDs in `test-data/constants.ts`.
- Expose meaningful user actions through methods.
- Do not expose raw selector details to test specs.
- Use web-first assertions for synchronization.
- Never use `waitForTimeout()`.
- Keep test data and credentials out of the Page Object Model.
- Do not include credentials, access tokens, refresh tokens, API keys, or application secrets.
- If the Page Object is used by multiple specs, add it to `src/fixtures/qa.ts`.
- Keep the Page Object focused on one page or feature. Do not create a large "god" POM containing unrelated functionality.
- Do not modify existing Page Objects unless specifically requested.

## Output

After creating the Page Object, report:

1. Created file path.
2. Public methods added.
3. Locators/selectors added.
4. Constants added to `test-data/constants.ts`, if any.
5. Fixture changes made to `src/fixtures/qa.ts`, if any.
6. The focused Playwright command used to validate the Page Object.
7. Any assumptions or items that require manual verification.