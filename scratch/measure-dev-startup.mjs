import { spawn } from 'node:child_process';
import { performance } from 'node:perf_hooks';
const port=process.argv[2]||'5195';
const start=performance.now();let output='';
const child=spawn(process.execPath,['node_modules/vite/bin/vite.js',`--port=${port}`, ...(process.argv[3] ? ['--configLoader', process.argv[3]] : [])],{cwd:process.cwd(),env:{...process.env,NO_COLOR:'1'},windowsHide:true});
const timeout=setTimeout(()=>{console.log('FAIL startup exceeded 60 seconds');child.kill();process.exitCode=1},60000);
const handle=chunk=>{const text=chunk.toString();output+=text;process.stdout.write(text);if(/Local:/.test(output)){const ms=Math.round(performance.now()-start);console.log(JSON.stringify({startupMs:ms,pass:ms<5000}));clearTimeout(timeout);child.kill();process.exitCode=ms<5000?0:1;}};
child.stdout.on('data',handle);child.stderr.on('data',handle);
child.on('exit',()=>clearTimeout(timeout));
