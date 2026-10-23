// Bring a locale up to date with upstream: reuse translations that did not
// change, renumber moved items, and ask Claude to translate new items and
// update changed ones (given the old and new Chinese text).
//
//   node tools/translate.mjs <locale> [--only 05,13] [--limit 20] [--dry-run]
//
// Backend is chosen by environment variables:
//   TRANSLATE_API_FORMAT  openai (default when TRANSLATE_API_BASE is set) | anthropic
//   TRANSLATE_API_BASE    e.g. https://router.example.com/v1  (OpenAI: POST <base>/chat/completions)
//   TRANSLATE_API_KEY     bearer token for that endpoint
//   TRANSLATE_MODEL       model name the endpoint understands
// With none of them set it uses the Anthropic API (ANTHROPIC_API_KEY).
// Items that fail validation keep their old sync hash, so the next run retries them.
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { hash, itemText, localeDir, readBookDir, readJson, serializeChapter } from './lib/book.mjs';
import { planLocale } from './lib/plan.mjs';
import { readUpstreamBook } from './lib/upstream.mjs';
import { neutralTags, withTagLine } from './lib/tags.mjs';

const args = process.argv.slice(2);
const opt = name => { const i = args.indexOf(name); return i < 0 ? null : args.splice(i, 2)[1]; };
const only = opt('--only')?.split(',');
const limit = Number(opt('--limit') ?? Infinity);
const dryRun = args.includes('--dry-run');
const loc = args.find(a => !a.startsWith('--'));
if (!loc) { console.error('usage: translate.mjs <locale> [--only NN,NN] [--limit N] [--dry-run]'); process.exit(2); }

const { TRANSLATE_API_BASE, TRANSLATE_API_KEY = '' } = process.env;
const FORMAT = process.env.TRANSLATE_API_FORMAT ?? (TRANSLATE_API_BASE ? 'openai' : 'anthropic');
const MODEL = process.env.TRANSLATE_MODEL ?? (FORMAT === 'anthropic' ? 'claude-opus-5-5' : null);
if (!MODEL) { console.error('set TRANSLATE_MODEL for the openai format'); process.exit(2); }
const CONCURRENCY = Number(process.env.TRANSLATE_CONCURRENCY ?? 6);
const dir = localeDir(loc);
const locale = readJson(resolve(dir, 'locale.json'));
const guide = readFileSync(resolve(dir, 'guide.md'), 'utf8');
const syncPath = resolve(dir, 'sync.json');
const sync = readJson(syncPath);

const plan = planLocale(loc);
const oldUp = sync.commit ? readUpstreamBook(sync.commit) : {};
const local = readBookDir(resolve(dir, 'book'));
const up = plan.upstream;

const findItem = (book, key) => {
  const [nn, n] = key.split('/');
  const ch = book[nn];
  if (!ch) return null;
  if (n === 'intro') return { intro: ch.intro, title: ch.title };
  return ch.items.find(it => String(it.n) === n) ?? null;
};
const upText = (book, key) => {
  const x = findItem(book, key);
  if (!x) return null;
  return 'intro' in x ? `# ${x.title}\n\n${x.intro}` : itemText(x);
};

const todo = plan.entries.filter(e => (e.kind === 'changed' || e.kind === 'new') && (!only || only.includes(e.key.slice(0, 2)))).slice(0, limit);
console.log(`${loc}: ${todo.length} entries to translate with ${MODEL}${dryRun ? ' (dry run)' : ''}`);

const client = dryRun || FORMAT !== 'anthropic' ? null : new Anthropic(TRANSLATE_API_BASE ? { baseURL: TRANSLATE_API_BASE, apiKey: TRANSLATE_API_KEY } : {});
const system = [{ type: 'text', text: guide, cache_control: { type: 'ephemeral' } }];

