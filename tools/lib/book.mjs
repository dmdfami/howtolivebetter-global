// Parse and serialize chapter files (book/NN-*.md). The upstream Chinese book
// and every locale share one layout:
//
//   [back link]
//   # N. Section title
//   intro paragraphs …
//   ### 1. Item title
//   <!-- cost tags -->
//   - Field: …
//
// An item is keyed by its section number and item number ("05/12"). Each
// locale records the hash of the upstream text it was translated from, so a
// sync only has to look at items whose upstream hash changed.
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const UPSTREAM_DIR = resolve(ROOT, '.upstream');

export const readText = p => readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
export const readJson = p => JSON.parse(readFileSync(p, 'utf8'));

export const hash = s => createHash('sha256').update(s.trim().replace(/[ \t]+\n/g, '\n')).digest('hex').slice(0, 16);

const ITEM_RE = /^### (\d+)\. (.*)$/;
const TITLE_RE = /^# (\d+)\. (.*)$/;

export function parseChapter(text) {
  const lines = text.split('\n');
  const ch = { backLink: '', number: 0, title: '', intro: '', items: [] };
  let i = 0;
  if (lines[0]?.startsWith('[')) { ch.backLink = lines[0]; i = 1; }
  for (; i < lines.length; i++) {
    const m = lines[i].match(TITLE_RE);
    if (m) { ch.number = Number(m[1]); ch.title = m[2]; i++; break; }
  }
  const intro = [];
  for (; i < lines.length && !ITEM_RE.test(lines[i]); i++) intro.push(lines[i]);
  ch.intro = intro.join('\n').trim();
  let cur = null;
  for (; i < lines.length; i++) {
    const m = lines[i].match(ITEM_RE);
    if (m) { cur = { n: Number(m[1]), title: m[2], body: [] }; ch.items.push(cur); continue; }
    cur.body.push(lines[i]);
  }
  for (const it of ch.items) {
    it.body = it.body.join('\n').trim();
    it.tags = parseTags(it.body);
    it.fields = parseFields(it.body);
  }
  return ch;
}

export function itemText(it) {
  return `### ${it.n}. ${it.title}\n${it.body}`;
}

export function serializeChapter(ch) {
  const parts = [];
  if (ch.backLink) parts.push(ch.backLink, '');
  parts.push(`# ${ch.number}. ${ch.title}`, '', ch.intro, '');
  for (const it of ch.items) parts.push(itemText(it), '');
  return parts.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

// "<!-- 成本标签: 钱=0 时间=少 … -->" or the Vietnamese "<!-- nhan-chi-phi: tien=0 … -->"
function parseTags(body) {
  const m = body.match(/<!--\s*[^:]+:\s*([^>]*?)\s*-->/);
  if (!m) return {};
  return Object.fromEntries(m[1].split(/\s+/).map(kv => kv.split('=')).filter(p => p.length === 2));
}

// "- Label: value" lines. Label is everything before the first full-width or
// ASCII colon; values may wrap onto following lines.
function parseFields(body) {
  const fields = [];
  for (const line of body.split('\n')) {
    const m = line.match(/^- ([^：:]{1,30})[：:]\s*(.*)$/);
    if (m) fields.push({ label: m[1].trim(), value: m[2] });
    else if (fields.length && line.trim() && !line.startsWith('<!--')) fields.at(-1).value += '\n' + line;
  }
  return fields;
}

// Map of "NN" -> file path for a book/ directory.
export function chapterFiles(dir) {
  if (!existsSync(dir)) return {};
  return Object.fromEntries(readdirSync(dir).filter(f => /^\d\d-.*\.md$/.test(f)).sort().map(f => [f.slice(0, 2), resolve(dir, f)]));
}

export function readBookDir(dir) {
  const out = {};
  for (const [nn, path] of Object.entries(chapterFiles(dir))) out[nn] = { path, ...parseChapter(readText(path)) };
  return out;
}

// Hashes of every intro and item in a parsed book, keyed "NN/intro" and "NN/M".
export function hashBook(book) {
  const h = {};
  for (const [nn, ch] of Object.entries(book)) {
    h[`${nn}/intro`] = hash(`# ${ch.title}\n${ch.intro}`);
    for (const it of ch.items) h[`${nn}/${it.n}`] = hash(itemText(it));
  }
  return h;
}

export function locales() {
  const dir = resolve(ROOT, 'locales');
  return readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name).sort();
}

export const localeDir = loc => resolve(ROOT, 'locales', loc);
