from ddgs import DDGS
ddgs = DDGS()
import json

queries = [
    ("4132/BYT-KCB", ""),
    ("thực phẩm chức năng không phải thuốc chữa bệnh thông tư", "site:vbpl.vn")
]

for q, site in queries:
    print(f"--- {q} ---")
    try:
        results = ddgs.text(f"{q} {site}")
        for res in results[:2]:
            print(res["href"])
    except Exception as e:
        print("Error:", e)
