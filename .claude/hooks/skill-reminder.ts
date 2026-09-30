// UserPromptSubmit hook: tells Claude which project skill to load when the prompt matches its topic.
const { readFileSync } = require('node:fs') as typeof import('node:fs');

type HookInput = { prompt?: string };
type SkillRule = { skill: string; when: RegExp; use: string };

const input = JSON.parse(readFileSync(0, 'utf8') || '{}') as HookInput;
const prompt = input.prompt ?? '';

const rules: SkillRule[] = [
  {
    skill: 'playwright-pom',
    when: /\b(spec|specs|playwright|page ?objects?|pom|locators?|fixtures?|helpers?|automat\w*|flaky|tags?|hybrid|grey[- ]?box|gray[- ]?box|api tests?|ui tests?)\b|\.spec\.ts|src\/pages|tests\//i,
    use: 'writing or reviewing Page Objects, specs, fixtures, helpers, locators, or test tags',
  },
  {
    skill: 'test-case-designer',
    when: /\b(test ?cases?|tc-\d+|scenarios?|boundary|bva|equivalence|decision table|state transition|error guess\w*|workbook|test-cases\.xlsx|usability cases?|security cases?|performance cases?)\b/i,
    use: 'creating or reviewing test cases, test design techniques, numbering, or workbook rows',
  },
  {
    skill: 'bug-report',
    when: /\b(bugs?|defects?|def-\d+|severity|priority|triage|retest|reopen\w*|issue report)\b/i,
    use: 'writing, triaging, retesting, or updating a DEF-### defect report',
  },
];

const matched = rules.filter((rule) => rule.when.test(prompt));

if (matched.length > 0) {
  const lines = matched.map((rule) => `- ${rule.skill}: ${rule.use}`);
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext: `Project skills that apply to this request. Load each with the Skill tool before starting the work:\n${lines.join('\n')}`,
    },
  }));
}
process.exit(0);
