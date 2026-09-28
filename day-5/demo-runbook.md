# Day 5: 20-Minute Demo Runbook

## Before the demo

- Use Alpha QA and an approved resettable account. Never show `.env`, `playwright/.auth/`, or unredacted request payloads.
- Confirm the QA window and test-data reset plan. Do not run performance checks without the owner's coordinated window.
- Open the current CI run and artifact, or state clearly that no CI run is recorded.
- Keep the Day 1 exit criteria and [Test Summary Report](test-summary-report.md) visible.

## Agenda

### 0 to 2 minutes

Explain scope: Login and Bond Creation. Distinguish observed evidence from assumptions.

### 2 to 5 minutes

Show the Playwright structure: `src/` support code, spec-only `tests/`, storage state, Page Objects, data-driven Login, tags, and trace configuration.

### 5 to 8 minutes

Run `npm run test:smoke` live in the approved QA window. Show the actual summary. Do not present triage output as a smoke pass.

### 8 to 10 minutes

Open the latest GitHub Actions run and HTML report artifact, if one exists. Otherwise show the workflow configuration and state that pipeline execution is unverified.

### 10 to 13 minutes

Open `.claude/skills/test-case-designer/SKILL.md`. Explain its YAML frontmatter and trigger description, then follow its reference link to `references/bva-ep-rules.md` to show progressive disclosure.

### 13 to 16 minutes

Show one screenshot-backed defect and the gray-box evidence. Separate the observed HTTP 400 from the unknown request and response contract.

### 16 to 18 minutes

Review the performance-window gate, security checklist, and usability and accessibility gaps.

### 18 to 20 minutes

Defend **NO-GO** against the Day 1 exit criteria and list the evidence needed to change the verdict.

Do not claim a live smoke pass, CI pass, k6 result, security pass, or axe/Lighthouse pass unless the corresponding dated evidence is available.
