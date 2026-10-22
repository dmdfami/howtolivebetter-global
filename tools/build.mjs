// Static site for Cloudflare Pages: dist/<locale>/… with one page per section
// and one page per item, plus a search index per locale.
//   node tools/build.mjs [--base https://example.com]
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { marked } from 'marked';
import { ROOT, localeDir, locales, readBookDir, readJson } from './lib/book.mjs';

const args = process.argv.slice(2);
const BASE = (args.includes('--base') ? args[args.indexOf('--base') + 1] : process.env.SITE_URL ?? '').replace(/\/$/, '');
const DIST = resolve(ROOT, 'dist');
const UPSTREAM = 'https://github.com/eternity4719/HowToLiveBetter';

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(resolve(ROOT, 'site'), resolve(DIST, 'assets'), { recursive: true });

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const md = s => marked.parse(s, { async: false });
const mdInline = s => marked.parseInline(s, { async: false });
const plain = s => s.replace(/<[^>]+>/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '').trim();
const write = (path, html) => { mkdirSync(resolve(DIST, path), { recursive: true }); writeFileSync(resolve(DIST, path, 'index.html'), html); };

// "phần 7, mục 12" → link to that item; bare "mục 5" → item in the current section.
function linkRefs(html, loc, nn) {
  const held = [];
  const hold = s => `\u0000${held.push(s) - 1}\u0000`;
  return html
    .replace(/<a\b[^>]*>.*?<\/a>/gs, hold)
    .replace(/phần (\d+), mục (\d+)/g, (m, p, n) => hold(`<a href="/${loc}/${p.padStart(2, '0')}/${n}/">${m}</a>`))
    .replace(/\bmục (\d+)/g, (m, n) => nn ? hold(`<a href="/${loc}/${nn}/${n}/">${m}</a>`) : m)
    .replace(/\u0000(\d+)\u0000/g, (m, i) => held[i]);
}

function page({ loc, L, title, desc, path, body, crumbs = [], alternates = [] }) {
  const url = `${BASE}/${path}`;
  return `<!doctype html>
<html lang="${loc}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc.slice(0, 300))}">
<link rel="canonical" href="${url}">
${alternates.map(a => `<link rel="alternate" hreflang="${a.lang}" href="${BASE}/${a.path}">`).join('\n')}
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc.slice(0, 300))}">
<meta property="og:type" content="article">
<link rel="stylesheet" href="/assets/style.css">
<script>try{const t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t}catch{}</script>
</head>
<body>
<header class="top">
  <a class="brand" href="/${loc}/">${esc(L.siteTitle)}</a>
  <form class="search" action="/${loc}/search/" role="search"><input name="q" type="search" placeholder="${esc(L.ui.search)}" aria-label="${esc(L.ui.search)}"></form>
  <button class="theme" type="button" aria-label="Theme">◐</button>
</header>
${crumbs.length ? `<nav class="crumbs">${crumbs.map(c => c.href ? `<a href="${c.href}">${esc(c.text)}</a>` : `<span>${esc(c.text)}</span>`).join(' / ')}</nav>` : ''}
<main>${body}</main>
<footer class="foot">${esc(L.ui.license)} <a href="${UPSTREAM}">${esc(L.ui.source)}</a> (eternity4719)${L.seedCredit ? ` · ${L.seedCredit}` : ''}. ${esc(L.ui.translatedFrom)} <code>${esc(L._commit)}</code>.</footer>
<script src="/assets/app.js" defer></script>
</body>
</html>`;
}

function tagChips(L, tags) {
  return Object.entries(tags).filter(([k]) => L.tags[k]).map(([k, v]) =>
    `<span class="chip chip-${k}" title="${esc(L.tags[k].label)}">${esc(L.tags[k].label)}: ${esc(v.split(/[,+]/).map(x => L.tags[k][x] ?? x).join(', '))}</span>`).join('');
}

function itemParts(L, it) {
  const f = Object.fromEntries(it.fields.map(x => [x.label, x.value]));
  const F = L.fields;
  const note = f[F['备注']] ?? '';
  const cnOnly = note.startsWith(L.cnOnlyMarker);
  return { f, F, cnOnly, plainLine: f[F['说人话']] ?? '', evidence: (f[F['证据等级']] ?? '').trim() };
}

function itemCard(loc, L, nn, it, audio, { full }) {
  const { f, F, cnOnly, plainLine, evidence } = itemParts(L, it);
  const rows = Object.values(F).filter(lbl => lbl !== F['说人话'] && f[lbl] != null);
  const a = audio[`${nn}/${it.n}`];
  return `<article class="item" id="m-${it.n}">
<h${full ? 1 : 2} class="item-title"><span class="num">${it.n}</span> ${full ? esc(it.title) : `<a href="/${loc}/${nn}/${it.n}/">${esc(it.title)}</a>`}</h${full ? 1 : 2}>
<div class="meta">${tagChips(L, it.tags)}<span class="chip ev ev-${esc(evidence[0] ?? '')}">${esc(L.ui.evidence)} ${esc(evidence)}</span>${cnOnly ? `<span class="chip cn">${esc(L.ui.cnOnly)}</span>` : ''}</div>
${a ? `<audio class="listen" controls preload="none" src="${esc(a.url)}"></audio>` : ''}
${plainLine ? `<p class="plain">${linkRefs(mdInline(plainLine), loc, nn)}</p>` : ''}
<details${full ? ' open' : ''}><summary>${esc(L.ui.readMore)}</summary>
<dl>${rows.map(lbl => `<dt>${esc(lbl)}</dt><dd class="f-${esc(Object.keys(F).find(k => F[k] === lbl))}">${linkRefs(md(f[lbl]), loc, nn)}</dd>`).join('')}</dl>
</details>
</article>`;
}

