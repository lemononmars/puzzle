import {start,move,settle,isClear,puzzles} from './devilDice.mjs';
let s=start(3);s=settle(move(s,'right',false,0),7000);
const queue=[{s,path:[]}],seen=new Set();
while(queue.length){const {s,path}=queue.shift();if(isClear(s)&&s.moves===4){console.log('A4 solution',JSON.stringify(path));break;}if(s.moves>4||path.length>22)continue;const key=JSON.stringify([s.player,s.dice,s.moves]);if(seen.has(key))continue;seen.add(key);for(const d of ['up','down','left','right']){const n=move(s,d,false,7100);if(n)queue.push({s:n,path:[...path,d]});}}
console.log('states',seen.size);

