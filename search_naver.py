import urllib.request
import urllib.parse
import ssl
import json
import re

ssl._create_default_https_context = ssl._create_unverified_context

def search(query):
    print(f"--- {query} ---")
    url = f"https://search.naver.com/search.naver?query={urllib.parse.quote(query)}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'})
        html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8')
        # Extract basic text from news/snippets
        snippets = re.findall(r'<a href="[^"]*" class="api_txt_lines total_tit"[^>]*>(.*?)</a>', html, re.IGNORECASE)
        desc_snippets = re.findall(r'<div class="api_txt_lines dsc_txt">(.*?)</div>', html, re.IGNORECASE)
        for i, snippet in enumerate(snippets[:3]):
            clean = re.sub(r'<[^>]+>', '', snippet).strip()
            desc = re.sub(r'<[^>]+>', '', desc_snippets[i]).strip() if i < len(desc_snippets) else ''
            print(f"{i+1}. {clean}")
            print(f"   {desc}")
    except Exception as e:
        print("Error", e)

search("아동수당 지급액 및 지급기간")
search("자녀세액공제 소득세법")
search("근로기준법 출산휴가 일수")
search("남녀고용평등법 육아휴직 기간")
search("난임 시술 정부 지원 건강보험")
