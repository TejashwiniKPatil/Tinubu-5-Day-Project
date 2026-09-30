// PreToolUse guard: blocks git changes, package removal or installs, and other unsafe commands or file edits.
const { readFileSync } = require('node:fs') as typeof import('node:fs');

type ToolInput = {
  command?: string;
  file_path?: string;
  notebook_path?: string;
  new_string?: string;
  content?: string;
};
type HookInput = { tool_name?: string; tool_input?: ToolInput };
type ShellRule = { test: (command: string) => boolean; reason: string };

const input = JSON.parse(readFileSync(0, 'utf8') || '{}') as HookInput;
const tool = input.tool_name ?? '';
const toolInput = input.tool_input ?? {};

// Read-only git subcommands; every other git subcommand changes the repo, which the user does by hand.
const readOnlyGit = new Set(['status', 'diff', 'log', 'show', 'blame', 'ls-files', 'rev-parse', 'grep', 'shortlog', 'describe', 'help', 'version', '--version']);
// npx tools the project already uses; anything else would download and run a third-party package.
const allowedNpx = new Set(['playwright', 'tsc']);

const shellRules: ShellRule[] = [
  { test: (c) => /\bgit\s+config\b/.test(c), reason: 'Changing git config is not allowed.' },
  { test: (c) => /--no-verify\b|--no-gpg-sign\b/.test(c), reason: 'Skipping git hooks or signing is not allowed.' },
  { test: (c) => /\b(npm|pnpm|yarn|bun)\s+(uninstall|remove|rm|un|unlink|prune|dedupe)\b/.test(c), reason: 'Removing packages is not allowed. Ask the user to do it.' },
  { test: (c) => /\b(npm|pnpm|bun)\s+(install|i|add|isntall|in)\b(\s+-\S+)*\s+[^-\s;&|]/.test(c) || /\b(yarn|pnpm|bun)\s+add\b/.test(c), reason: 'Installing new third-party packages is not allowed. Only "npm install" or "npm ci" from the lockfile is allowed; ask the user to add a dependency.' },
  { test: (c) => /\b(npm|pnpm|yarn)\s+(update|upgrade|up|audit\s+fix)\b/.test(c), reason: 'Updating packages changes the dependency tree; ask the user first.' },
  { test: (c) => /\bnpm\s+(publish|link|config\s+set)\b/.test(c), reason: 'Publishing, linking, or changing npm config is not allowed.' },
  { test: (c) => /(strict-ssl\s+false|NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*['"]?0|ignoreHTTPSErrors|--insecure\b|SkipCertificateCheck|ServerCertificateValidationCallback)/i.test(c), reason: 'Disabling SSL or certificate checks is not allowed.' },
  { test: (c) => /(curl|wget|iwr|irm|Invoke-WebRequest|Invoke-RestMethod)\b[^|]*\|\s*(sh|bash|zsh|iex|Invoke-Expression|node|python)\b/i.test(c), reason: 'Piping a download into a shell is not allowed.' },
  { test: (c) => /\b(iex|Invoke-Expression)\b/i.test(c), reason: 'Invoke-Expression is not allowed.' },
  { test: (c) => /\brm\s+-[a-z]*r[a-z]*f?[a-z]*\s+(\/|~|\*|\.|\.\.|\.git|node_modules|src|tests|test-data|day-\d)\/?(\s|$)/i.test(c), reason: 'Recursive delete of a root, home, or project folder is not allowed.' },
  { test: (c) => /Remove-Item\b[^;|]*-Recurse[^;|]*\s(['"]?)(\\|\/|~|\*|\.|\.\.|\.git|node_modules|src|tests|test-data|day-\d|C:\\)\1(\s|$)/i.test(c), reason: 'Recursive delete of a root, home, or project folder is not allowed.' },
  { test: (c) => /(^|[;&|]\s*)(format\s+[a-z]:|diskpart|mkfs|shutdown|Stop-Computer|Restart-Computer)\b/i.test(c), reason: 'System-level destructive commands are not allowed.' },
  { test: (c) => /\b(cat|type|Get-Content|gc|echo)\b[^|;]*\.env\b(?!\.example)/i.test(c), reason: 'Printing .env would expose credentials.' },
];

function gitViolation(command: string): string | undefined {
  for (const match of command.matchAll(/\bgit(?:\s+-C\s+\S+|\s+-c\s+\S+)*\s+([a-z-]+)/gi)) {
    const sub = match[1].toLowerCase();
    if (sub === 'branch' || sub === 'stash' || sub === 'tag' || sub === 'remote') {
      // Plain listing is fine; any argument after these creates, deletes, or changes something.
      const rest = command.slice(match.index + match[0].length).split(/[;&|]/)[0].trim();
      if (sub === 'stash' && !/^(list|show)(\s|$)/.test(rest)) return 'git stash changes the working tree. The user does all git work.';
      if (!rest || /^(-l|--list|-a|--all|-v|-vv|-r|--show-current|list|show|-n|--format\S*)(\s|$)/.test(rest)) continue;
      return `git ${sub} with arguments changes the repository. The user does all git work.`;
    }
    if (!readOnlyGit.has(sub)) return `git ${sub} changes the repository or talks to the remote. The user does all git work (commit, push, branch, reset, etc.).`;
  }
  return undefined;
}

function npxViolation(command: string): string | undefined {
  for (const match of command.matchAll(/\b(npx|pnpx|bunx|npm\s+exec|pnpm\s+dlx|yarn\s+dlx)\s+((?:-\S+\s+)*)(\S+)/gi)) {
    const pkg = match[3].replace(/@[^/]*$/, '');
    if (!allowedNpx.has(pkg)) return `"${match[1]} ${match[3]}" would download or run a third-party package. Allowed: ${[...allowedNpx].join(', ')}.`;
  }
  return undefined;
}

function checkShell(command: string): string | undefined {
  return gitViolation(command) ?? npxViolation(command) ?? shellRules.find((rule) => rule.test(command))?.reason;
}

function checkFile(filePath: string): string | undefined {
  const p = filePath.replace(/\\/g, '/');
  if (/(^|\/)\.env$/.test(p)) return 'Editing .env is not allowed; it holds credentials. Ask the user to change it.';
  if (/(^|\/)playwright\/\.auth\//.test(p)) return 'Saved login state is generated by global setup; do not edit it.';
  if (/(^|\/)package-lock\.json$/.test(p)) return 'package-lock.json must only change through npm, run by the user.';
  if (/(^|\/)\.git\//.test(p)) return 'Editing files inside .git is not allowed.';
  return undefined;
}

function checkPackageJson(filePath: string, text: string): string | undefined {
  if (!/(^|[\\/])package\.json$/.test(filePath)) return undefined;
  return /"(dependencies|devDependencies|peerDependencies|optionalDependencies)"|"[@\w./-]+"\s*:\s*"[\^~]?\d/.test(text)
    ? 'Changing dependencies in package.json is not allowed. Ask the user to add or remove packages.'
    : undefined;
}

let reason: string | undefined;
if (tool === 'Bash' || tool === 'PowerShell') {
  reason = checkShell(String(toolInput.command ?? ''));
} else if (tool === 'Edit' || tool === 'Write' || tool === 'NotebookEdit') {
  const filePath = String(toolInput.file_path ?? toolInput.notebook_path ?? '');
  const text = String(toolInput.new_string ?? toolInput.content ?? '');
  reason = checkFile(filePath) ?? checkPackageJson(filePath, text);
}

if (reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: `Blocked by project guard: ${reason}`,
    },
  }));
}
process.exit(0);
