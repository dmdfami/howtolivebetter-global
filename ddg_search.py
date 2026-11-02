import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
import sys
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def search(query):
    print(f"Searching: {query}")
    try:
        url = f"https://lite.duckduckgo.com/lite/"
        data = urllib.parse.urlencode({'q': query}).encode('utf-8')
        req = urllib.request.Request(
            url,
            data=data,
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        response = urllib.request.urlopen(req, context=ctx, timeout=10)
        html = response.read().decode('utf-8')
        soup = BeautifulSoup(html, 'html.parser')

        for tr in soup.find_all('tr'):
            td = tr.find('td', class_='result-snippet')
            if td:
                print(td.text.strip())
                print("-" * 50)
            a = tr.find('a', class_='result-url')
            if a:
                print(f"URL: {a.get('href')}")
    except Exception as e:
        print(f"Search failed: {e}")

if __name__ == "__main__":
    search(sys.argv[1])
