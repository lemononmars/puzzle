// Run with the bundled sharp installation, or any local sharp package.
const fs = require('node:fs');
const sharp = require(process.env.BRAND_SHARP || 'sharp');
const mark = '<rect width="512" height="512" rx="128" fill="#506c48"/><path d="M256 96Q274 238 416 256Q274 274 256 416Q238 274 96 256Q238 238 256 96Z" fill="#f8f9f3"/><circle cx="256" cy="256" r="32" fill="#e8bda3"/>';
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${mark}</svg>`;
const tiles = 'PLAYIDEACLUEWORD'.split('').map((letter,i) => {
 const x=835+(i%4)*59, y=204+Math.floor(i/4)*59;
 return `<circle cx="${x}" cy="${y}" r="25" fill="${i%5===0?'#506c48':'#eef1e9'}"/><text x="${x}" y="${y+8}" text-anchor="middle" font-family="DM Sans" font-size="23" fill="${i%5===0?'#f8f9f3':'#364b3e'}">${letter}</text>`;
}).join('');
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#eef1e9"/><rect x="24" y="24" width="1152" height="582" rx="32" fill="none" stroke="#c9d1c1"/>
<g transform="translate(70 65) scale(.12)">${mark}</g><text x="151" y="108" font-family="DM Sans" font-size="36" fill="#364b3e">puzzle.</text>
<text x="72" y="216" font-family="DM Sans" font-size="14" letter-spacing="4" fill="#506c48">A PLAYROOM FOR CURIOUS MINDS</text>
<text x="68" y="308" font-family="DM Sans" font-size="76" fill="#364b3e">Small puzzles.</text><text x="68" y="399" font-family="DM Sans" font-size="76" fill="#364b3e">Fresh discoveries.</text>
<text x="72" y="479" font-family="DM Sans" font-size="22" fill="#506c48">Play · Create · Explore</text>
<rect x="754" y="97" width="374" height="450" rx="180" fill="#dce3d2"/>
<g transform="rotate(4 940 320)"><rect x="785" y="149" width="307" height="313" rx="24" fill="#f8f9f3"/>${tiles}<text x="818" y="443" font-family="DM Sans" font-size="12" fill="#506c48">FOLLOW YOUR CURIOSITY ↗</text></g>
<circle cx="1050" cy="481" r="62" fill="#e8bda3"/><text x="1050" y="485" text-anchor="middle" font-family="DM Sans" font-size="36" fill="#364b3e">aha!</text></svg>`;
async function generate() {
 fs.writeFileSync('static/favicon.svg',icon);
 fs.writeFileSync('static/og-main.svg',og);
 await sharp(Buffer.from(og)).png().toFile('static/og-main.png');
 for (const [path,size] of [['static/favicon.png',32],['static/icons/apple-touch-icon.png',180],['static/icons/icon-192x192.png',192],['static/icons/icon-512x512.png',512],['static/icons/icon-512x512-maskable.png',512]]) {
  const svg=path.includes('maskable')?`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#506c48"/><g transform="translate(77 77) scale(.7)">${mark}</g></svg>`:icon;
  await sharp(Buffer.from(svg)).resize(size,size).png().toFile(path);
 }
}
generate().catch(error=>{ console.error(error); process.exitCode=1; });
