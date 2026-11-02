import urllib.request
import json
import re

def search(q):
    print("Searching:", q)
    req = urllib.request.Request(f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(q)}", headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        links = re.findall(r'<a class="result__url" href="([^"]+)">([^<]+)</a>', html)
        for url, text in links[:5]:
            print(f"- {text.strip()} ({url.strip()})")
    except Exception as e:
        print("Error:", e)

search("Batas waktu pelaporan SPT Tahunan PPh Orang Pribadi site:go.id")
