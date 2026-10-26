import {readFileSync} from 'node:fs';
import {compile} from 'svelte/compiler';
for(const file of ['src/lib/components/DemonDiceGame.svelte','src/lib/components/DevilDiceBoard.svelte']){const result=compile(readFileSync(file,'utf8'),{filename:file,generate:false});console.log(file,result.warnings.map(w=>`${w.code}: ${w.message}`));}
