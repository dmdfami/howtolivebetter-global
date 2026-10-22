// Rewrite the tag comment of every item in a locale from the upstream book at
// the locale's synced commit (or a given commit).
//   node tools/retag.mjs <locale> [commit]
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { localeDir, readBookDir, readJson, serializeChapter } from './lib/book.mjs';
import { readUpstreamBook } from './lib/upstream.mjs';
import { neutralTags, withTagLine } from './lib/tags.mjs';

const [loc, ref] = process.argv.slice(2);
const commit = ref ?? readJson(resolve(localeDir(loc), 'sync.json')).commit;
const up = readUpstreamBook(commit);
let n = 0;
for (const [nn, ch] of Object.entries(readBookDir(resolve(localeDir(loc), 'book')))) {
  for (const it of ch.items) {
    const src = up[nn]?.items.find(u => u.n === it.n);
    if (!src) continue;
    it.body = withTagLine(it.body, neutralTags(src.tags));
    n++;
  }
  writeFileSync(ch.path, serializeChapter(ch));
}
console.log(`${loc}: retagged ${n} items from ${commit.slice(0, 7)}`);
