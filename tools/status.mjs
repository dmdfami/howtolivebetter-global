// Show how far each locale is behind upstream.
//   node tools/status.mjs [locale] [--list]
import { locales } from './lib/book.mjs';
import { planLocale } from './lib/plan.mjs';

const args = process.argv.slice(2);
const list = args.includes('--list');
const only = args.find(a => !a.startsWith('--'));
for (const loc of only ? [only] : locales()) {
  const p = planLocale(loc);
  const count = {};
  for (const e of p.entries) count[e.kind] = (count[e.kind] ?? 0) + 1;
  console.log(`${loc}: synced ${p.from?.slice(0, 7) ?? '-'} → upstream ${p.to.slice(0, 7)}  ` +
    Object.entries(count).map(([k, v]) => `${k}=${v}`).join(' '));
  if (list) for (const e of p.entries) if (e.kind !== 'same') console.log(`  ${e.kind.padEnd(8)} ${e.key}${e.src ? ` ← ${e.src}` : ''}`);
}
