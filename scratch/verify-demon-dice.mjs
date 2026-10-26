import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1280,height:1000}});
await page.routeWebSocket('**',socket=>socket.close());
await page.addInitScript(()=>{
 window.__tones=[];
 const original=AudioContext.prototype.createOscillator;
 AudioContext.prototype.createOscillator=function(...args){const oscillator=original.apply(this,args),set=oscillator.frequency.setValueAtTime.bind(oscillator.frequency);oscillator.frequency.setValueAtTime=(value,time)=>{window.__tones.push(value);return set(value,time);};return oscillator;};
});
await page.clock.install({time:new Date('2026-10-25T14:00:00Z')});
await page.clock.pauseAt(new Date('2026-10-25T14:00:01Z'));
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const key={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'};
async function rendered(){await expect(page.locator('.scene')).toHaveAttribute('data-ready','true',{timeout:120000});await page.clock.fastForward(50);}
async function finish(){const deadline=Number(await page.locator('.controls').getAttribute('data-ready-at'));const now=await page.evaluate(()=>Date.now());await page.clock.fastForward(Math.max(300,deadline-now+50));}
async function tap(direction){await page.getByRole('button',{name:`Move ${direction}`,exact:true}).click();await finish();await expect(page.locator('.scene')).toHaveAttribute('data-facing',direction);}
async function hold(direction){
 const before=await page.locator('.scene').getAttribute('aria-label');const wasRiding=before.includes('on a die');
 await page.keyboard.down(key[direction]);await page.clock.fastForward(300);
 await expect(page.locator('.scene')).toHaveAttribute('aria-label',wasRiding?/on a die/:/on the ground/);
 await page.clock.fastForward(300);await page.keyboard.up(key[direction]);await finish();
 await expect(page.locator('.scene')).toHaveAttribute('aria-label',wasRiding?/on the ground/:/on a die/);
}
try{
 await page.goto('http://127.0.0.1:5194/puzzles/devil-dice',{waitUntil:'domcontentloaded',timeout:120000});await rendered();
 await expect(page.getByRole('heading',{name:'Demon Dice',exact:true})).toBeVisible();
 await expect(page.getByRole('heading',{name:'The little rulebook'})).toHaveCount(0);
 await expect(page.getByRole('button',{name:/^(Climb up|Drop down)/})).toHaveCount(0);
 const tutorials=await page.evaluate(async()=>{const {puzzles}=await import('/src/lib/games/devilDiceTutorials.ts');return puzzles.map(p=>({id:p.id,solution:p.solution}));});
 for(let i=0;i<tutorials.length;i++){
  const tutorial=tutorials[i];await rendered();
  for(let j=0;j<tutorial.solution.length;j++){
   const action=tutorial.solution[j];
   if(typeof action==='object'&&'wait'in action){await page.clock.fastForward(action.wait);continue;}
   if(typeof action==='object')await hold(action.direction);else await tap(action);
   if(tutorial.id==='A1'&&j===0)await expect(page.locator('.badge')).toContainText('0 dice moves');
   if(tutorial.id==='B2'&&j===1){const rotation=await page.locator('.scene').getAttribute('data-riding-rotation');expect(rotation).not.toBe('0.0000,0.0000,0.0000,1.0000');await page.clock.fastForward(500);await expect(page.locator('.scene')).toHaveAttribute('data-riding-rotation',rotation);}
  }
  await page.clock.fastForward(7100);await expect(page.getByRole('status')).toContainText('All clear!');
  if(tutorial.id==='A2')await expect(page.locator('.badge')).toContainText('2 dice moves');
  console.log(tutorial.id,'cleared');
  if(i<tutorials.length-1)await page.getByRole('button',{name:'Next tutorial'}).click();
 }
 const tones=await page.evaluate(()=>window.__tones);for(const pitch of [310,105,210])expect(tones).toContain(pitch);
 await page.getByRole('button',{name:'Trial · endless',exact:true}).click();await rendered();await tap('right');await expect(page.getByTestId('trial-score')).toHaveText('4');
 await page.getByRole('button',{name:'Pause P',exact:true}).click();const stats=await page.locator('.trial-stats').innerText();await page.clock.fastForward(5000);expect(await page.locator('.trial-stats').innerText()).toBe(stats);
 await page.getByRole('button',{name:'Resume P',exact:true}).click();
 await page.setViewportSize({width:390,height:844});await page.clock.fastForward(50);if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error('Mobile overflow');
 await page.getByRole('button',{name:'Tutorials',exact:true}).click();await page.getByRole('button',{name:'Set A: Basic pushing',exact:true}).click();await rendered();
 await page.getByRole('button',{name:'Sound on',exact:true}).click();const mutedCount=await page.evaluate(()=>window.__tones.length);await tap('right');expect(await page.evaluate(()=>window.__tones.length)).toBe(mutedCount);
 await page.emulateMedia({reducedMotion:'reduce'});await tap('right');await expect(page.locator('.scene')).toHaveAttribute('data-animating','0');
 if(errors.length)throw new Error(errors.join('\n'));
 console.log('PASS: 25 tutorials, Demon Dice title, dice-only counter, 550ms holds, retained roll orientation, distinct movement sounds, mute, Trial, mobile, reduced motion, no runtime errors.');
}finally{await browser.close();}
