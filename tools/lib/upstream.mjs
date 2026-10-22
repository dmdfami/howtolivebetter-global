// Read the upstream Chinese book from the local clone in .upstream/ at any commit.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { UPSTREAM_DIR, parseChapter } from './book.mjs';

export const UPSTREAM_REPO = 'https://github.com/eternity4719/HowToLiveBetter';

const git = (...args) => execFileSync('git', ['-c', 'core.quotepath=false', ...args], { cwd: UPSTREAM_DIR, encoding: 'utf8', maxBuffer: 1 << 28 });

export function ensureUpstream() {
  if (!existsSync(UPSTREAM_DIR)) throw new Error('.upstream/ missing: run `npm run upstream` first');
}

export function resolveCommit(ref = 'origin/main') {
  ensureUpstream();
  return git('rev-parse', ref).trim();
}

// { "NN": parsed chapter } for book/NN-*.md at the given commit
export function readUpstreamBook(commit) {
  ensureUpstream();
  const files = git('ls-tree', '--name-only', commit, 'book/').split('\n').filter(f => /^book\/\d\d-.*\.md$/.test(f));
  const book = {};
  for (const f of files) {
    const nn = f.slice(5, 7);
    book[nn] = { file: f, ...parseChapter(git('show', `${commit}:${f}`).replace(/\r\n/g, '\n')) };
  }
  return book;
}

export function commitDate(commit) {
  return git('show', '-s', '--format=%cI', commit).trim();
}
