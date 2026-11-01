const fs=require('fs');const base='static/images/brand/chi-vowel-study';const out='static/images/brand/chi-sigma-study';fs.mkdirSync(out,{recursive:true});
// Freeze the approved angular version before introducing an independent alternative.
const saved=base+'/saved-angle-tail';fs.mkdirSync(saved,{recursive:true});
for(const name of ['chi-key-vowel.svg','wordmark.svg','horizontal.svg','preview.svg','preview.png']) {
 if(!fs.existsSync(saved+'/'+name))fs.copyFileSync(base+'/'+name,saved+'/'+name);
}
const current=fs.readFileSync('static/images/chi/chi-key-pre-sigma.svg','utf8');
const head=current.match(/d="(M[^"\n]*?A29 29 [^"\n]*?)L/)[1];
const mainKey=`<g fill="none" stroke="#364b3e" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"><path d="${head}V260"/><path d="M83.256 210H151L117 235L151 260H83.256"/></g>`;
const rotated=`<g transform="translate(-120 0) rotate(180 140 150)">${mainKey}</g>`;
// Equal-length diagonals meet at 90 degrees to form the chi / X.
const stemLength=260-90.283;
const crossing={x:140,y:150};
const tickCrossing={x:crossing.x+12,y:crossing.y+12};
const halfDiagonal=stemLength/(2*Math.sqrt(2));
const elbow={x:tickCrossing.x-halfDiagonal,y:tickCrossing.y+halfDiagonal};
const tip={x:tickCrossing.x+halfDiagonal,y:tickCrossing.y-halfDiagonal};
const keyCenter={x:280-120-83.256,y:(300-260+300-90.283)/2};
const diagonalKey=`<g transform="translate(${crossing.x} ${crossing.y}) rotate(-45) translate(${-keyCenter.x} ${-keyCenter.y})">${rotated}</g>`;
const cross=`<path d="M${elbow.x-25} ${elbow.y-25}L${elbow.x} ${elbow.y}L${tip.x} ${tip.y}" fill="none" stroke="#526b4b" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/><rect x="${tickCrossing.x-6}" y="${tickCrossing.y-6}" width="12" height="12" rx="2" transform="rotate(45 ${tickCrossing.x} ${tickCrossing.y})" fill="#e4c1a8"/>`;
const emblem=diagonalKey+cross;
const word=`<g transform="translate(0 0) scale(.45)">${rotated}</g><text x="59" y="105" font-family="Noto Sans Thai,sans-serif" font-weight="700" font-size="83" fill="#364b3e">ข<tspan fill="#526b4b">สนุก</tspan></text><path d="M109 120H281" fill="none" stroke="#e4c1a8" stroke-width="6" stroke-linecap="round"/><text x="59" y="149" font-family="DM Sans,sans-serif" font-size="17" font-weight="700" letter-spacing="6" fill="#364b3e">CHI FUN</text>`;
const svg=(w,h,body,title)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><title>${title}</title>${body}</svg>`;
fs.writeFileSync(out+'/chi-key-sigma.svg',svg(280,300,emblem,'Chi Key — sigma key teeth'));
fs.writeFileSync(out+'/wordmark.svg',svg(350,170,word,'Chi Fun — sigma key wordmark'));
fs.writeFileSync(out+'/horizontal.svg',svg(680,300,`<g transform="translate(20 0)">${emblem}</g><g transform="translate(285 65)">${word}</g>`,'Chi Fun — sigma key design'));
const savedKey=fs.readFileSync(saved+'/chi-key-vowel.svg','utf8').replace(/<svg[^>]*>/,'').replace('</svg>','');
const preview=svg(1240,650,`<rect width="1240" height="650" fill="#eef1e9"/><rect x="24" y="24" width="360" height="602" rx="24" fill="#f9faf4"/><rect x="404" y="24" width="812" height="602" rx="24" fill="#f9faf4"/><text x="55" y="77" font-family="sans-serif" font-size="18" fill="#526b4b">SAVED / ANGLED TAIL</text><g transform="translate(112 180) scale(1.05)">${savedKey}</g><text x="444" y="77" font-family="sans-serif" font-size="18" fill="#526b4b">NEW / SIGMA KEY</text><g transform="translate(458 94) scale(.95)">${emblem}</g><g transform="translate(830 94) scale(.95)">${rotated}</g><text x="820" y="389" font-family="sans-serif" font-size="16" fill="#526b4b">ROTATED 180°</text><g transform="translate(540 410) scale(1.12)">${word}</g>`,'Chi Fun — saved angle-tail and new sigma key');
fs.writeFileSync(out+'/preview.svg',preview);
require(process.env.BRAND_SHARP)(Buffer.from(preview)).png().toFile(out+'/preview.png').then(()=>console.log('Preserved angle-tail version and created separate sigma alternative.'));
