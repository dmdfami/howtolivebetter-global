const https = require('https');

function search(query) {
    console.log("--- Search: " + query + " ---");
    const data = "q=" + encodeURIComponent(query);
    const options = {
        hostname: 'lite.duckduckgo.com',
        path: '/lite/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data),
            'User-Agent': 'Mozilla/5.0'
        }
    };

    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            const matches = [...body.matchAll(/<td class='result-snippet'[^>]*>(.*?)<\/td>/gi)];
            for (let i = 0; i < Math.min(3, matches.length); i++) {
                console.log(`${i+1}. ${matches[i][1].trim()}`);
            }
        });
    });

    req.on('error', e => console.error(e));
    req.write(data);
    req.end();
}

search("한국 아동수당법 제4조 금액");
setTimeout(() => search("한국 소득세법 제59조의2 자녀세액공제 금액"), 2000);
setTimeout(() => search("한국 근로기준법 제74조 출산휴가 기간"), 4000);
setTimeout(() => search("한국 남녀고용평등과 일가정 양립 지원에 관한 법률 육아휴직 기간"), 6000);
setTimeout(() => search("한국 난임 부부 건강보험 지원 비율"), 8000);
