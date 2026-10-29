import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';

// Compact, high-contrast silhouettes remain readable on every dice background.
const sets = {
 sky: [
  ['Sun','<circle cx="50" cy="50" r="21"/><path d="M50 8v12m0 60v12M8 50h12m60 0h12M20 20l9 9m42 42 9 9M20 80l9-9m42-42 9-9"/>'],
  ['Cloud','<path d="M25 76C1 76 0 42 23 38c0-29 43-34 51-6 31-3 35 44 5 44Z"/>'],
  ['Moon','<path d="M72 13a38 38 0 1 0 15 61A36 36 0 0 1 72 13Z"/>'],
  ['Star','<path d="m50 9 12 26 29 4-21 21 5 30-25-14-25 14 5-30L9 39l29-4Z"/>']
 ],
 flower: [
  ['Daisy','<g fill="#f9f3da">'+Array.from({length:8},(_,i)=>`<ellipse cx="50" cy="26" rx="10" ry="18" transform="rotate(${i*45} 50 50)"/>`).join('')+'</g><circle cx="50" cy="50" r="15" fill="#dfb44e"/>'],
  ['Tulip','<path d="M50 89V54M50 75Q22 77 20 58q23-3 30 17" fill="#83a77b"/><path d="M21 17 38 30 50 12l12 18 17-13v23a29 29 0 0 1-58 0Z" fill="#d98491"/>'],
  ['Rose','<path d="M50 90V65m0 14 24-13"/><path d="M50 12 69 16 85 36 78 59 58 72 32 65 16 44 24 23Z" fill="#d98491"/><path d="m34 30 25-6 14 18-10 20-24-2-11-17 14-9 16 9-8 10-10-5" fill="none"/>'],
  ['Lotus','<path d="M50 80Q9 78 9 40q24 0 41 40Q91 78 91 40 67 40 50 80Z" fill="#d98491"/><path d="M50 80Q20 47 50 11q30 36 0 69Z" fill="#efd2de"/>']
 ],
 fruit: [
  ['Apple','<path d="M50 31C15 13 8 44 23 75q11 20 27 10 16 10 27-10 24-46-5-48-12-1-22 4Z" fill="#d98481"/><path d="M50 31V13q22-7 24 0-11 15-24 10" fill="#83a77b"/>'],
  ['Pear','<path d="M50 24C31 23 40 40 25 55 0 90 99 100 78 57 61 39 69 24 50 24Z" fill="#aac77c"/><path d="m50 24 5-16"/>'],
  ['Cherry','<circle cx="30" cy="69" r="21" fill="#d98491"/><circle cx="73" cy="70" r="20" fill="#d98491"/><path d="M30 48Q55 30 53 9 75 22 73 50" fill="none"/>'],
  ['Lemon','<path d="M12 69Q10 23 69 20l13-8 2 17q19 52-39 58l-16 4-6-15Z" fill="#eacb69"/><path d="M30 60q-1-18 20-23" fill="none"/>']
 ],
 animal: [
  ['Cat','<path d="M19 43 16 12 40 27h20L84 12l-3 31q15 44-31 45Q4 87 19 43Z" fill="#d9b58b"/><path d="M32 51h2m32 0h2M45 65h10l-5 7Z"/><path d="M50 72v6m-31-9 19 3m24 0 19-3" fill="none"/>'],
  ['Rabbit','<ellipse cx="35" cy="29" rx="12" ry="23" fill="#eee7dd"/><ellipse cx="65" cy="29" rx="12" ry="23" fill="#eee7dd"/><ellipse cx="50" cy="65" rx="33" ry="27" fill="#eee7dd"/><path d="M36 61h1m26 0h1m-18 13h8l-4 6Z"/>'],
  ['Fish','<path d="M71 50 92 25v50L71 50C46 8 7 34 7 50s39 42 64 0Z" fill="#91b7bd"/><circle cx="26" cy="45" r="3" fill="#354d43"/><path d="M48 32q-12 18 0 36" fill="none"/>'],
  ['Butterfly','<path d="M50 48C18-8-15 37 32 56-8 82 38 106 50 59c12 47 58 23 18-3 47-19 14-64-18-8Z" fill="#c1a5cb"/><path d="M50 37v44m0-44L38 22m12 15 12-15" fill="none"/>']
 ],
 suit: [
  ['Heart','<path d="M50 87 14 50C-9 14 35-1 50 27 65-1 109 14 86 50Z" fill="#d98491"/>'],
  ['Diamond','<path d="m50 8 33 42-33 42L17 50Z" fill="#d98491"/>'],
  ['Club','<path d="M42 65C-6 84 3 25 31 36 13-5 87-5 69 36 97 25 106 84 58 65l8 24H34Z" fill="#83a77b"/>'],
  ['Spade','<path d="M50 9C40 29 7 40 12 61q5 22 30 8l-9 21h34l-9-21q25 14 30-8C93 40 60 29 50 9Z" fill="#91b7bd"/>']
 ],
 element: [
  ['Fire','<path d="M52 8q6 30 23 32l-1-16q39 55-4 65C12 106 3 54 31 32l2 20Q53 38 52 8Z" fill="#dfa174"/>'],
  ['Water','<path d="M50 9C40 32 16 50 18 65c4 40 60 40 64 0C84 50 60 32 50 9Z" fill="#91b7bd"/><path d="M33 63q-2 16 13 19" fill="none"/>'],
  ['Leaf','<path d="M18 81Q2 14 86 13q9 82-68 68Z" fill="#83a77b"/><path d="m16 87 56-57M39 64l-6-20m6 20 21 2" fill="none"/>'],
  ['Wind','<path d="M10 35h54q27 0 18-19-10-16-22-1M10 51h68q26 0 13 19-11 10-19-1M10 68h33q24 0 14 18-8 10-16 0" fill="none"/>']
 ],
 snow: [
  ['Snowflake','<g fill="none">'+[0,60,120].map(a=>`<path transform="rotate(${a} 50 50)" d="M50 8v84M38 16l12 12 12-12M38 84l12-12 12 12"/>`).join('')+'</g>'],
  ['Snowman','<circle cx="50" cy="68" r="25" fill="#f5f2e8"/><circle cx="50" cy="32" r="18" fill="#f5f2e8"/><path d="M32 47h36M29 61 10 49m61 12 19-12"/><path d="m49 32 14 5-14 3" fill="#dfa174"/><path d="M43 25h1m13 0h1M50 61v1m0 12v1"/>'],
  ['Mitten','<path d="M27 73V27q0-18 18-18h7q18 0 18 18v14q16-25 23-9 8 12-23 42v16H27Z" fill="#d98491"/><path d="M27 73h43"/>'],
  ['Pine','<path d="M44 73v18h12V73" fill="#d9b58b"/><path d="m50 8 23 29H62l22 25H68l23 18H9l23-18H16l22-25H27Z" fill="#83a77b"/>']
 ]
};
for (const [theme, icons] of Object.entries(sets)) {
 const dir=`static/boardgame/pakklongdice/img/${theme}`;
 mkdirSync(dir,{recursive:true});
 icons.forEach(([name,body],i)=>writeFileSync(`${dir}/${i+1}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>${name}</title><g fill="#eacb69" stroke="#354d43" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>\n`));
}
console.log('Generated 28 Sky Scan SVG icons.');
