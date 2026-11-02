import urllib.request
import urllib.parse
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

def search(q):
    print(f"--- {q} ---")
    url = f"https://www.law.go.kr/DRF/lawSearch.do?OC=test&target=law&type=XML&query={urllib.parse.quote(q)}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        res = urllib.request.urlopen(req)
        print(res.read().decode('utf-8')[:200])
    except Exception as e:
        print(e)
search("아동수당법")
