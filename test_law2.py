import urllib.request
import urllib.parse
import ssl
from html.parser import HTMLParser

ssl._create_default_https_context = ssl._create_unverified_context

def fetch_law(law_name):
    print(f"--- {law_name} ---")
    url = f"https://www.law.go.kr/법령/{urllib.parse.quote(law_name)}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req)
        print("URL after redirect:", res.url)
    except Exception as e:
        print("Error:", e)

fetch_law("아동수당법")
fetch_law("소득세법")
fetch_law("근로기준법")
fetch_law("남녀고용평등과일·가정양립지원에관한법률")
fetch_law("모자보건법")
