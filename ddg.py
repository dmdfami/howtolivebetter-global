import urllib.request
import urllib.parse
import ssl
import json
import re

ssl._create_default_https_context = ssl._create_unverified_context

def search(query):
    print(f"--- Search: {query} ---")
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
        html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8')
        snippets = re.findall(r'<a class="result__snippet[^>]*>(.*?)</a>', html, re.IGNORECASE | re.DOTALL)
        for i, snippet in enumerate(snippets[:5]):
            clean = re.sub(r'<[^>]+>', '', snippet).strip()
            print(f"{i+1}. {clean}")
    except Exception as e:
        print("Error", e)

search("한국 아동수당 지급액 및 기간")
search("한국 소득세법 자녀세액공제 금액")
search("한국 근로기준법 출산휴가 일수 출산수당")
search("한국 육아휴직 기간 남녀고용평등법")
