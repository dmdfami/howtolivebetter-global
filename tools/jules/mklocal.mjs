// Jules tasks for the per-country layer: one session per (language, section).
//   node tools/jules/mklocal.mjs > tools/jules/local-tasks.json
// Output is locales/<lang>/local/<NN>.md, which tools/build.mjs already renders after the items.
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT, localeDir } from '../lib/book.mjs';

// [country, host-country official-source hint, local, sources, checked, reliability, verified, unverified, none, disclaimer]
const M = {
  en: ['United States', '*.gov, official state sites', 'In the United States', 'Official sources', 'Checked on', 'Reliability', 'verified', 'unverified', 'No verified information for the United States yet.', 'For reference only, not legal advice. Check the official source before acting.'],
  es: ['Spain', 'boe.es, *.gob.es, agenciatributaria.es', 'En España', 'Fuentes oficiales', 'Consultado el', 'Fiabilidad', 'verificado', 'no verificado', 'Todavía no hay información verificada para España.', 'Solo orientativo, no es asesoramiento legal. Compruebe la fuente oficial antes de actuar.'],
  pt: ['Brazil', 'planalto.gov.br, *.gov.br', 'No Brasil', 'Fontes oficiais', 'Consultado em', 'Confiabilidade', 'verificado', 'não verificado', 'Ainda não há informação verificada para o Brasil.', 'Apenas para referência, não é aconselhamento jurídico. Confira a fonte oficial antes de agir.'],
  fr: ['France', 'legifrance.gouv.fr, service-public.fr, *.gouv.fr', 'En France', 'Sources officielles', 'Consulté le', 'Fiabilité', 'vérifié', 'non vérifié', "Pas encore d'information vérifiée pour la France.", "À titre indicatif, ce n'est pas un conseil juridique. Vérifiez la source officielle avant d'agir."],
  de: ['Germany', 'gesetze-im-internet.de, bundesregierung.de, *.bund.de', 'In Deutschland', 'Offizielle Quellen', 'Abgerufen am', 'Zuverlässigkeit', 'geprüft', 'ungeprüft', 'Für Deutschland liegen noch keine geprüften Informationen vor.', 'Nur zur Orientierung, keine Rechtsberatung. Prüfen Sie vor dem Handeln die offizielle Quelle.'],
  ru: ['Russia', 'publication.pravo.gov.ru, pravo.gov.ru, *.gov.ru', 'В России', 'Официальные источники', 'Проверено', 'Достоверность', 'проверено', 'не проверено', 'Проверенной информации для России пока нет.', 'Только для ознакомления, не юридическая консультация. Перед действиями проверьте официальный источник.'],
  ar: ['Egypt', '*.gov.eg, egypt.gov.eg, cc.gov.eg', 'في مصر', 'المصادر الرسمية', 'تاريخ الاطلاع', 'درجة الموثوقية', 'تم التحقق', 'لم يتم التحقق', 'لا توجد معلومات موثقة لمصر حتى الآن.', 'للاسترشاد فقط وليس استشارة قانونية. تحقق من المصدر الرسمي قبل التصرف.'],
  hi: ['India', 'indiacode.nic.in, *.gov.in, *.nic.in', 'भारत में', 'आधिकारिक स्रोत', 'जाँच की तारीख', 'विश्वसनीयता', 'सत्यापित', 'असत्यापित', 'भारत के लिए अभी कोई सत्यापित जानकारी नहीं है।', 'केवल संदर्भ के लिए, कानूनी सलाह नहीं। कार्रवाई से पहले आधिकारिक स्रोत जाँच लें।'],
  id: ['Indonesia', 'peraturan.go.id, jdih.*.go.id, *.go.id', 'Di Indonesia', 'Sumber resmi', 'Diperiksa pada', 'Keandalan', 'terverifikasi', 'belum terverifikasi', 'Belum ada informasi terverifikasi untuk Indonesia.', 'Hanya sebagai acuan, bukan nasihat hukum. Periksa sumber resmi sebelum bertindak.'],
  ja: ['Japan', 'laws.e-gov.go.jp, *.go.jp', '日本では', '公的な出典', '確認日', '信頼度', '確認済み', '未確認', '日本について確認済みの情報はまだありません。', '参考情報であり、法的助言ではありません。行動する前に公的な情報源を確認してください。'],
  ko: ['South Korea', 'law.go.kr, *.go.kr', '한국에서는', '공식 출처', '확인일', '신뢰도', '확인됨', '미확인', '한국에 대해 확인된 정보가 아직 없습니다.', '참고용이며 법률 자문이 아닙니다. 실행 전에 공식 출처를 확인하세요.'],
  th: ['Thailand', 'krisdika.go.th, ratchakitcha.soc.go.th, *.go.th', 'ในประเทศไทย', 'แหล่งข้อมูลทางการ', 'ตรวจสอบเมื่อ', 'ความน่าเชื่อถือ', 'ตรวจสอบแล้ว', 'ยังไม่ได้ตรวจสอบ', 'ยังไม่มีข้อมูลที่ตรวจสอบแล้วสำหรับประเทศไทย', 'เพื่อใช้อ้างอิงเท่านั้น ไม่ใช่คำปรึกษาทางกฎหมาย โปรดตรวจแหล่งข้อมูลทางการก่อนดำเนินการ'],
  tr: ['Turkey', 'mevzuat.gov.tr, resmigazete.gov.tr, *.gov.tr', "Türkiye'de", 'Resmî kaynaklar', 'Kontrol tarihi', 'Güvenilirlik', 'doğrulandı', 'doğrulanmadı', "Türkiye için henüz doğrulanmış bilgi yok.", 'Yalnızca bilgi amaçlıdır, hukuki tavsiye değildir. İşlem yapmadan önce resmî kaynağı kontrol edin.'],
  it: ['Italy', 'normattiva.it, gazzettaufficiale.it, *.gov.it', 'In Italia', 'Fonti ufficiali', 'Consultato il', 'Affidabilità', 'verificato', 'non verificato', "Per l'Italia non ci sono ancora informazioni verificate.", "Solo a scopo informativo, non è consulenza legale. Controlla la fonte ufficiale prima di agire."],
  'zh-Hant': ['Taiwan', 'law.moj.gov.tw, *.gov.tw', '在臺灣', '官方來源', '查證日期', '可信度', '已查證', '未查證', '臺灣目前沒有已查證的資料。', '僅供參考，非法律意見。行動前請先核對官方來源。'],
};

