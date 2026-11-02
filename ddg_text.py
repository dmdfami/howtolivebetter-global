import urllib.request
import urllib.parse
import json
import ssl
import re

ssl._create_default_https_context = ssl._create_unverified_context

def api_search(query):
    print(f"--- API Search: {query} ---")
    url = f"https://api.duckduckgo.com/?q={urllib.parse.quote(query)}&format=json"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=10)
        data = json.loads(res.read())
        print("Abstract:", data.get("Abstract"))
        print("AbstractText:", data.get("AbstractText"))
    except Exception as e:
        print("Error", e)

api_search("아동수당법")
api_search("소득세법 자녀세액공제")
api_search("근로기준법 제74조")
api_search("남녀고용평등법 육아휴직")
api_search("보조생식술 건강보험")
