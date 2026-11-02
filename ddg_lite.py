import urllib.request
import urllib.parse
import ssl
import json
import re

ssl._create_default_https_context = ssl._create_unverified_context

def search(query):
    url = f"https://lite.duckduckgo.com/lite/"
    data = urllib.parse.urlencode({'q': query}).encode('utf-8')
    try:
        req = urllib.request.Request(url, data=data, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8')
        snippets = re.findall(r'<td class=\'result-snippet\'[^>]*>(.*?)</td>', html, re.IGNORECASE | re.DOTALL)
        print(f"--- {query} ---")
        for i, snippet in enumerate(snippets[:3]):
            print(f"{i+1}. {snippet.strip()}")
    except Exception as e:
        print(e)

search("한국 아동수당 지급 기준 금액법")
search("소득세법 59조의2 자녀세액공제")
search("근로기준법 74조 출산휴가")
search("남녀고용평등법 19조 육아휴직")
search("한국 난임 시술 정부지원")