const sitemap = [];
for (const loc of locales()) {
  const L = readJson(resolve(localeDir(loc), 'locale.json'));
  const sync = readJson(resolve(localeDir(loc), 'sync.json'));
  L._commit = sync.commit.slice(0, 7);
  const audioPath = resolve(localeDir(loc), 'audio.json');
  const audio = existsSync(audioPath) ? readJson(audioPath) : {};
  const book = readBookDir(resolve(localeDir(loc), 'book'));
  const sections = Object.entries(book).sort(([a], [b]) => a.localeCompare(b));
  const total = sections.reduce((s, [, ch]) => s + ch.items.length, 0);
  const index = [];

  // Home
  const home = `<section class="hero"><h1>${esc(L.siteTitle)}</h1><p class="lead">${esc(L.tagline)}</p>
<p class="count">${total} ${esc(L.ui.items)} · ${sections.length} ${esc(L.ui.section).toLowerCase()}</p></section>
<ol class="sections">${sections.map(([nn, ch]) => `<li><a href="/${loc}/${nn}/"><span class="num">${ch.number}</span><span class="t">${esc(ch.title)}</span><span class="c">${ch.items.length}</span></a></li>`).join('')}</ol>`;
  write(loc, page({ loc, L, title: `${L.siteTitle} · ${L.tagline}`, desc: L.tagline, path: `${loc}/`, body: home }));
  sitemap.push(`${loc}/`);

  for (const [nn, ch] of sections) {
    const crumbs = [{ text: L.siteTitle, href: `/${loc}/` }, { text: `${ch.number}. ${ch.title}` }];
    const body = `<h1 class="sec-title"><span class="num">${ch.number}</span> ${esc(ch.title)}</h1>
<div class="intro">${linkRefs(md(ch.intro), loc, nn)}</div>
${ch.items.map(it => itemCard(loc, L, nn, it, audio, { full: false })).join('\n')}`;
    write(`${loc}/${nn}`, page({ loc, L, title: `${ch.number}. ${ch.title} · ${L.siteTitle}`, desc: plain(ch.intro), path: `${loc}/${nn}/`, body, crumbs }));
    sitemap.push(`${loc}/${nn}/`);

    ch.items.forEach((it, i) => {
      const prev = ch.items[i - 1], next = ch.items[i + 1];
      const { plainLine, cnOnly, evidence } = itemParts(L, it);
      const body = `${itemCard(loc, L, nn, it, audio, { full: true })}
<nav class="pager">${prev ? `<a rel="prev" href="/${loc}/${nn}/${prev.n}/">← ${esc(L.ui.prev)}</a>` : '<span></span>'}${next ? `<a rel="next" href="/${loc}/${nn}/${next.n}/">${esc(L.ui.next)} →</a>` : ''}</nav>`;
      write(`${loc}/${nn}/${it.n}`, page({ loc, L, title: `${it.title} · ${L.siteTitle}`, desc: plain(plainLine || it.title), path: `${loc}/${nn}/${it.n}/`, body,
        crumbs: [{ text: L.siteTitle, href: `/${loc}/` }, { text: `${ch.number}. ${ch.title}`, href: `/${loc}/${nn}/` }, { text: `${L.ui.item} ${it.n}` }] }));
      sitemap.push(`${loc}/${nn}/${it.n}/`);
      index.push({ k: `${nn}/${it.n}`, s: ch.number, t: it.title, p: plain(plainLine), g: it.tags, e: evidence[0] ?? '', cn: cnOnly ? 1 : 0 });
    });
  }

  // Search page (client-side, reads index.json)
  const filters = Object.entries(L.tags).map(([k, def]) => `<label>${esc(def.label)} <select data-tag="${k}"><option value="">—</option>${Object.entries(def).filter(([v]) => v !== 'label').map(([v, t]) => `<option value="${v}">${esc(t)}</option>`).join('')}</select></label>`).join('');
  write(`${loc}/search`, page({ loc, L, title: `${L.ui.search} · ${L.siteTitle}`, desc: L.tagline, path: `${loc}/search/`,
    body: `<div class="filters" data-loc="${loc}">${filters}<label><input type="checkbox" data-hide-cn> ${esc(L.ui.cnOnly)}: ✕</label></div><p class="hits" data-empty="${esc(L.ui.noResults)}"></p><ol class="results"></ol>` }));
  writeFileSync(resolve(DIST, loc, 'index.json'), JSON.stringify({ sections: Object.fromEntries(sections.map(([nn, ch]) => [ch.number, ch.title])), items: index }));
}

writeFileSync(resolve(DIST, 'index.html'), `<!doctype html><meta charset="utf-8"><title>HowToLiveBetter</title><meta http-equiv="refresh" content="0; url=/vi/"><a href="/vi/">Tiếng Việt</a>`);
writeFileSync(resolve(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map(p => `<url><loc>${BASE}/${p}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(resolve(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${BASE}/sitemap.xml\n`);
writeFileSync(resolve(DIST, '_headers'), `/assets/*\n  Cache-Control: public, max-age=86400\n/*/index.json\n  Cache-Control: public, max-age=3600\n`);
console.log(`built ${sitemap.length} pages into dist/`);
