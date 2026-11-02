const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', 'Accept': 'text/html' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

(async () => {
    const html = await get('https://search.daum.net/search?w=tot&q=' + encodeURIComponent('모자보건법 엽산제'));
    const matches = [...html.matchAll(/<a href="(https?:\/\/[^"]+go\.kr[^"]*)"[^>]*class="f_link_b[^"]*">(.*?)<\/a>[\s\S]*?<p class="f_eb desc[^"]*">(.*?)<\/p>/g)];
    if(matches.length > 0) {
        matches.slice(0, 5).forEach(m => console.log(m[1] + "\n" + m[2].replace(/<[^>]+>/g,'') + "\n" + m[3].replace(/<[^>]+>/g,'') + "\n"));
    } else {
        console.log(html.length);
        console.log(html.slice(0, 500));
    }
})();
