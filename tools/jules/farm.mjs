// Run a queue of Jules tasks hands-off across several Jules API keys.
//
//   JULES_KEYS="key1,key2,…" node tools/jules/farm.mjs tools/jules/tasks.json [--once]
//
// Keys come only from the environment (e.g. `infisical run -- node …`); they are
// never written to disk, logs or prompts. State (session ids, retries) lives in
// tools/jules/state.json, which is gitignored.
//
// Per key it keeps at most CONCURRENT sessions running (default 15) and starts at
// most DAILY tasks per UTC day (default 100); the rest wait in the queue. A session
// that fails is retried (up to MAX_RETRIES); one that stops to ask a question is told
// to continue without asking; a finished one is checked for scope (only the files the
// task allows) and the result is written to state for review. Nothing is merged here.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const [tasksPath, ...flags] = process.argv.slice(2);
if (!tasksPath) { console.error('usage: farm.mjs tasks.json [--once]'); process.exit(2); }
const keys = (process.env.JULES_KEYS ?? '').split(/[\s,]+/).filter(Boolean);
if (!keys.length) { console.error('set JULES_KEYS (comma separated)'); process.exit(2); }
const CONCURRENT = Number(process.env.JULES_CONCURRENT ?? 15);
const DAILY = Number(process.env.JULES_DAILY ?? 100);
const MAX_RETRIES = Number(process.env.JULES_MAX_RETRIES ?? 3);
const POLL_MS = Number(process.env.JULES_POLL_SECONDS ?? 300) * 1000;
const REPO = process.env.JULES_REPO ?? 'dmdfami/howtolivebetter-global';
const API = 'https://jules.googleapis.com/v1alpha';
const STATE = new URL('./state.json', import.meta.url).pathname;
const NO_ASK = 'Do not ask me anything and do not wait for approval. If something is unclear, pick the most reasonable reading, finish the whole task, and open the pull request. If a command fails, fix it or work around it yourself.';

const tasks = JSON.parse(readFileSync(tasksPath, 'utf8'));
const state = existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : {};
const save = () => writeFileSync(STATE, JSON.stringify(state, null, 1));
const today = () => new Date().toISOString().slice(0, 10);
const call = async (k, method, path, body) => {
  const res = await fetch(`${API}/${path}`, { method, headers: { 'X-Goog-Api-Key': keys[k], 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) });
  if (!res.ok) throw new Error(`${method} ${path}: HTTP ${res.status}`);
  return res.json();
};
const ACTIVE = new Set(['QUEUED', 'PLANNING', 'IN_PROGRESS', 'AWAITING_PLAN_APPROVAL', 'AWAITING_USER_FEEDBACK', 'PAUSED']);

function scopeOk(task, pr) {
  const files = JSON.parse(execFileSync('gh', ['api', `repos/${REPO}/pulls/${pr}/files`, '--paginate', '--jq', '[.[].filename]'], { encoding: 'utf8' }).replace(/\]\s*\[/g, ','));
  const bad = files.filter(f => !task.allow.some(a => f.startsWith(a)));
  return { files, bad };
}

async function tick() {
  for (const t of tasks) {
    const s = state[t.id] ??= { status: 'todo', tries: 0 };
    if (s.status === 'running') {
      let r;
      try { r = await call(s.key, 'GET', `sessions/${s.session}`); } catch (e) { console.error(t.id, e.message); continue; }
      if (r.state === 'COMPLETED') {
        const pr = r.outputs?.map(o => o.pullRequest?.url).find(Boolean);
        if (!pr) { s.status = 'todo'; s.note = 'completed without PR'; continue; }
        const n = pr.split('/').pop();
        const { files, bad } = scopeOk(t, n);
        Object.assign(s, { status: bad.length ? 'needs-fix' : 'ready', pr, files, bad });
      } else if (r.state === 'FAILED') {
        s.status = s.tries >= MAX_RETRIES ? 'failed' : 'todo'; s.note = 'session failed';
      } else if (r.state === 'AWAITING_USER_FEEDBACK' || r.state === 'AWAITING_PLAN_APPROVAL') {
        const act = r.state === 'AWAITING_PLAN_APPROVAL' ? `sessions/${s.session}:approvePlan` : `sessions/${s.session}:sendMessage`;
        await call(s.key, 'POST', act, r.state === 'AWAITING_PLAN_APPROVAL' ? {} : { prompt: `Continue. ${NO_ASK}` }).catch(e => console.error(t.id, e.message));
      }
    }
  }
  // start waiting tasks on keys with free slots
  const load = keys.map((_, k) => Object.values(state).filter(s => s.status === 'running' && s.key === k).length);
  const started = keys.map((_, k) => Object.values(state).filter(s => s.key === k && s.day === today()).length);
  for (const t of tasks) {
    const s = state[t.id];
    if (s.status !== 'todo') continue;
    const k = keys.findIndex((_, i) => load[i] < CONCURRENT && started[i] < DAILY);
    if (k < 0) break;
    try {
      const r = await call(k, 'POST', 'sessions', {
        prompt: `${t.prompt}\n\n${NO_ASK}`, title: t.title,
        sourceContext: { source: `sources/github/${REPO}`, githubRepoContext: { startingBranch: t.base ?? 'main' } },
        requirePlanApproval: false, automationMode: 'AUTO_CREATE_PR',
      });
      Object.assign(s, { status: 'running', key: k, session: r.id, url: r.url, day: today(), tries: s.tries + 1 });
      load[k]++; started[k]++;
    } catch (e) { console.error('start', t.id, e.message); }
  }
  save();
  const c = {}; for (const s of Object.values(state)) c[s.status] = (c[s.status] ?? 0) + 1;
  console.log(new Date().toISOString(), JSON.stringify(c));
  return Object.values(state).some(s => ['todo', 'running'].includes(s.status));
}

for (;;) {
  const more = await tick();
  if (!more || flags.includes('--once')) break;
  await new Promise(r => setTimeout(r, POLL_MS));
}
