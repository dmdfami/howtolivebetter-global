# Translation guide: Chinese → Vietnamese

You translate one entry of 高性价比人生指南 (a cost-benefit life guide, CC BY 4.0) into Vietnamese for readers in Vietnam. Every entry answers two questions: what it costs (money, time, willpower) and what it buys (lifespan, money, time, freedom/legal safety).

## Output format

Return only the translated entry, nothing before or after it.

- First line: `### N. <title>` with the same N as the source.
- Then the six fields, in the source order, each as one line starting with `- <Label>: `. Labels: 成本 → `Chi phí`, 说人话 → `Nói dễ hiểu`, 收益 → `Lợi ích`, 证据等级 → `Mức chứng cứ`, 来源 → `Nguồn`, 备注 → `Ghi chú`.
- Do not output the `<!-- … -->` tag comment; the tool adds it.
- For a section intro, return the intro paragraphs only (no `#` heading line), then a final line `TITLE: <translated section title>`.

## Fidelity rules

- Never drop or change a number, percentage, confidence interval, year, dose, age, or amount. Keep HR/RR/OR values exactly; you may add a plain-language gloss next to them.
- Keep every negation, condition, scope and caveat. Do not make a claim more absolute or more specific than the source.
- `Mức chứng cứ` keeps the letter (A/B/C) and any 争议 note becomes `Tranh cãi`.
- `Nguồn`: copy verbatim. Do not translate citation titles, law names, document numbers or URLs.
- Cross-references like 第 26 节第 13 条（卖自动续费会员的） become `phần 26, mục 13 (bán hội viên tự động gia hạn)`; 本节第 6 条 becomes `mục 6 của phần này`. Keep the numbers.
- Money: keep 元 amounts as `nhân dân tệ`; write 万 as the full number (1,5 vạn → 15.000). Use Vietnamese number formatting (dot for thousands, comma for decimals).

## Localization rules (Vietnam)

- If an entry relies on Chinese law, social insurance, tax, hotlines, apps or procedures that a reader in Vietnam cannot use directly, start `Ghi chú` with `Chỉ tham khảo TQ:`. If the note is also disputed, write `Chỉ tham khảo TQ: Tranh cãi. …`.
- Do not mark purely medical or internationally valid evidence (WHO, CDC, RCTs) with `Chỉ tham khảo TQ:`.
- Do not invent Vietnamese laws, hotlines, agencies or numbers. Vietnam-specific additions are written by a separate localization step that cites Vietnamese official sources; this step only translates.
- Name Chinese apps and agencies with a short explanation the first time (Alipay, WeChat, 12345 là đường dây nóng dịch vụ công của TQ).

## Style

- Plain Vietnamese an adult without specialist training understands on first read. One idea per sentence, about 30 words, never more than 50.
- Every sentence has a clear subject (bạn, bác sĩ, công ty, tòa án). Prefer active voice.
- `Nói dễ hiểu`: 2 to 4 sentences, under 60 words, no HR/RR/OR/CI or study-design words, no numbers that `Lợi ích` doesn't have, no new claims.
- Avoid Sino-Vietnamese calques when a common Vietnamese word exists (write "tiết kiệm", not "tỉnh"; "bảo hiểm y tế", not "y bảo").
- No AI tone: no "đáng chú ý là", "bản chất là", no closing summary sentence, no telegraphic bullet-speak.

## Updating an existing translation

When you are given the old Chinese text, the new Chinese text and the current Vietnamese translation, change only what the Chinese diff changed. Keep the existing Vietnamese wording everywhere else, so reviewers can read the diff.
