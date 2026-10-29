// Run with the bundled sharp installation, or any local sharp package.
const fs = require('node:fs');
const sharp = require(process.env.BRAND_SHARP || 'sharp');
// The canonical SVG is the canonical Chi Key artwork for every brand asset.
const key = fs.readFileSync('static/images/chi/chi-key.svg','utf8').replace(/<svg[^>]*>/,'').replace('</svg>','');
const mark = '<rect width="512" height="512" rx="112" fill="#f9faf4"/><g transform="translate(32 40) scale(1.85)">'+key+'</g>';
const icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">'+mark+'</svg>';
const logoBody = fs.readFileSync('static/images/brand/chi-fun-horizontal.svg','utf8').replace(/<svg[^>]*>/,'').replace('</svg>','');
const badgeBody = fs.readFileSync('static/images/brand/chi-fun-occasion.svg','utf8').replace(/<svg[^>]*>/,'').replace('</svg>','').replaceAll('key-bow','badge-key');
function socialCard(title = 'Play · Create · Discover', subtitle = 'A PLAYROOM FOR CURIOUS MINDS') {
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#eef1e9"/><rect x="24" y="24" width="1152" height="582" rx="32" fill="#f9faf4" stroke="#dce5d5"/><g transform="translate(58 112) scale(1.02)">${logoBody}</g><g transform="translate(826 143) scale(.69)">${badgeBody}</g><text x="88" y="438" font-family="DM Sans, sans-serif" font-size="35" font-weight="600" fill="#364b3e">${title}</text><text x="88" y="491" font-family="DM Sans, sans-serif" font-size="16" letter-spacing="2" fill="#526b4b">${subtitle}</text><path d="M88 535H1112" stroke="#e4c1a8" stroke-width="4" stroke-linecap="round"/></svg>`;
}
const og = socialCard();
async function generate() {
 fs.writeFileSync('static/favicon.svg',icon);
 for (const [name,title,subtitle] of [
 ['wordsearch-builder','Word Search Builder','MAKE A GRID. HIDE A LITTLE CURIOSITY.'],
 ['thai-wordsearch','Thai Word Search','FIND THE WORDS YOU ARE LOOKING FOR.'],
 ['jigsaw-quiz','Jigsaw Quiz','PIECE TOGETHER YOUR NEXT AHA!'],
 ['crossword-builder','Crossword Builder','CONNECT WORDS. CREATE SOMETHING CURIOUS.'],
 ['pentomino-solver','Pentomino Solver','FIND WHERE THE PIECES FIT.']
 ]) await sharp(Buffer.from(socialCard(title,subtitle))).png().toFile('static/og-'+name+'.png');
 await sharp(Buffer.from(icon)).resize(32,32).jpeg({quality:95}).toFile('static/favicon.jpg');
 fs.writeFileSync('static/og-main.svg',og);
 await sharp(Buffer.from(og)).png().toFile('static/og-main.png');
 for (const [path,size] of [['static/favicon.png',32],['static/icons/apple-touch-icon.png',180],['static/icons/icon-192x192.png',192],['static/icons/icon-512x512.png',512],['static/icons/icon-512x512-maskable.png',512]]) {
  const svg=path.includes('maskable')?`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#f9faf4"/><g transform="translate(77 77) scale(.7)">${mark}</g></svg>`:icon;
  await sharp(Buffer.from(svg)).resize(size,size).png().toFile(path);
 }
}
generate().catch(error=>{ console.error(error); process.exitCode=1; });
