const https = require('https');
const url = require('url');

function getHTML(reqUrl) {
    return new Promise((resolve, reject) => {
        const parsed = url.parse(reqUrl);
        https.get({
            hostname: parsed.hostname,
            path: parsed.path,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function run() {
    let pages = ['아동수당', '아동수당_(대한민국)', '출산휴가', '육아휴직', '난임'];
    for (let p of pages) {
        console.log('--- ' + p + ' ---');
        try {
            let html = await getHTML('https://ko.wikipedia.org/wiki/' + encodeURIComponent(p));
            let m = html.match(/<p>.*?<\/p>/g);
            if (m) {
                for (let i = 0; i < 3 && i < m.length; i++) {
                    console.log(m[i].replace(/<[^>]+>/g, ''));
                }
            }
        } catch (e) { console.log(e); }
    }
}
run();
