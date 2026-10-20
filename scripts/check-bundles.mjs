import fs from 'node:fs/promises';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
const root='.svelte-kit/output/client';
async function walk(dir) {return (await fs.readdir(dir,{withFileTypes:true})).flatMap(entry=>entry.isDirectory()?[]:[path.join(dir,entry.name)]).concat(...await Promise.all((await fs.readdir(dir,{withFileTypes:true})).filter(entry=>entry.isDirectory()).map(entry=>walk(path.join(dir,entry.name)))));}
const files=await walk(root);
const bundles=await Promise.all(files.filter(file=>file.endsWith('.js')).map(async file=>{const data=await fs.readFile(file);return {file:path.relative(root,file).replaceAll('\\','/'),bytes:data.length,gzip:gzipSync(data).length};}));
bundles.sort((a,b)=>b.gzip-a.gzip);
const report={totalJsBytes:bundles.reduce((sum,file)=>sum+file.bytes,0),totalJsGzipBytes:bundles.reduce((sum,file)=>sum+file.gzip,0),largestChunkGzipBytes:bundles[0]?.gzip??0,bundles};
await fs.mkdir('artifacts',{recursive:true});await fs.writeFile('artifacts/bundles.json',JSON.stringify(report,null,2));
console.table(bundles.slice(0,10).map(file=>({...file,bytes:Math.round(file.bytes/1024)+' KiB',gzip:Math.round(file.gzip/1024)+' KiB'})));
console.log(`All client JavaScript: ${(report.totalJsGzipBytes/1024).toFixed(0)} KiB gzip. Report: artifacts/bundles.json`);
const budget=JSON.parse(await fs.readFile('bundle-budget.json','utf8'));
for(const [key,max] of Object.entries(budget)) if(typeof max==='number' && report[key]>max) {console.error(`Bundle budget exceeded: ${key}=${report[key]} > ${max}`);process.exitCode=1;}
