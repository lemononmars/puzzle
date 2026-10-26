const base='http://127.0.0.1:5194';
for(const path of ['', '/tutorials','/puzzles','/endless','/battle']) {
 const response=await fetch(`${base}/puzzles/pips-plot${path}`);const html=await response.text();if(response.status!==200||!html.includes("Pip's Plot"))throw Error(`${path}: ${response.status} or missing title`);
 const old=await fetch(`${base}/puzzles/demon-dice${path}?room=TEST`,{redirect:'manual'});if(old.status!==308||old.headers.get('location')!==`/puzzles/pips-plot${path}?room=TEST`)throw Error(`redirect ${path}: ${old.status} ${old.headers.get('location')}`);
 console.log(`PASS ${path||'/'} title and legacy redirect`);
}
