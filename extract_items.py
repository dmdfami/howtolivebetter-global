import re

with open('locales/ar/book/09-section.md', 'r', encoding='utf-8') as f:
    content = f.read()

items = re.split(r'\n### (?=\d+\.)', '\n' + content)

count = 0
for item in items:
    if not item.strip():
        continue
    if 'للصين فقط:' in item:
        lines = item.strip().split('\n')
        title_line = lines[0]
        # if the split didn't capture '### ', let's ensure it has it
        if not title_line.startswith('###'):
            title_line = '### ' + title_line
        print(title_line)
        count += 1
print(f"Total: {count}")
