// Generate one MP3 per item through any OpenAI-compatible speech endpoint
// (e.g. the gemini-live-tts gateway: POST <TTS_BASE_URL>/audio/speech), skip
// items whose spoken text did not change, and record them in audio.json.
//
//   TTS_BASE_URL=http://127.0.0.1:8005/v1 TTS_API_KEY=… TTS_VOICE=podcast-nu \
//   AUDIO_BASE=https://audio.example.com \
//   node tools/audio.mjs <locale> [--only 01,02] [--limit 20] [--upload]
//
// Files go to audio-out/<locale>/<NN>/<N>.mp3. With --upload (and R2_BUCKET
// set) each new file is pushed with `wrangler r2 object put`.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT, hash, localeDir, readBookDir, readJson } from './lib/book.mjs';

const args = process.argv.slice(2);
const opt = name => { const i = args.indexOf(name); return i < 0 ? null : args.splice(i, 2)[1]; };
const only = opt('--only')?.split(',');
const limit = Number(opt('--limit') ?? Infinity);
const upload = args.includes('--upload');
const loc = args.find(a => !a.startsWith('--'));
if (!loc) { console.error('usage: audio.mjs <locale> [--only NN,NN] [--limit N] [--upload]'); process.exit(2); }

const { TTS_BASE_URL, TTS_API_KEY = '', TTS_VOICE = 'Aoede', TTS_MODEL = 'tts', TTS_INSTRUCTIONS, AUDIO_BASE, R2_BUCKET } = process.env;
if (!TTS_BASE_URL || !AUDIO_BASE) { console.error('set TTS_BASE_URL and AUDIO_BASE'); process.exit(2); }

const L = readJson(resolve(localeDir(loc), 'locale.json'));
const manifestPath = resolve(localeDir(loc), 'audio.json');
const manifest = existsSync(manifestPath) ? readJson(manifestPath) : {};
const book = readBookDir(resolve(localeDir(loc), 'book'));

const speakable = s => s
  .replace(/<[^>]+>/g, '')
  .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/https?:\/\/\S+/g, '')
  .replace(/[*_`#]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

// What a listener hears: title, the plain-language line, then cost, benefit and note.
function script(it) {
  const f = Object.fromEntries(it.fields.map(x => [x.label, x.value]));
  const F = L.fields;
  const parts = [`${L.ui.item} ${it.n}. ${it.title}.`, f[F['说人话']]];
  for (const k of ['成本', '收益', '备注']) if (f[F[k]]) parts.push(`${F[k]}. ${f[F[k]]}`);
  return speakable(parts.filter(Boolean).join('\n'));
}

const todo = [];
for (const [nn, ch] of Object.entries(book).sort(([a], [b]) => a.localeCompare(b))) {
  if (only && !only.includes(nn)) continue;
  for (const it of ch.items) {
    const text = script(it);
    const h = hash(text);
    if (manifest[`${nn}/${it.n}`]?.hash !== h) todo.push({ nn, it, text, h });
  }
}
const batch = todo.slice(0, limit);
console.log(`${loc}: ${todo.length} items need audio, generating ${batch.length}`);

for (const { nn, it, text, h } of batch) {
  const res = await fetch(`${TTS_BASE_URL.replace(/\/$/, '')}/audio/speech`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(TTS_API_KEY && { Authorization: `Bearer ${TTS_API_KEY}` }) },
    body: JSON.stringify({ model: TTS_MODEL, voice: TTS_VOICE, input: text, response_format: 'mp3', ...(TTS_INSTRUCTIONS && { instructions: TTS_INSTRUCTIONS }) }),
  });
  if (!res.ok) { console.error(`  ✗ ${nn}/${it.n}: HTTP ${res.status} ${await res.text()}`); process.exitCode = 1; continue; }
  const rel = `${loc}/${nn}/${it.n}.mp3`;
  const out = resolve(ROOT, 'audio-out', rel);
  mkdirSync(resolve(out, '..'), { recursive: true });
  writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  if (upload) {
    if (!R2_BUCKET) throw new Error('--upload needs R2_BUCKET');
    execFileSync('npx', ['wrangler', 'r2', 'object', 'put', `${R2_BUCKET}/${rel}`, '--file', out, '--content-type', 'audio/mpeg', '--remote'], { stdio: 'inherit' });
  }
  manifest[`${nn}/${it.n}`] = { hash: h, url: `${AUDIO_BASE.replace(/\/$/, '')}/${rel}?v=${h}` };
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 1) + '\n');
  console.log(`  ✓ ${rel}`);
}
