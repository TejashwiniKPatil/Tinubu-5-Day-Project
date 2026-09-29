---
name: playwright-pom
description: "Use when writing, generating, or reviewing Playwright Page Objects, specs, fixtures, or helpers in this Tinubu Surety repo, including new pages, new UI, API, or hybrid tests, locator fixes, flaky-test fixes, and test tagging."
---

# Playwright POM Conventions

Use this skill whenever you add or change Playwright code in this repository, so that every generated Page Object and spec follows the same team conventions.

## Workflow

1. Read `references/conventions.md` before writing code. It covers folders, locators, fixtures, tags, waits, test data, and stateful tests.
2. For a new page, start from `templates/page-object.ts.template`. For a new test, start from `templates/spec.ts.template`.
3. Put every locator in a Page Object under `src/pages/`. Specs call Page Object methods and never build locators.
4. Run `npm run typecheck` and `npx playwright test --list --grep "<new test ID>"`, then run the new test once against Alpha and report the real result.

## Hard rules

- No `waitForTimeout`. Use web-first assertions or wait for real events.
- No hardcoded credentials. Read them from environment variables.
- High-value tests must pass or fail, never skip. Missing data or accounts make the test fail with a message naming what to configure.
- Tests that create records are tagged `@stateful-bond` or `@stateful-login`.
- Comments are short: one line, only where the code does not explain itself. See `references/conventions.md`, "Comments".
