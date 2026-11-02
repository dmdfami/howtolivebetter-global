import urllib.request
import re

def check_law(seq):
    url = f"https://law.go.kr/LSW/lsInfoP.do?lsiSeq={seq}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        m = re.search(r'<title>(.*?)</title>', html)
        if m: print(f"Seq {seq}: {m.group(1)}")
    except Exception as e:
        pass

check_law(238627)
