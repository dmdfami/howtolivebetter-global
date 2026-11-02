import urllib.request
import urllib.parse
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

def easy_search(query):
    url = f"https://ko.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&titles={urllib.parse.quote(query)}&format=json"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req)
        data = json.loads(res.read())
        pages = data['query']['pages']
        for page_id in pages:
            print(f"--- {query} ---")
            if 'extract' in pages[page_id]:
                import re
                clean = re.sub(r'<[^>]+>', '', pages[page_id]['extract']).strip()
                print(clean[:300])
    except Exception as e:
        print("Error", e)

easy_search("아동수당 (대한민국)")
easy_search("자녀세액공제")
easy_search("출산휴가")
easy_search("육아휴직")
easy_search("난임")