// One request → the model's text, or null when it refused.
async function complete(userText) {
  if (FORMAT === 'openai') {
    const res = await fetch(`${TRANSLATE_API_BASE.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(TRANSLATE_API_KEY && { Authorization: `Bearer ${TRANSLATE_API_KEY}` }) },
      body: JSON.stringify({ model: MODEL, temperature: 0.2, messages: [{ role: 'system', content: guide }, { role: 'user', content: userText }] }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
    const text = (await res.json()).choices?.[0]?.message?.content;
    // Some models wrap output in a code fence or a <think> block.
    return text?.replace(/<think>[\s\S]*?<\/think>/g, '').replace(/^```\w*\n|\n```$/g, '').trim() ?? null;
  }
  const res = await client.beta.messages.stream({
    model: MODEL,
    max_tokens: 32000,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'high' },
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system,
    messages: [{ role: 'user', content: userText }],
  }).finalMessage();
  if (res.stop_reason === 'refusal') return null;
  return res.content.filter(b => b.type === 'text').map(b => b.text).join('').trim();
}

function prompt(e) {
  const fresh = upText(up, e.key);
  if (e.kind === 'new') return `Translate this entry.\n\n<source>\n${fresh}\n</source>`;
  const old = upText(oldUp, e.key);
  const cur = findItem(local, e.key);
  const curText = cur && ('intro' in cur ? `${cur.intro}\nTITLE: ${cur.title}` : itemText({ ...cur, body: cur.body.replace(/^<!--.*-->\n?/m, '') }));
  if (!old || !curText) return `Translate this entry.\n\n<source>\n${fresh}\n</source>`;
  return `Update the existing translation. Change only what changed between the old and new Chinese text.\n\n<old_source>\n${old}\n</old_source>\n\n<new_source>\n${fresh}\n</new_source>\n\n<current_translation>\n${curText}\n</current_translation>`;
}

function validate(e, out) {
  const [, n] = e.key.split('/');
  if (n === 'intro') {
    const m = out.match(/\nTITLE:\s*(.+)\s*$/);
    if (!m) throw new Error('intro: missing TITLE line');
    return { intro: out.slice(0, m.index).trim(), title: m[1].trim() };
  }
  const head = out.match(/^### (\d+)\. (.+)$/m);
  if (!head || head[1] !== n) throw new Error(`heading must be "### ${n}. …"`);
  const body = out.slice(head.index + head[0].length).trim();
  const src = findItem(up, e.key);
  for (const f of src.fields) {
    const label = locale.fields[f.label];
    if (label && !body.includes(`- ${label}:`)) throw new Error(`missing field "${label}"`);
  }
  const srcSource = src.fields.find(f => f.label === '来源')?.value;
  const urls = s => [...(s ?? '').matchAll(/https?:\/\/[^\s>）)]+/g)].map(m => m[0]).sort().join(' ');
  if (urls(srcSource) !== urls(body.match(new RegExp(`- ${locale.fields['来源']}:(.*)`))?.[1])) throw new Error('source URLs changed');
  return { title: head[2].trim(), body: withTagLine(body, neutralTags(src.tags)) };
}

async function run(e) {
  let lastErr;
  for (let attempt = 0; attempt < 2; attempt++) {
    const msg = prompt(e) + (lastErr ? `\n\nYour previous answer was rejected: ${lastErr}. Fix that.` : '');
    const text = await complete(msg);
    if (text === null) { lastErr = 'refusal'; continue; }
    try { return validate(e, text); } catch (err) { lastErr = err.message; }
  }
  throw new Error(lastErr);
}

const results = new Map();
const failed = [];
if (!dryRun) {
  let next = 0, done = 0;
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, todo.length) }, async () => {
    while (next < todo.length) {
      const e = todo[next++];
      try { results.set(e.key, await run(e)); }
      catch (err) { failed.push(e.key); console.error(`  ✗ ${e.key}: ${err.message}`); }
      if (++done % 10 === 0) console.log(`  ${done}/${todo.length}`);
    }
  }));
} else {
  for (const e of todo.slice(0, 3)) console.log(`--- ${e.kind} ${e.key}\n${prompt(e)}\n`);
  process.exit(0);
}

// Assemble every chapter in upstream order.
const newSync = { commit: sync.commit, items: { ...sync.items } };
for (const [nn, upCh] of Object.entries(up)) {
  const cur = local[nn];
  const introRes = results.get(`${nn}/intro`);
  const ch = {
    path: cur?.path ?? resolve(dir, 'book', `${nn}.md`),
    backLink: locale.backLink,
    number: Number(nn),
    title: introRes?.title ?? cur?.title ?? upCh.title,
    intro: introRes?.intro ?? cur?.intro ?? '',
    items: [],
  };
  if (introRes) newSync.items[`${nn}/intro`] = plan.hashes[`${nn}/intro`];
  for (const upIt of upCh.items) {
    const key = `${nn}/${upIt.n}`;
    const e = plan.entries.find(x => x.key === key);
    const done = results.get(key);
    let it = null;
    if (done) { it = { n: upIt.n, ...done }; newSync.items[key] = plan.hashes[key]; }
    else if (e.kind === 'moved') {
      const src = findItem(local, e.src);
      it = { n: upIt.n, title: src.title, body: src.body };
      newSync.items[key] = plan.hashes[key];
    } else it = findItem(local, key) && { ...findItem(local, key) };
    if (it) ch.items.push(it); // not yet translated items are simply missing
  }
  writeFileSync(ch.path, serializeChapter(ch));
}
for (const e of plan.entries) if (e.kind === 'removed') delete newSync.items[e.key];
// Keys whose number now holds a different upstream item must not keep a stale hash.
for (const key of Object.keys(newSync.items)) if (!(key in plan.hashes)) delete newSync.items[key];
const pending = plan.entries.filter(e => (e.kind === 'changed' || e.kind === 'new') && !results.has(e.key)).length;
if (pending === 0) newSync.commit = plan.to;
writeFileSync(syncPath, JSON.stringify(newSync, null, 1) + '\n');
console.log(`${loc}: translated ${results.size}, failed ${failed.length}, still pending ${pending}${pending === 0 ? `, synced to ${plan.to.slice(0, 7)}` : ''}`);
if (failed.length) process.exitCode = 1;
