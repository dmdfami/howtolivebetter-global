import fs from 'fs';

const p = 'locales/th/part/s01d.md';
let c = fs.readFileSync(p, 'utf-8');

c = c.replace(/\n=== 01\/32/g, '\n\n=== 01/32');
c = c.replace(/\n=== 01\/34/g, '\n\n=== 01/34');
c = c.replace(/\n=== 01\/36/g, '\n\n=== 01/36');
c = c.replace(/\n=== 01\/37/g, '\n\n=== 01/37');
c = c.replace(/\n=== 01\/38/g, '\n\n=== 01/38');
c = c.replace(/\n=== 01\/39/g, '\n\n=== 01/39');

fs.writeFileSync(p, c);
