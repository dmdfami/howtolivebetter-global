// Jules tasks for the multilingual book: one session per (language, chunk).
//   node tools/jules/mkx.mjs en,es,fr  > tools/jules/x-tasks.json
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT } from '../lib/book.mjs';

const langs = JSON.parse(readFileSync(resolve(ROOT, 'tools/x/langs.json'), 'utf8'));
const want = (process.argv[2] ?? Object.keys(langs).join(',')).split(',');
const { chunks } = JSON.parse(readFileSync(resolve(ROOT, 'tools/x/chunks.json'), 'utf8'));
const tasks = [];
for (const lang of want) for (const c of chunks) {
  tasks.push({
    id: `x-${lang}-${c.id}`,
    title: `${lang} ${c.id}`,
    prompt: `Translate one chunk of a Chinese book into ${langs[lang]}.\n\n1. Read locales/${lang}/guide.md (rules and exact field labels) and follow it exactly.\n2. Read tools/x/src/${c.id}.md: the Chinese source; entries are separated by lines "=== KEY".\n3. Create ONLY the file locales/${lang}/part/${c.id}.md: for each source entry in the same order, a line "=== KEY" (same KEY) followed by the translated entry exactly as the guide's "Output format" says. Translate everything, never shorten or summarise, copy URLs unchanged.\n4. Run \`node tools/partcheck.mjs ${lang} ${c.id}\`; if it prints problems, fix the file and run it again until it prints OK. No npm install is needed.\n5. Open one pull request titled "tr ${lang} ${c.id}" that contains only that file.\nEdit no other file.`,
    allow: [`locales/${lang}/part/${c.id}.md`],
  });
}
console.log(JSON.stringify(tasks, null, 1));
