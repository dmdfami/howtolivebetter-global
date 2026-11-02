with open('locales/ar/book/10-section.md', 'r') as f:
    text = f.read()

# Since there is only one entry when splitting by ===, we need to extract the titles more carefully.
lines = text.split('\n')
titles_with_marker = []
current_title = None

for line in lines:
    if line.startswith('### '):
        current_title = line.strip()
    if 'للصين فقط:' in line:
        titles_with_marker.append(current_title)

print(len(titles_with_marker))
