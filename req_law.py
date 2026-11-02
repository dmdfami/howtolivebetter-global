import urllib.request
import urllib.parse
from html.parser import HTMLParser
import sys
import re

class DDGParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_result = False
        self.in_url = False
        self.in_snippet = False
        self.current_url = ""
        self.current_title = ""
        self.current_snippet = ""
        self.results = []
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == "a" and attrs_dict.get('class') == 'result-url':
            self.in_url = True
            self.current_url = attrs_dict.get('href', '')
        if tag == "td" and attrs_dict.get('class') == 'result-snippet':
            self.in_snippet = True
    def handle_data(self, data):
        if self.in_url:
            pass
        if self.in_snippet:
            self.current_snippet += data.strip() + " "
    def handle_endtag(self, tag):
        if tag == "a" and self.in_url:
            self.in_url = False
        if tag == "td" and self.in_snippet:
            self.in_snippet = False
            self.results.append({'url': self.current_url, 'snippet': self.current_snippet.strip()})
            self.current_snippet = ""
            self.current_url = ""

def gsearch(kw):
    url = 'https://lite.duckduckgo.com/lite/'
    data = urllib.parse.urlencode({'q': kw}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        parser = DDGParser()
        parser.feed(html)
        return parser.results
    except Exception as e:
        return str(e)

for kw in ['site:law.moj.gov.tw "勞工保險條例" "生育給付"', 'site:law.moj.gov.tw "緊急醫療救護法" "救護車"', 'site:law.moj.gov.tw "戶籍法" "出生登記"', 'site:law.moj.gov.tw "戶籍法" "姓名"']:
    print(f"=== {kw} ===")
    res = gsearch(kw)
    if isinstance(res, list):
        for r in res[:3]:
            print(r['url'])
            print(r['snippet'])
