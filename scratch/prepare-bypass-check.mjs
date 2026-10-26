import fs from 'node:fs';
let prefix=fs.readFileSync('scripts/design-demon-dice-puzzles.mjs','utf8').split('const output=')[0].replace('s.moves>=maxCost','s.moves>maxCost');
prefix=prefix.replace('return null;}\nfunction candidate','return {noSolution:true,checked,exhausted:heap.a.length===0};}\nfunction candidate');
const verify=`\nconst data=JSON.parse(fs.readFileSync('src/lib/games/demonDicePuzzleData.json','utf8'));const report=[];for(const p of data){const state={...p.state,moves:0,cleared:0,score:0,chainSerial:0};const result=solve(state,12000,2,true);if(result?.path)throw Error(p.id+' has a trivial two-move bypass');report.push({id:p.id,checked:result?.checked??12000,exhausted:result?.exhausted??false});console.log(p.id,'no two-move clear',JSON.stringify(report.at(-1)));}fs.writeFileSync('docs/demon-dice-bypass-checks.json',JSON.stringify(report,null,2)+'\\n');`;
fs.writeFileSync('scratch/check-dice-bypasses.mjs',prefix+verify);
