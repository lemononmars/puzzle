import ts from 'typescript';import fs from 'node:fs';
for(const name of ['devilDice','devilDiceTutorials']){let code=ts.transpileModule(fs.readFileSync(`src/lib/games/${name}.ts`,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText.replaceAll('./devilDiceTutorials.js','./devilDiceTutorials.mjs');fs.writeFileSync(`scratch/${name}.mjs`,code);}
