import urllib.request
import urllib.parse
import ssl
import re

ssl._create_default_https_context = ssl._create_unverified_context

def crawl(query):
    url = f"https://namu.wiki/w/{urllib.parse.quote(query)}"
    print(f"--- Crawl: {url} ---")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req)
        html = res.read().decode('utf-8', errors='ignore')

        text = re.sub(r'<style.*?>.*?</style>', '', html, flags=re.DOTALL)
        text = re.sub(r'<script.*?>.*?</script>', '', text, flags=re.DOTALL)
        text = re.sub(r'<[^>]+>', ' ', text)
        text = re.sub(r'\s+', ' ', text)

        # Look for relevant keywords
        if query == "아동수당":
            m = re.search(r'(.{0,50}월\s*\d+만?\s*원.{0,50})', text)
            if m: print(m.group(1))
            m2 = re.search(r'(.{0,50}세\s*미만.{0,50})', text)
            if m2: print(m2.group(1))
        elif query == "출산휴가":
            m = re.search(r'(.{0,50}일.{0,50})', text)
            if m: print(m.group(1))
        elif query == "육아휴직":
            m = re.search(r'(.{0,50}개월.{0,50})', text)
            if m: print(m.group(1))
            m2 = re.search(r'(.{0,50}1년.{0,50})', text)
            if m2: print(m2.group(1))

        print(text[:300])
    except Exception as e:
        print("Error", e)

crawl("아동수당")
crawl("육아휴직")
crawl("출산휴가")
