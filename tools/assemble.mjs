// Turn locales/<lang>/part/*.md into locales/<lang>/book/NN-*.md and update sync.json.
//   node tools/assemble.mjs <lang> [--keep]     (parts are deleted after a successful assemble unless --keep)
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT, hashBook, localeDir, readBookDir, readJson, serializeChapter } from './lib/book.mjs';
import { readUpstreamBook } from './lib/upstream.mjs';
import { neutralTags, withTagLine } from './lib/tags.mjs';
import { execFileSync } from 'node:child_process';

const lang = process.argv[2];
const keep = process.argv.includes('--keep');
const dir = localeDir(lang);
const locale = readJson(resolve(dir, 'locale.json'));
const { commit, chunks } = readJson(resolve(ROOT, 'tools/x/chunks.json'));
const up = readUpstreamBook(commit);
const hashes = hashBook(up);
const syncPath = resolve(dir, 'sync.json');
const sync = existsSync(syncPath) ? readJson(syncPath) : { commit: null, items: {} };
const book = existsSync(resolve(dir, 'book')) ? readBookDir(resolve(dir, 'book')) : {};
mkdirSync(resolve(dir, 'book'), { recursive: true });

const split = text => {
  const out = new Map(); let key = null;
  for (const line of text.replace(/\r\n/g, '\n').split('\n')) {
    const m = line.match(/^=== (\S+)\s*$/);
    if (m) { key = m[1]; out.set(key, []); } else if (key) out.get(key).push(line);
  }
  return new Map([...out].map(([k, v]) => [k, v.join('\n').trim()]));
};
const done = [];
for (const c of chunks) {
  const f = resolve(dir, 'part', `${c.id}.md`);
  if (!existsSync(f)) continue;
  try { execFileSync('node', [resolve(ROOT, 'tools/partcheck.mjs'), lang, c.id], { stdio: 'pipe' }); }
  catch (e) { console.log(`skip ${c.id}: ${String(e.stdout).trim().split('\n')[0]}`); continue; }
  const parts = split(readFileSync(f, 'utf8'));
  for (const [key, text] of parts) {
    const [nn, n] = key.split('/');
    const ch = book[nn] ??= { path: resolve(dir, 'book', `${nn}-section.md`), backLink: locale.backLink, number: Number(nn), title: up[nn].title, intro: '', items: [] };
    if (n === 'intro') {
      const m = text.match(/\nTITLE:\s*(.+)\s*$/);
      ch.intro = text.slice(0, m.index).trim(); ch.title = m[1].trim();
    } else {
      const head = text.match(/^### (\d+)\. (.+)$/m);
      const body = text.slice(head.index + head[0].length).trim();
      const src = up[nn].items.find(i => String(i.n) === n);
      const item = { n: Number(n), title: head[2].trim(), body: withTagLine(body, neutralTags(src.tags)) };
      const at = ch.items.findIndex(i => i.n === item.n);
      if (at >= 0) ch.items[at] = item; else ch.items.push(item);
    }
    sync.items[key] = hashes[key];
  }
  done.push(c.id);
  if (!keep) rmSync(f);
}
for (const ch of Object.values(book)) { ch.items.sort((a, b) => a.n - b.n); writeFileSync(ch.path, serializeChapter(ch)); }
if (Object.keys(hashes).every(k => sync.items[k] === hashes[k])) sync.commit = commit;
writeFileSync(syncPath, JSON.stringify(sync, null, 1) + '\n');
console.log(`${lang}: assembled ${done.length} chunks, ${Object.keys(sync.items).length}/${Object.keys(hashes).length} keys${sync.commit ? ', synced' : ''}`);
