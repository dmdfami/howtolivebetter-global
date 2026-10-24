// "Ván đời": a card game built from the book's own cost/benefit tags.
// Every card is a real item; cost and benefit come from its tags and evidence grade.
{
const root = document.querySelector('.gameapp');
const loc = root.dataset.loc;
const S = JSON.parse(root.dataset.strings);
const box = document.getElementById('game');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const STAT = { health: '#b8392a', money: '#2f7a55', time: '#b58a2e', mind: '#3b5ba5' };
const SCOPE = { health: 'health', money: 'money', time: 'time', freedom: 'mind' };
const COST = { money: { low: 6, high: 16 }, time: { low: 3, mid: 8, high: 15 }, will: { some: 4, high: 10 } };
const GAIN = { high: 22, mid: 12, low: 6 };
const RISK = { high: .45, mid: .25, low: .1 };
const HIT = { A: 1, B: .8, C: .55 };
const ROUNDS = 15;

let data, st, deck, i, missed, tags;
const clamp = v => Math.max(0, Math.min(100, Math.round(v)));
const shuffle = a => { for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; } return a; };
const label = (k, v) => (tags[k]?.[v]) ?? v;
const scopes = c => (c.g.scope || '').split(/[,+]/).map(x => SCOPE[x]).filter(Boolean);

function bars() {
  return `<div class="stats">${Object.keys(STAT).map(k => `<div class="st">${esc(S.stats[k])} <b>${st[k]}</b><div><i style="width:${st[k]}%;background:${STAT[k]}"></i></div></div>`).join('')}</div>`;
}

function start() {
  st = { health: 60, money: 60, time: 60, mind: 60 };
  missed = [];
  deck = shuffle(data.cards.slice()).slice(0, ROUNDS);
  i = 0;
  show();
}

function show() {
  if (i >= deck.length || Object.values(st).some(v => v <= 0)) return end();
  const c = deck[i];
  const tg = ['money', 'time', 'will', 'gain', 'scope'].filter(k => c.g[k] != null)
    .map(k => `<span class="chip">${esc(tags[k].label)}: ${esc(String(c.g[k]).split(/[,+]/).map(v => label(k, v)).join(', '))}</span>`).join('');
  box.innerHTML = `${bars()}<div class="gcard"><div class="rd">${esc(S.round)} ${i + 1}/${deck.length}</div><h2>${esc(c.t)}</h2>${c.p ? `<p class="pl">${esc(c.p)}</p>` : ''}<div class="tg">${tg}</div>
<div class="acts2"><button class="btn seal" id="do" type="button">${esc(S.do)}</button><button class="btn" id="skip" type="button">${esc(S.skip)}</button></div><div id="fb"></div></div>`;
  box.querySelector('#do').onclick = () => choose(c, true);
  box.querySelector('#skip').onclick = () => choose(c, false);
}

function choose(c, did) {
  const to = scopes(c), main = to.length ? to : ['mind'];
  const gain = GAIN[c.g.gain] ?? 6;
  const lines = [];
  if (did) {
    const pay = { money: COST.money[c.g.money] ?? 0, time: COST.time[c.g.time] ?? 0, mind: COST.will[c.g.will] ?? 0 };
    for (const k in pay) st[k] = clamp(st[k] - pay[k]);
    lines.push(`${esc(S.costLine)}: ${Object.entries(pay).filter(([, v]) => v).map(([k, v]) => `${esc(S.stats[k])} −${v}`).join(', ') || '—'}`);
    if (Math.random() < (HIT[c.e] ?? .8)) {
      for (const k of main) st[k] = clamp(st[k] + gain / main.length);
      lines.push(`${esc(S.gainLine)}: ${main.map(k => `${esc(S.stats[k])} +${Math.round(gain / main.length)}`).join(', ')}. ${esc(S.evidenceHit)}`);
    } else lines.push(esc(S.evidenceMiss));
  } else {
    if (c.g.gain === 'high' || c.g.gain === 'mid') missed.push(c);
    if (Math.random() < (RISK[c.g.gain] ?? .1) * (c.e === 'C' ? .6 : 1)) {
      for (const k of main) st[k] = clamp(st[k] - gain * .8 / main.length);
      lines.push(`${esc(S.skipHit)} ${main.map(k => `${esc(S.stats[k])} −${Math.round(gain * .8 / main.length)}`).join(', ')}`);
    } else lines.push(esc(S.skipSafe));
  }
  const g = box.querySelector('.gcard');
  g.querySelector('.acts2').remove();
  g.querySelector('#fb').innerHTML = `<div class="fb">${lines.map(l => `<p>${l}</p>`).join('')}<p><a href="/${loc}/${c.k}/">${esc(S.readItem)} →</a></p></div><div class="acts2" style="margin-top:12px"><button class="btn" id="nx" type="button">${esc(S.next)}</button></div>`;
  box.querySelector('.stats').outerHTML = bars();
  i++;
  g.querySelector('#nx').onclick = show;
  g.querySelector('#nx').focus();
}

function end() {
  const dead = Object.values(st).some(v => v <= 0);
  const uniq = [...new Map(missed.map(c => [c.k, c])).values()];
  box.innerHTML = `${bars()}<div class="gcard"><h2>${esc(S.endTitle)}</h2><p>${esc(dead ? S.endLose : S.endWin)}</p>
<h3>${esc(S.missed)}</h3>${uniq.length ? `<ul class="endlist">${uniq.map(c => `<li><a href="/${loc}/${c.k}/">${esc(c.t)}</a></li>`).join('')}</ul>` : `<p>${esc(S.none)}</p>`}
<div class="acts2"><button class="btn seal" id="again" type="button">${esc(S.again)}</button></div></div>`;
  box.querySelector('#again').onclick = start;
}

document.getElementById('begin').onclick = async () => {
  if (!data) { data = await (await fetch(`/${loc}/cards.json`)).json(); tags = data.tags; }
  start();
};
}
