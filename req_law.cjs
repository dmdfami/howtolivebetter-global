const https = require('https');

function getHTML(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function run() {
    try {
        const h1 = await getHTML('https://law.go.kr/LSW/lsInfoP.do?lsiSeq=238627');
        console.log(h1.substring(0, 300));
    } catch(e) {
        console.log(e);
    }
}
run();
