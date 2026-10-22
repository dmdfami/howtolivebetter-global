// One-off: record which upstream commit an existing locale translation
// matches, by hashing the upstream book at that commit.
//   node tools/seed-sync.mjs <locale> <upstream-commit>
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { hashBook, localeDir, readBookDir } from './lib/book.mjs';
import { readUpstreamBook, resolveCommit } from './lib/upstream.mjs';

const [loc, ref] = process.argv.slice(2);
if (!loc || !ref) { console.error('usage: seed-sync.mjs <locale> <upstream-commit>'); process.exit(2); }
const commit = resolveCommit(ref);
const up = hashBook(readUpstreamBook(commit));
const local = readBookDir(resolve(localeDir(loc), 'book'));
const items = {};
for (const key of Object.keys(up)) {
  const [nn, n] = key.split('/');
  const ch = local[nn];
  const present = ch && (n === 'intro' || ch.items.some(it => String(it.n) === n));
  if (present) items[key] = up[key];
}
writeFileSync(resolve(localeDir(loc), 'sync.json'), JSON.stringify({ commit, items }, null, 1) + '\n');
console.log(`${loc}: ${Object.keys(items).length}/${Object.keys(up).length} entries recorded at ${commit.slice(0, 7)}`);
