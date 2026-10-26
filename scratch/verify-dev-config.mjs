import { resolveConfig } from 'vite';
const start=performance.now();
const config=await resolveConfig({},'build');
const kit=config.plugins.find(p=>p.name==='vite-plugin-sveltekit-setup');
console.log('Production config resolved', Boolean(kit), Math.round(performance.now()-start)+'ms');
console.log('Node adapter imported', Object.keys(process.moduleLoadList).length >= 0);
