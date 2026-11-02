import urllib.request, urllib.parse, sys, ssl
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
url = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote(sys.argv[1])
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
from bs4 import BeautifulSoup
soup = BeautifulSoup(html, 'html.parser')
for res in soup.find_all('a', class_='result__snippet'):
    print(res.text)
