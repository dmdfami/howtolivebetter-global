import urllib.request
import urllib.parse
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

def api_search_law(query):
    print(f"--- {query} ---")
    # You can search using DRF api with type=XML
    url = f"https://www.law.go.kr/DRF/lawSearch.do?OC=test&target=law&type=XML&query={urllib.parse.quote(query)}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req)
        print(res.read().decode('utf-8')[:300])
    except Exception as e:
        print("Error", e)

api_search_law("아동수당법")
api_search_law("소득세법")
api_search_law("근로기준법")
api_search_law("남녀고용평등과 일·가정 양립 지원에 관한 법률")
api_search_law("모자보건법")
