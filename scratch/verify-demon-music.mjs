import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-audio-output']});const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.routeWebSocket('**',s=>s.close());
await page.addInitScript(()=>{window.__music=[];const Native=window.Audio;window.Audio=function(src){const track=new Native(src);window.__music.push(track);return track;};window.Audio.prototype=Native.prototype;});
const state=()=>page.evaluate(()=>{const a=window.__music.at(-1);return a?{src:a.src,paused:a.paused,muted:a.muted,time:a.currentTime,duration:a.duration,loop:a.loop,error:a.error?.message}:null;});
try{
 await page.goto('http://127.0.0.1:5194/puzzles/demon-dice/tutorials',{timeout:120000});await expect(page.locator('.scene')).toHaveAttribute('data-ready','true',{timeout:120000});
 expect((await state()).paused).toBe(true);await page.getByRole('button',{name:'Move right',exact:true}).click();await expect.poll(async()=>(await state()).time).toBeGreaterThan(.1);expect((await state()).src).toContain('tutorial-garden.mp3');expect((await state()).loop).toBe(true);
 await page.getByRole('button',{name:'Sound on',exact:true}).click();await expect.poll(async()=>(await state()).paused).toBe(true);await page.getByRole('button',{name:'Sound off',exact:true}).click();await expect.poll(async()=>(await state()).paused).toBe(false);
 await page.evaluate(()=>{const a=window.__music.at(-1);a.currentTime=a.duration-.2;});await page.waitForTimeout(650);expect((await state()).time).toBeLessThan(2);
 await page.getByRole('combobox',{name:'Choose tutorial'}).selectOption('1');expect((await state()).paused).toBe(false);expect(await page.evaluate(()=>window.__music.length)).toBe(1);console.log('PASS tutorial music, mute/resume, actual loop, level continuity');
 await page.getByRole('link',{name:'All modes',exact:false}).first().click();await expect.poll(async()=>(await state()).paused).toBe(true);
 await page.goto('http://127.0.0.1:5194/puzzles/demon-dice/endless',{timeout:120000});await expect.poll(state).not.toBeNull();expect((await state()).paused).toBe(true);await page.getByRole('button',{name:'Start Endless',exact:true}).click();await expect.poll(async()=>(await state()).time).toBeGreaterThan(.1);expect((await state()).src).toContain('endless-twilight.mp3');
 await page.getByRole('button',{name:'Pause',exact:true}).click();await expect.poll(async()=>(await state()).paused).toBe(true);await page.getByRole('button',{name:'Resume',exact:true}).click();await expect.poll(async()=>(await state()).paused).toBe(false);
 await page.getByRole('button',{name:'End run',exact:true}).click();await expect.poll(async()=>(await state()).paused).toBe(true);
 if(errors.length)throw Error(errors.join('\n'));console.log('PASS Endless distinct track, start/pause/resume/end; no page errors');
}catch(e){console.log('AUDIO STATE',await state(),errors);throw e;}finally{await browser.close();}



