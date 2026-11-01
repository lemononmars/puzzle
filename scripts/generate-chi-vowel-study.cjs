const fs=require('fs');
const out='static/images/brand/chi-vowel-study';fs.mkdirSync(out,{recursive:true});
// Preserve the current head exactly; only the shaft and far end are redesigned.
const currentSource=fs.readFileSync('static/images/chi/chi-key-pre-sigma.svg','utf8');
const head=currentSource.match(/d="(M[^"\n]*?A29 29 [^"\n]*?)L/)[1];
// In the rotated vowel the stem travels upward. Keep both turns exact.
// The unrotated key travels downward (90 degrees in SVG coordinates).
const tailStart = {x:83.256, y:167};
const firstHeading = (90 - 150) * Math.PI / 180;
const secondHeading = firstHeading + 120 * Math.PI / 180;
const first = {x:tailStart.x + 36*Math.cos(firstHeading), y:tailStart.y + 36*Math.sin(firstHeading)};
const second = {x:first.x + 28*Math.cos(secondHeading), y:first.y + 28*Math.sin(secondHeading)};
const stroke=head+`V${tailStart.y}L${first.x} ${first.y}L${second.x} ${second.y}`;
const mainKey=`<path d="${stroke}" fill="none" stroke="#364b3e" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>`;
// A literal half-turn, without mirroring or stretching the circular end.
const vowel=`<g transform="translate(-130 0) rotate(180 140 120)">${mainKey}</g>`;
const emblem=`${mainKey}<path d="M119 110L47 182" fill="none" stroke="#526b4b" stroke-width="22" stroke-linecap="round"/><rect x="77" y="140" width="12" height="12" rx="2" transform="rotate(45 83 146)" fill="#e4c1a8"/>`;
const word=`<g transform="translate(-1 0) scale(.55)">${vowel}</g><text x="70" y="105" font-family="Noto Sans Thai,sans-serif" font-weight="700" font-size="83" fill="#364b3e">ข<tspan fill="#526b4b">สนุก</tspan></text><path d="M120 120H292" fill="none" stroke="#e4c1a8" stroke-width="6" stroke-linecap="round"/><text x="70" y="149" font-family="DM Sans,sans-serif" font-size="17" font-weight="700" letter-spacing="6" fill="#364b3e">CHI FUN</text>`;
const svg=(w,h,body,title)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><title>${title}</title>${body}</svg>`;
fs.writeFileSync(out+'/chi-key-vowel.svg',svg(280,240,emblem,'Chi Key — Thai vowel study'));
fs.writeFileSync(out+'/wordmark.svg',svg(350,170,word,'ไขสนุก — key vowel wordmark'));
fs.writeFileSync(out+'/horizontal.svg',svg(680,250,`<g transform="translate(0 0)">${emblem}</g><g transform="translate(285 43)">${word}</g>`,'Chi Fun — Thai vowel key study'));
const current=fs.readFileSync('static/images/chi/chi-key-pre-sigma.svg','utf8').replace(/<svg[^>]*>/,'').replace('</svg>','');
const preview=svg(1240,650,`<rect width="1240" height="650" fill="#eef1e9"/><rect x="24" y="24" width="360" height="602" rx="24" fill="#f9faf4"/><rect x="404" y="24" width="812" height="602" rx="24" fill="#f9faf4"/><text x="55" y="77" font-family="sans-serif" font-size="18" fill="#526b4b">CURRENT</text><g transform="translate(75 120)">${current}</g><text x="55" y="504" font-family="sans-serif" font-size="18" fill="#526b4b">NEW / VOWEL-FIRST KEY</text><g transform="translate(120 350) scale(.52)">${emblem}</g><g transform="translate(446 100) scale(1.08)">${emblem}</g><g transform="translate(840 88) scale(.95)">${vowel}</g><text x="820" y="350" font-family="sans-serif" font-size="16" fill="#526b4b">EXACTLY 180°</text><g transform="translate(540 392) scale(1.15)">${word}</g>`,'Chi Fun — current and vowel-first logo study');
fs.writeFileSync(out+'/preview.svg',preview);
require(process.env.BRAND_SHARP)(Buffer.from(preview)).png().toFile(out+'/preview.png').then(()=>console.log('Created alternate key and wordmark; current branding preserved.'));
