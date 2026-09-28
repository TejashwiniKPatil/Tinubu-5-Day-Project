// Runs a k6 script with the variables from .env, the same values Playwright uses.
// Usage: npm run perf:login   or   npm run perf:login-list
// k6 must be on PATH, or set K6_PATH to the full path of k6.exe.
const { spawnSync } = require('node:child_process') as typeof import('node:child_process');

const script = process.argv[2];
if (!script) {
  console.error('Pass the k6 script path, for example: day-5/performance/login-5-vus.ts');
  process.exit(1);
}

const k6 = process.env.K6_PATH || 'k6';
const result = spawnSync(k6, ['run', script], { stdio: 'inherit', env: process.env });

if (result.error) {
  console.error(`Could not start k6 (${result.error.message}). Install k6 or set K6_PATH to the full path of k6.exe.`);
  process.exit(1);
}
process.exit(result.status ?? 1);
