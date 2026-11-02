const https = require('https');
const url = require('url');

const options = {
  hostname: 'www.law.go.kr',
  port: 443,
  path: '/LSW/lsSc.do?menuId=1&query=' + encodeURIComponent('모자보건법'),
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    require('fs').writeFileSync('law.html', data);
  });
});
req.end();
