const { exec } = require('child_process');

function search(query) {
    exec(`python3 -c '
from ddgs import DDGS
ddgs = DDGS()
try:
    results = ddgs.text("${query}")
    for res in results[:3]:
        print(res["href"])
except Exception as e:
    pass
'`, (error, stdout, stderr) => {
        console.log(`--- ${query} ---`);
        if (stdout) console.log(stdout.trim());
    });
}

search("Công văn 4132/BYT-PC site:moh.gov.vn OR site:chinhphu.vn OR site:quochoi.vn OR site:vbpl.vn");
search("thông tư 43/2014/TT-BYT site:vbpl.vn");
search("thông tư 26/2013/TT-BYT site:vbpl.vn");
search("thông tư 35/2011/TT-BYT site:vbpl.vn");
