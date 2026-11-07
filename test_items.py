with open('locales/ar/book/10-section.md', 'r') as f:
    text = f.read()

import re
matches = list(re.finditer(r'للصين فقط', text))
print(f"Total 'للصين فقط' strings: {len(matches)}")

for i, m in enumerate(matches):
    start = max(0, m.start() - 100)
    end = min(len(text), m.end() + 100)
    print(f"Match {i+1}: ...{text[start:end]}...")
