import https from 'https';

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function main() {
  const data = await get('https://id.wikipedia.org/w/api.php?action=query&prop=extracts&titles=BPJS_Kesehatan&format=json&explaintext=1');
  const pages = data.query.pages;
  for (const pageId in pages) {
    const text = pages[pageId].extract;
    const lines = text.split('\n');
    lines.forEach(line => {
      if (line.toLowerCase().includes('rujukan')) {
        console.log(line);
      }
    });
  }
}
main();
