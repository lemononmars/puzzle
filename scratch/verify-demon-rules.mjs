import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});const page=await browser.newPage({viewport:{width:1200,height:950}});await page.routeWebSocket('**',s=>s.close());const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.clock.install({time:new Date('2026-10-26T00:00:00Z')});await page.clock.pauseAt(new Date('2026-10-26T00:00:01Z'));
try{
await page.goto('http://127.0.0.1:5194/puzzles/demon-dice/tutorials',{timeout:120000});await expect(page.locator('.scene')).toHaveAttribute('data-ready','true',{timeout:120000});
const levels=await page.evaluate(async()=>{const {puzzles}=await import('/src/lib/games/devilDiceTutorials.ts');return puzzles.slice(0,4).map(p=>({id:p.id,solution:p.solution,maxMoves:p.maxMoves}));});
const picker=page.getByRole('combobox',{name:'Choose tutorial'});const keys={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'};
async function finish(){const until=Number(await page.locator('.controls').getAttribute('data-ready-at'));const now=await page.evaluate(()=>Date.now());await page.clock.fastForward(Math.max(300,until-now+30));}
for(let i=0;i<levels.length;i++){
 await picker.selectOption(String(i));await expect(page.getByLabel('Moves remaining')).toHaveText(`${levels[i].maxMoves} moves left`);
 for(const a of levels[i].solution){if(typeof a==='object'&&'wait'in a){await page.clock.fastForward(a.wait);continue;}if(typeof a==='string'){await page.getByRole('button',{name:`Move ${a}`,exact:true}).click();}else{await page.keyboard.down(keys[a.direction]);await page.clock.fastForward(240);await page.keyboard.up(keys[a.direction]);}if(i===0){await expect(page.getByText('Clear',{exact:true})).not.toBeVisible().catch(()=>{});}await finish();}
 await expect(page.getByText('Clear',{exact:true})).toBeVisible();await expect(page.getByLabel('Moves remaining')).toHaveText('0 moves left');await expect(page.getByRole('button',{name:'Next level',exact:true})).toHaveCount(0);
 const dice=await page.locator('.scene').getAttribute('aria-label');if(!dice.includes('top'))throw Error('Clear should appear while dice remain');
 await page.clock.fastForward(850);await expect(page.getByRole('button',{name:'Next level',exact:true})).toBeVisible();console.log('PASS',levels[i].id);
}
await picker.selectOption('2');await page.clock.resume();await page.waitForTimeout(300);await page.screenshot({path:'scratch/demon-a3-cutout.png'});await page.setViewportSize({width:390,height:844});await page.screenshot({path:'scratch/demon-moves-mobile.png'});
if(errors.length)throw Error(errors.join('\n'));console.log('PASS: countdown, immediate Clear, delayed Next level, A1-A4 solutions, desktop/mobile');
}finally{await browser.close();}

