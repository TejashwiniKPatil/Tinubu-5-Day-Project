# Tinubu Surety QA Project

## Project Overview
This repository contains QA documentation and Playwright
automation for the Tinubu Surety application.

## Application
Application: Tinubu Surety
Test URL: https://alphanewui.tinubusurety.com
Primary features owned end-to-end:
1. Login
2. Application/Bond Creation


## Technology Stack
- Playwright
- TypeScript
- Node.js
- Git
- Markdown
- Excel for test documentation

## Project Structure
- CLAUDE.md - Project instructions and coding guidelines
- day-1/ through day-5/ - Assignment plans, test design, execution notes, defects, white-box, and non-functional work
- src/ - Shared automation source code
- src/api/ - API client classes used by API specs
- src/helpers/ - Reusable workflows composed from Page Objects
- src/utils/ - Small environment and data utilities
- src/pages/ - Page Object Models and their locators
- src/fixtures/ - Shared fixtures and data-driven Login case data
- src/global-setup.ts - Authentication state generation
- tests/ - Playwright spec files only, grouped by feature
- tests/ui/ - Browser (UI) specs
- tests/ui/bond-creation/ - Bond Creation specs, including sanity
- tests/ui/login/ - Login, lockout, and profile menu specs
- tests/ui/logout/ - Logout spec; must sort last because it ends the shared session
- tests/api/ - API specs
- tests/hybrid/ - Specs that combine UI and API steps
- File naming: kebab-case for specs, docs, and screenshots; PascalCase for Page Object and API class files
- test-data/ - Test data
- screenshots/ - Test evidence
- screenshots/Errors/ - Automatic full-page screenshots of failed UI and hybrid tests
- reports/flaky-triage/ - Generated logs and summaries (created when the triage script runs)
- .claude/commands/ - Claude Code slash commands
- .env - Local environment configuration; never commit



## Test Account Handling
Test credentials must be provided through secure environment
variables or approved secret management.

Configure `URL`, `TEST_USERNAME`, and `TEST_PASSWORD` in a local `.env` file or approved secret store. Global setup logs in once and writes ignored browser state under `playwright/.auth/`; authenticated specs load it, and Login specs use empty storage state. The lockout suite requires a separate, resettable account configured with `LOCKOUT_TEST_USERNAME` and `LOCKOUT_TEST_PASSWORD`; without those variables the lockout tests fail with a message saying what to configure.

High-value tests must pass or fail, never skip. When a test needs data or an account that is not configured, it fails with a clear message instead of skipping.

Never place real credentials directly in source code,
documentation, Git commits, or screenshots.

Load credentials from environment variables or approved secret management. Do not
print, log, expose, or include credential values in test output or evidence.


## Playwright Coding Standards
- Use TypeScript.
- Use Playwright Test.
- Prefer getByRole(), getByLabel(), getByText() and other
  user-facing locators where appropriate.
- Use Page Object Model for reusable page interactions.
- Use async/await consistently.
- Use meaningful test names.
- Keep tests independent.
- Keep smoke and regression tests organized.
- Add assertions for important expected outcomes.
- Use screenshots/traces when useful for debugging.
- Keep specs independent and make test data explicit and disposable.
- Record observed behavior separately from assumptions or unverified requirements.


## Synchronization
Use Playwright's built-in auto-waiting and assertions.
Do not use arbitrary fixed delays.


## Never Do This
- Never hardcode usernames or passwords; use environment variables or approved secret management.
- Never commit secrets.
- Never use waitForTimeout().
- Never disable SSL/security checks just to make tests pass.
- Never use brittle selectors when a stable user-facing locator exists.
- Never modify application code to make a test pass.
- Never mark a failed test as passed without evidence.
- Never delete a failing test just because it is inconvenient.
- Never invent test results.
- Never claim a defect without reproducible evidence.


## Test Execution
Before considering automation complete:
1. Run the relevant test.
2. Review the result.
3. Fix genuine test issues.
4. Re-run the test.
5. Record failures as defects when appropriate.
