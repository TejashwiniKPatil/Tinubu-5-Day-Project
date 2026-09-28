const { spawn } = require('node:child_process') as typeof import('node:child_process');
const fs = require('node:fs') as typeof import('node:fs');
const path = require('node:path') as typeof import('node:path');

const projectRoot = path.resolve(__dirname, '..');
const cli = path.join(projectRoot, 'node_modules', 'playwright', 'cli.js');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const outputDirectory = path.join(projectRoot, 'reports', 'flaky-triage', `triage-${timestamp}`);
fs.mkdirSync(outputDirectory, { recursive: true });

type RunResult = {
  run: number;
  exitCode: number | null;
  signal: NodeJS.Signals | null;
  error?: string;
  resultDirectory: string;
};

const results: RunResult[] = [];

function runOnce(run: number): Promise<Omit<RunResult, 'run'>> {
  const logPath = path.join(outputDirectory, `run-${run}.log`);
  const runOutput = path.join(outputDirectory, `run-${run}-results`);
  const log = fs.createWriteStream(logPath, { flags: 'w' });
  const args = [
    cli,
    'test',
    '--project=chromium',
    '--grep-invert=@stateful-login|@stateful-bond',
    '--retries=1',
    `--output=${runOutput}`,
  ];

  console.log(`\n[flaky triage] Starting run ${run}/3. Output: ${path.relative(projectRoot, logPath)}`);

  return new Promise<Omit<RunResult, 'run'>>((resolve) => {
    const child = spawn(process.execPath, args, {
      cwd: projectRoot,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    for (const stream of [child.stdout, child.stderr]) {
      stream.on('data', (chunk) => {
        log.write(chunk);
        process.stdout.write(`[run ${run}] ${chunk}`);
      });
    }

    child.on('error', (error: Error) => {
      const message = `Failed to start Playwright: ${error.message}\n`;
      log.write(message);
      process.stderr.write(`[run ${run}] ${message}`);
      log.end();
      resolve({ exitCode: null, signal: null, error: error.message, resultDirectory: path.relative(projectRoot, runOutput) });
    });

    child.on('close', (code: number | null, signal: NodeJS.Signals | null) => {
      log.end();
      resolve({ exitCode: code, signal, resultDirectory: path.relative(projectRoot, runOutput) });
    });
  });
}

async function main() {
  for (let run = 1; run <= 3; run += 1) {
    const result = await runOnce(run);
    results.push({ run, ...result });
    console.log(`[flaky triage] Run ${run}/3 finished with exit code ${result.exitCode ?? 'unknown'}.`);
  }

  fs.writeFileSync(
    path.join(outputDirectory, 'summary.json'),
    JSON.stringify({
      startedAt: timestamp,
      results,
      note: 'Each run excludes stateful login and Bond Creation cases and allows one retry to capture on-first-retry traces. Review run logs and trace.zip files in Trace Viewer before classifying instability.',
    }, null, 2),
  );

  if (results.some((result) => result.exitCode !== 0)) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('[flaky triage] Runner failed:', error);
  process.exitCode = 1;
});
