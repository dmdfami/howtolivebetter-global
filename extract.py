import re

with open('locales/vi/book/01-dung-chet-som.md', 'r', encoding='utf-8') as f:
    content = f.read()

items = re.split(r'\n### (?=\d+\. )', '\n' + content)

count = 0
for item in items:
    if 'Chỉ tham khảo TQ:' in item:
        title = item.split('\n')[0].strip()
        print(f"{title}")
        count += 1
print(f"Total: {count}")
