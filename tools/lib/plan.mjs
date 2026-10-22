// Work out what a locale needs to catch up with upstream.
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { hashBook, localeDir, readJson } from './book.mjs';
import { readUpstreamBook, resolveCommit } from './upstream.mjs';

// Returns { from, to, upstream, entries: [{ key, kind, src? }] }
// kind: same | moved (reuse translation of `src`) | changed | new | removed
export function planLocale(loc, toRef = 'origin/main') {
  const syncPath = resolve(localeDir(loc), 'sync.json');
  const sync = existsSync(syncPath) ? readJson(syncPath) : { commit: null, items: {} };
  const to = resolveCommit(toRef);
  const upstream = readUpstreamBook(to);
  const up = hashBook(upstream);
  const byHash = new Map();
  for (const [k, h] of Object.entries(sync.items)) if (!k.endsWith('/intro')) byHash.set(h, k);
  const entries = [];
  for (const [key, h] of Object.entries(up)) {
    if (sync.items[key] === h) entries.push({ key, kind: 'same' });
    else if (byHash.has(h) && !key.endsWith('/intro')) entries.push({ key, kind: 'moved', src: byHash.get(h) });
    else entries.push({ key, kind: key in sync.items ? 'changed' : 'new' });
  }
  for (const key of Object.keys(sync.items)) if (!(key in up)) entries.push({ key, kind: 'removed' });
  return { from: sync.commit, to, upstream, hashes: up, entries };
}
