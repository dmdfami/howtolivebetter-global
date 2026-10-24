import re

with open('locales/ru/part/s32b.md', 'r') as f:
    text = f.read()

text = text.replace('；', '; ')
text = text.replace('、', ', ')
text = text.replace('（拟议规则，2026-10-08 公布）', '(предлагаемое правило, опубликовано 2026-10-08)')
text = text.replace('（页面 2026-09-02 修改）', '(страница изменена 2026-09-02)')
text = text.replace('（页面 2026-10-06 修改）', '(страница изменена 2026-10-06)')

with open('locales/ru/part/s32b.md', 'w') as f:
    f.write(text)
