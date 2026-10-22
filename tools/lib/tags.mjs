// Upstream cost tags (Chinese) → language-neutral tags shared by every locale.
// Locale files carry `<!-- tags: … -->` so the site can filter without
// knowing the language.
const MAP = {
  钱: ['money', { '0': '0', 少: 'low', 多: 'high' }],
  时间: ['time', { 少: 'low', 中: 'mid', 多: 'high' }],
  毅力: ['will', { 否: 'no', 些: 'some', 是: 'high' }],
  收益: ['gain', { 小: 'low', 中: 'mid', 大: 'high' }],
  口径: ['scope', { 死亡率: 'health', 金钱: 'money', 时间: 'time', 自由: 'freedom' }],
};
const WHO = { '35岁': '35plus', 女性: 'women', 婴幼儿: 'infant', 孩子: 'child', 怀孕: 'pregnancy', 老人: 'elderly', '60岁': '60plus' };

export function neutralTags(zhTags) {
  const out = {};
  for (const [k, v] of Object.entries(zhTags)) {
    if (k === '人群') { out.who = v.replace(/[^,+]+/g, w => WHO[w] ?? w); continue; }
    const m = MAP[k];
    if (!m) continue;
    if (!(v in m[1])) throw new Error(`unknown tag value ${k}=${v}`);
    out[m[0]] = m[1][v];
  }
  return out;
}

export const tagLine = tags => `<!-- tags: ${Object.entries(tags).map(([k, v]) => `${k}=${v}`).join(' ')} -->`;

// Replace whatever tag comment an item body has with the neutral one.
export function withTagLine(body, tags) {
  const lines = body.split('\n').filter(l => !/^<!--\s*(tags|nhan-chi-phi|成本标签)\s*:/.test(l));
  return [tagLine(tags), ...lines].join('\n');
}
