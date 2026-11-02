const fs = require('fs');
const html = fs.readFileSync('daum.html', 'utf8');
const regex = /<a [^>]*href="(https?:\/\/[^"]+)"[^>]*>(.*?)<\/a>[\s\S]*?<p class="[^"]*desc[^"]*">(.*?)<\/p>/g;
let match;
while ((match = regex.exec(html)) !== null) {
  if (match[1].includes('go.kr')) {
    console.log(match[1]);
    console.log(match[2].replace(/<[^>]+>/g,''));
    console.log(match[3].replace(/<[^>]+>/g,''));
    console.log('---');
  }
}
