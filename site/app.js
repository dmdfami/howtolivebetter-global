// Theme toggle and client-side search over /<locale>/index.json.
document.querySelector('.theme')?.addEventListener('click', () => {
  const root = document.documentElement;
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = dark ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch {}
});

const box = document.querySelector('.filters');
if (box) {
  const loc = box.dataset.loc;
  const params = new URLSearchParams(location.search);
  const input = document.querySelector('.search input');
  input.value = params.get('q') ?? '';
  const fold = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  fetch(`/${loc}/index.json`).then(r => r.json()).then(({ sections, items }) => {
    for (const it of items) it.f = fold(`${it.t} ${it.p}`);
    const out = document.querySelector('.results');
    const hits = document.querySelector('.hits');
    const render = () => {
      const words = fold(input.value).split(/\s+/).filter(Boolean);
      const want = [...box.querySelectorAll('select')].filter(s => s.value).map(s => [s.dataset.tag, s.value]);
      const hideCn = box.querySelector('[data-hide-cn]').checked;
      const list = items.filter(it => words.every(w => it.f.includes(w))
        && want.every(([k, v]) => (it.g[k] ?? '').split(/[,+]/).includes(v))
        && !(hideCn && it.cn));
      hits.textContent = list.length ? `${list.length}` : hits.dataset.empty;
      out.innerHTML = list.slice(0, 200).map(it => {
        const [nn, n] = it.k.split('/');
        const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
        return `<li><div class="rs">${it.s}. ${esc(sections[it.s])} · ${n} · ${it.e}</div><a class="rt" href="/${loc}/${nn}/${n}/">${esc(it.t)}</a><div class="rp">${esc(it.p)}</div></li>`;
      }).join('');
    };
    input.addEventListener('input', render);
    box.addEventListener('change', render);
    document.querySelector('.search').addEventListener('submit', e => { e.preventDefault(); render(); });
    render();
  });
}
