import urllib.request
try:
    print(urllib.request.urlopen("https://example.com").read().decode()[:100])
except Exception as e:
    print(e)
