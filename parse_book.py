with open('locales/ar/book/10-section.md', 'r') as f:
    text = f.read()

import re

# find all occurrences of 'للصين فقط'
indices = [m.start() for m in re.finditer(r'للصين فقط', text)]

titles = []
for idx in indices:
    title_idx = text.rfind('### ', 0, idx)
    if title_idx != -1:
        end_of_title = text.find('\n', title_idx)
        title = text[title_idx:end_of_title].strip()
        titles.append(title)

out_file = 'locales/ar/local/10.md'
with open(out_file, 'w') as out:
    out.write('> للاسترشاد فقط وليس استشارة قانونية. تحقق من المصدر الرسمي قبل التصرف.\n\n')

    for i, title in enumerate(titles):
        out.write(f"{title}\n")
        out.write("- في مصر: لا توجد معلومات موثقة لمصر حتى الآن.\n")
        out.write("- المصادر الرسمية: \n")
        out.write("- تاريخ الاطلاع: 2026-11-02\n")
        out.write("- درجة الموثوقية: لم يتم التحقق\n")
        if i < len(titles) - 1:
            out.write("\n")
