// Cut the upstream Chinese book into translation chunks (<= 12 keys, never across sections).
//   node tools/x/mkchunks.mjs   -> tools/x/chunks.json + tools/x/src/<id>.md (Chinese source per chunk)
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { itemText, ROOT } from '../lib/book.mjs';
import { readUpstreamBook, resolveCommit } from '../lib/upstream.mjs';

const MAX = 12;
const commit = resolveCommit('origin/main');
const book = readUpstreamBook(commit);
const out = resolve(ROOT, 'tools/x/src');
mkdirSync(out, { recursive: true });
const strip = s => s.replace(/^<!--.*-->\n?/gm, '').trim();
const chunks = [];
for (const [nn, ch] of Object.entries(book)) {
  const keys = [{ key: `${nn}/intro`, text: `# ${ch.title}\n\n${ch.intro}` }, ...ch.items.map(it => ({ key: `${nn}/${it.n}`, text: strip(itemText(it)) }))];
  const per = Math.ceil(keys.length / Math.ceil(keys.length / MAX));
  for (let i = 0, part = 1; i < keys.length; i += per, part++) {
    const slice = keys.slice(i, i + per);
    const id = `s${nn}${keys.length > per ? String.fromCharCode(96 + part) : ''}`;
    chunks.push({ id, keys: slice.map(k => k.key) });
    writeFileSync(resolve(out, `${id}.md`), slice.map(k => `=== ${k.key}\n${k.text}\n`).join('\n'));
  }
}
writeFileSync(resolve(ROOT, 'tools/x/chunks.json'), JSON.stringify({ commit, chunks }, null, 1) + '\n');
console.log(chunks.length, 'chunks from', commit.slice(0, 7));
