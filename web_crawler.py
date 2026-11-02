import urllib.request
import ssl
import re

ssl._create_default_https_context = ssl._create_unverified_context

def crawl(url):
    print(f"--- Crawl: {url} ---")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req)
        html = res.read().decode('utf-8', errors='ignore')

        # very basic text extraction
        text = re.sub(r'<style.*?>.*?</style>', '', html, flags=re.DOTALL)
        text = re.sub(r'<script.*?>.*?</script>', '', text, flags=re.DOTALL)
        text = re.sub(r'<[^>]+>', ' ', text)
        text = re.sub(r'\s+', ' ', text)

        print(text[:1000])
    except Exception as e:
        print("Error", e)

crawl("https://namu.wiki/w/아동수당")
crawl("https://namu.wiki/w/육아휴직")
crawl("https://namu.wiki/w/출산휴가")
