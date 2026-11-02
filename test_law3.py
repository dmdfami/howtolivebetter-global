import urllib.request
import urllib.parse
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

def get_law_id(query):
    import json
    # Use DRF openapi for searching
    url = f"https://www.law.go.kr/DRF/lawSearch.do?OC=test&target=law&type=XML&query={urllib.parse.quote(query)}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req)
        xml = res.read().decode('utf-8')

        # very simple xml parse to just find first law link
        import xml.etree.ElementTree as ET
        root = ET.fromstring(xml)
        for law in root.findall('law'):
            link = law.find('법령상세링크').text
            # e.g., /DRF/lawService.do?OC=test&target=law&MST=238627&type=HTML&mobileYn=
            mst = link.split('MST=')[1].split('&')[0]
            print(f"{query} -> MST={mst}")
            return mst
    except Exception as e:
        print(f"Error {query}: {e}")
        return None

def fetch_law_text(mst):
    url = f"https://www.law.go.kr/DRF/lawService.do?OC=test&target=law&MST={mst}&type=XML"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req)
        xml = res.read().decode('utf-8')
        print(f"Text for {mst}: len={len(xml)}")
    except Exception as e:
        print(f"Error fetching {mst}: {e}")

queries = ["아동수당법", "소득세법", "근로기준법", "남녀고용평등과 일ㆍ가정 양립 지원에 관한 법률", "모자보건법"]
for q in queries:
    mst = get_law_id(q)
    if mst:
        fetch_law_text(mst)
