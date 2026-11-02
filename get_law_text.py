import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
import ssl
import re

ssl._create_default_https_context = ssl._create_unverified_context

def search_law(query):
    print(f"=== {query} ===")
    url = f"https://www.law.go.kr/DRF/lawSearch.do?OC=test&target=law&type=XML&query={urllib.parse.quote(query)}"
    try:
        req = urllib.request.Request(url)
        xml_data = urllib.request.urlopen(req).read()
        root = ET.fromstring(xml_data)
        for law in root.findall('law'):
            law_name = law.find('법령명한글').text
            law_link = law.find('법령상세링크').text
            law_id = law.find('법령일련번호').text
            print(f"{law_name} : {law_link} : {law_id}")
    except Exception as e:
        print("Error:", e)

search_law("아동수당법")
search_law("소득세법")
search_law("근로기준법")
search_law("남녀고용평등과 일ㆍ가정 양립 지원에 관한 법률")
search_law("모자보건법")
