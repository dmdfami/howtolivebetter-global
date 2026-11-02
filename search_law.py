import urllib.request
import urllib.parse
import json
import ssl
import sys

ssl._create_default_https_context = ssl._create_unverified_context

def get_law(query):
    print(f"--- Search: {query} ---")
    url = f"https://www.law.go.kr/DRF/lawSearch.do?OC=test&target=law&type=HTML&query={urllib.parse.quote(query)}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        print(html[:500])
    except Exception as e:
        print("Error", e)

get_law("아동수당법")
get_law("소득세법")
get_law("근로기준법")
get_law("남녀고용평등법")
