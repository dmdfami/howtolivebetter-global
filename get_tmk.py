import urllib.request
import re
from bs4 import BeautifulSoup
try:
    html = urllib.request.urlopen('https://www.resmigazete.gov.tr/eskiler/2001/12/20011208.htm').read().decode('windows-1254')
    soup = BeautifulSoup(html, 'html.parser')
    text = soup.get_text()
    with open('tmk.txt', 'w') as f:
        f.write(text)
    print("Saved to tmk.txt")
except Exception as e:
    print(e)
