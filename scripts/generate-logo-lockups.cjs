const fs = require('fs');
const path = require('path');
const out = 'static/images/brand';
fs.mkdirSync(out, {recursive:true});
const key = fs.readFileSync('static/images/chi/chi-key.svg','utf8').replace(/<svg[^>]*>/,'').replace('</svg>','');
// Reuse the approved vowel artwork and natural Thai letter spacing unchanged.
const wordmark = fs.readFileSync('static/images/chi/chi-wordmark.svg','utf8').replace(/<svg[^>]*>/,'').replace('</svg>','');
const word = (x,y,size,center=false) => {
 const scale = size/83;
 const left = center ? x-145*scale : x;
 return `<g transform="translate(${left} ${y-105*scale}) scale(${scale})">${wordmark}</g>`;
};
const wrap=(w,h,body,label)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title"><title id="title">Chi Fun / ไขสนุก — ${label}</title>${body}</svg>`;
fs.writeFileSync(path.join(out,'chi-fun-wordmark.svg'),wrap(350,170,word(0,105,83),'Thai key wordmark'));
const designs = [
 ['stacked',400,430,`<g transform="translate(88 0) scale(.8)">${key}</g>${word(200,338,66,true)}`,'Stacked logo'],
 ['horizontal',660,250,`<g transform="translate(4 5) scale(.8)">${key}</g>${word(287,154,83)}`,'Horizontal logo'],
 ['occasion',440,470,`<path d="M76 348L58 441L134 408L178 454L195 348M245 348L266 454L310 408L384 441L365 348" fill="#e4c1a8"/><circle cx="220" cy="215" r="196" fill="#eef1e9" stroke="#526b4b" stroke-width="3"/><circle cx="220" cy="215" r="180" fill="none" stroke="#526b4b" stroke-dasharray="3 10" stroke-linecap="round"/><g transform="translate(122 20) scale(.68)">${key}</g><g fill="#78543f"><path d="M94 145l5 12 12 5-12 5-5 12-5-12-12-5 12-5zM345 91l4 10 10 4-10 4-4 10-4-10-10-4 10-4z"/><circle cx="331" cy="222" r="5"/><circle cx="112" cy="83" r="4"/></g>${word(220,301,59,true)}<text x="220" y="363" text-anchor="middle" font-family="Noto Sans Thai, sans-serif" font-size="17" font-weight="600" fill="#526b4b">ชวนกันไข • สนุกด้วยกัน</text>`,'Special occasion badge']
];
for (const [name,w,h,body,label] of designs) fs.writeFileSync(path.join(out,`chi-fun-${name}.svg`),wrap(w,h,body,label));
const panels=designs.map(([name,w,h,body],i)=>`<g transform="translate(${i*480} 0)"><rect x="12" y="12" width="456" height="536" rx="24" fill="#f9faf4"/><svg x="40" y="55" width="400" height="385" viewBox="0 0 ${w} ${h}">${body.replaceAll('key-bow',`key-bow-${i}`)}</svg><text x="240" y="503" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="18" fill="#364b3e">${['01 / Stacked','02 / Horizontal','03 / Occasion badge'][i]}</text></g>`).join('');
const preview=wrap(1440,560,`<rect width="1440" height="560" fill="#dce5d5"/>${panels}`,'Logo family');
fs.writeFileSync(path.join(out,'preview.svg'),preview);
const sharp=require(process.env.BRAND_SHARP);
sharp(Buffer.from(preview)).png().toFile(path.join(out,'preview.png')).then(()=>console.log('Generated three SVG logos and preview.'));
