import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET

def find_law(query):
    print(f"--- {query} ---")
    url = f"https://www.law.go.kr/DRF/lawSearch.do?OC=test&target=law&type=XML&query={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        xml = urllib.request.urlopen(req, timeout=10).read()
        root = ET.fromstring(xml)
        for law in root.findall('law')[:1]:
            mst = law.find('법령상세링크').text.split('MST=')[1].split('&')[0]
            print(f"MST: {mst}")
            get_law_text(mst)
    except Exception as e:
        print("Error", e)

def get_law_text(mst):
    url = f"https://www.law.go.kr/DRF/lawService.do?OC=test&target=law&MST={mst}&type=XML"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        xml = urllib.request.urlopen(req, timeout=10).read()
        root = ET.fromstring(xml)
        for jo in root.findall('.//조문단위'):
            jo_title = jo.attrib.get('조문번호')
            jo_text = jo.find('조문내용').text if jo.find('조문내용') is not None else ''
            if jo_title in ['4', '59의2', '74', '19']:
                 print(f"Article {jo_title}: {jo_text}")
    except Exception as e:
        print("Error text", e)

find_law("아동수당법")
find_law("소득세법")
find_law("근로기준법")
find_law("남녀고용평등과 일ㆍ가정 양립 지원에 관한 법률")
