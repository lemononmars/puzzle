import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1280,height:1000}});
await page.routeWebSocket('**',socket=>socket.close());
await page.clock.install({time:new Date('2026-10-25T14:00:00Z')});
await page.clock.pauseAt(new Date('2026-10-25T14:00:01Z'));
const errors=[];page.on('pageerror',e=>errors.push(e.message));
async function rendered(){await expect(page.locator('.scene')).toHaveAttribute('data-ready','true',{timeout:120000});await page.clock.fastForward(50);}
async function move(direction){const button=page.getByRole('button',{name:`Move ${direction}`,exact:true});await expect(button).toBeEnabled();await button.click();await page.clock.fastForward(320);await expect(page.locator('.scene')).toHaveAttribute('data-facing',direction);}
try{
 await page.goto('http://127.0.0.1:5194/puzzles/devil-dice',{waitUntil:'domcontentloaded',timeout:120000});
 await rendered();
 const tutorials=await page.evaluate(async()=>{const {puzzles}=await import('/src/lib/games/devilDiceTutorials.ts');return puzzles.map(p=>({id:p.id,solution:p.solution}));});
 expect(tutorials).toHaveLength(25);
 await expect(page.getByRole('group',{name:'Tutorial sets'}).getByRole('button')).toHaveCount(5);
 await expect(page.locator('.levels button')).toHaveCount(5);
 await expect(page.locator('.face-key span')).toHaveCount(6);
 await page.screenshot({path:'scratch/devil-dice-tutorials-desktop.png',fullPage:true});
 for(let i=0;i<tutorials.length;i++){
  const tutorial=tutorials[i];await rendered();
  for(const action of tutorial.solution){
   if(typeof action==='object'&&'wait'in action){await page.clock.fastForward(action.wait);continue;}
   if(typeof action==='object'){const transfer=page.getByRole('button',{name:/^(Drop down|Climb up)/});await expect(transfer).toBeEnabled();await transfer.click();}
   await move(typeof action==='string'?action:action.direction);
  }
  if(tutorial.id==='A2'){await page.clock.fastForward(2000);await page.screenshot({path:'scratch/devil-dice-sinking.png',fullPage:true});}
  await page.clock.fastForward(7100);
  await expect(page.getByRole('status')).toContainText('All clear!');
  console.log(tutorial.id,'cleared');
  if(i<tutorials.length-1)await page.getByRole('button',{name:'Next tutorial'}).click();
 }
 await expect(page.getByRole('status')).toContainText('all 25 tutorials');
 await page.getByRole('button',{name:'Trial · endless',exact:true}).click();await rendered();
 await move('right');await expect(page.getByTestId('trial-score')).toHaveText('4');
 await page.clock.fastForward(3100);
 await page.getByRole('button',{name:'Pause P',exact:true}).click();
 const stats=await page.locator('.trial-stats').innerText();await page.clock.fastForward(5000);expect(await page.locator('.trial-stats').innerText()).toBe(stats);
 await page.getByRole('button',{name:'Resume P',exact:true}).click();
 await page.setViewportSize({width:390,height:844});await page.clock.fastForward(50);
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error('Mobile overflow');
 await page.screenshot({path:'scratch/devil-dice-tutorials-mobile.png',fullPage:true});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.getByRole('button',{name:'Tutorials',exact:true}).click();
 await page.getByRole('button',{name:'Set B: Dice riding',exact:true}).click();await rendered();await move('right');
 await expect(page.locator('.scene')).toHaveAttribute('data-animating','0');
 if(errors.length)throw new Error(errors.join('\n'));
 console.log('PASS: all 25 UI solutions, A–E navigation, facing, color key, timed drop/climb, Trial, pause/resume, mobile, reduced motion, no runtime errors.');
}finally{await browser.close();}
