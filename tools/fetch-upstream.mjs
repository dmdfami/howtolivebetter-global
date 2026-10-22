// Clone or update the upstream Chinese repo into .upstream/ (full history, so
// a sync can compare the commit a translation was made from with the latest one).
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { UPSTREAM_DIR } from './lib/book.mjs';
import { UPSTREAM_REPO, resolveCommit } from './lib/upstream.mjs';

const run = (args, cwd) => execFileSync('git', args, { cwd, stdio: 'inherit' });
if (!existsSync(UPSTREAM_DIR)) run(['clone', '--quiet', '--no-checkout', UPSTREAM_REPO, UPSTREAM_DIR]);
else run(['fetch', '--quiet', 'origin', 'main'], UPSTREAM_DIR);
console.log(`upstream main = ${resolveCommit()}`);
