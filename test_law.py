import urllib.request
import ssl
import json

ssl._create_default_https_context = ssl._create_unverified_context

url = "https://law.go.kr/LSW/lsInfoP.do?lsiSeq=238627"
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    res = urllib.request.urlopen(req)
    print("Code:", res.getcode())
    print(res.read()[:500])
except Exception as e:
    print(e)
