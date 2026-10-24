// Validate a translated chunk.
//   node tools/partcheck.mjs <lang> <chunk-id>      (reads locales/<lang>/part/<id>.md)
// Prints OK or the list of problems; exit code 1 on problems.
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT, readJson } from './lib/book.mjs';

const [lang, id] = process.argv.slice(2);
if (!lang || !id) { console.error('usage: partcheck.mjs <lang> <chunk-id>'); process.exit(2); }
const locale = readJson(resolve(ROOT, 'locales', lang, 'locale.json'));
const { chunks } = readJson(resolve(ROOT, 'tools/x/chunks.json'));
const chunk = chunks.find(c => c.id === id);
if (!chunk) { console.error('unknown chunk', id); process.exit(2); }
const split = text => {
  const out = new Map(); let key = null;
  for (const line of text.replace(/\r\n/g, '\n').split('\n')) {
    const m = line.match(/^=== (\S+)\s*$/);
    if (m) { key = m[1]; out.set(key, []); } else if (key) out.get(key).push(line);
  }
  return new Map([...out].map(([k, v]) => [k, v.join('\n').trim()]));
};
const urls = s => [...(s ?? '').matchAll(/https?:\/\/[^\s>）)\]]+/g)].map(m => m[0]).sort().join(' ');
const cjk = s => (s.match(/[㐀-鿿]/g) ?? []).length;
const CJK_LANG = ['ja', 'zh-Hant'].includes(lang);
const problems = [];
const file = resolve(ROOT, 'locales', lang, 'part', `${id}.md`);
if (!existsSync(file)) { console.log(`missing ${file}`); process.exit(1); }
const src = split(readFileSync(resolve(ROOT, 'tools/x/src', `${id}.md`), 'utf8'));
const out = split(readFileSync(file, 'utf8'));
if ([...out.keys()].join() !== chunk.keys.join()) problems.push(`keys must be exactly, in order: ${chunk.keys.join(' ')} (got ${[...out.keys()].join(' ')})`);
for (const key of chunk.keys) {
  const s = src.get(key) ?? '', t = out.get(key);
  if (t === undefined) continue;
  const n = key.split('/')[1];
  if (n === 'intro') {
    if (!/\nTITLE:\s*\S.*$/.test(t)) problems.push(`${key}: last line must be "TITLE: <translated section title>"`);
  } else {
    const head = t.match(/^### (\d+)\. (.+)$/m);
    if (!head || head[1] !== n) problems.push(`${key}: first line must be "### ${n}. <title>"`);
    const srcFields = [...s.matchAll(/^- ([^：:]{1,30})[：:]/gm)].map(m => m[1].trim());
    for (const f of srcFields) {
      const label = locale.fields[f];
      if (label && !t.includes(`- ${label}:`)) problems.push(`${key}: missing field line "- ${label}: …"`);
    }
    const srcSrc = s.match(/^- 来源[：:](.*(?:\n(?!- ).*)*)/m)?.[1];
    const tSrc = t.match(new RegExp(`^- ${locale.fields['来源']}:(.*(?:\\n(?!- ).*)*)`, 'm'))?.[1];
    if (urls(srcSrc) !== urls(tSrc)) problems.push(`${key}: every URL in the source line must be copied unchanged`);
  }
  if (t.length < s.length * 0.7) problems.push(`${key}: too short (${t.length} chars for ${s.length} Chinese chars), translate everything`);
  if (!CJK_LANG) {
    const body = t.split('\n').filter(l => !l.startsWith(`- ${locale.fields['来源']}:`)).join('\n');
    if (cjk(body) > 6) problems.push(`${key}: Chinese characters left in the translation (${cjk(body)}); translate or transliterate them`);
  }
}
if (problems.length) { console.log(problems.join('\n')); process.exit(1); }
console.log('OK');