const today = new Date().toISOString().slice(0, 10);
const tasks = [];
for (const [lang, [country, hint, inC, src, chk, rel, ver, unv, none, disc]] of Object.entries(M)) {
  const dir = resolve(localeDir(lang), 'book');
  const marker = JSON.parse(readFileSync(resolve(localeDir(lang), 'locale.json'), 'utf8')).cnOnlyMarker;
  for (const f of readdirSync(dir).filter(f => /^\d\d-/.test(f)).sort()) {
    const nn = f.slice(0, 2);
    const n = (readFileSync(resolve(dir, f), 'utf8').match(new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) ?? []).length;
    if (!n) continue;
    tasks.push({
      id: `local-${lang}-${nn}`,
      title: `${lang} local ${nn}`,
      prompt: `Country localization of section ${nn} of this multilingual book (${lang} edition: locales/${lang}/book/${f}). ${n} items of this section carry the marker \`${marker}\` in their notes field: they rely on Chinese law, social insurance, tax, hotlines, apps or procedures that a reader in ${country} cannot use.

Your job: for each such item, research what the equivalent is in ${country} and write it into a NEW file locales/${lang}/local/${nn}.md (create the folder if needed). Edit no other file; never edit locales/${lang}/book/*, sync.json, tools/ or .github/. Write in the language of the edition (read locales/${lang}/guide.md first and follow its style rules: plain language, short sentences).

Use EXACTLY these labels and wording, so every section file of this edition looks the same.
First line of the file: \`> ${disc}\`
Then one block per marked item, in item order:
### N. <same title as in the book>
- ${inC}: 1 to 4 plain sentences saying what applies in ${country} (right, procedure, amount, deadline, who to contact).
- ${src}: official sources only, as full URLs (government or official-gazette domains such as ${hint}, or the official site of an international body), plus the name of the law or document and the article number.
- ${chk}: ${today}
- ${rel}: \`${ver}\` only if every concrete claim (law name, article, figure, deadline, hotline) is backed by an official source you actually opened and whose text says so; otherwise \`${unv}\`, and then write only general principles and no concrete numbers or article numbers.
If an item has no equivalent in ${country} or you cannot find an official source, write the block with \`- ${inC}: ${none}\`, an empty sources line and \`${rel}: ${unv}\`. Never invent laws, article numbers, amounts, hotlines or URLs: a missing answer is fine, a wrong one is not. Do not copy Chinese figures as ${country} ones. Keep the item numbers exactly as in the book.

Run \`npm ci && npm run build\` (must succeed). Open one pull request titled "local ${lang} ${nn}" that contains only locales/${lang}/local/${nn}.md and says how many items are \`${ver}\` vs \`${unv}\`.`,
      allow: [`locales/${lang}/local/${nn}.md`],
    });
  }
}
console.log(JSON.stringify(tasks, null, 1));
