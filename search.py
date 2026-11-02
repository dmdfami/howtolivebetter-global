import urllib.request
import urllib.parse
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

def duckduckgo(query):
    print(f"--- DuckDuckGo Search: {query} ---")
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        import re
        snippets = re.findall(r'<a class="result__snippet[^>]*>(.*?)</a>', html, re.IGNORECASE | re.DOTALL)
        for i, snippet in enumerate(snippets[:3]):
            clean_snippet = re.sub(r'<[^>]+>', '', snippet).strip()
            print(f"{i+1}. {clean_snippet}")
    except Exception as e:
        print("Error", e)

duckduckgo("한국 아동수당법 금액")
duckduckgo("한국 소득세법 자녀세액공제 금액")
duckduckgo("한국 근로기준법 출산전후휴가 기간")
duckduckgo("한국 남녀고용평등과 일·가정 양립 지원에 관한 법률 육아휴직 기간")
