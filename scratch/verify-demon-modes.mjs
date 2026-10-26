import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1280,height:1000}});await page.routeWebSocket('**',s=>s.close());
await page.addInitScript(()=>{Math.random=()=>0;});
await page.clock.install({time:new Date('2026-10-26T00:00:00Z')});await page.clock.pauseAt(new Date('2026-10-26T00:00:01Z'));
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const root='http://127.0.0.1:5194/puzzles/demon-dice',key={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'};
async function rendered(){await expect(page.locator('.scene')).toHaveAttribute('data-ready','true',{timeout:120000});await page.clock.fastForward(50);}
async function finish(){const until=Number(await page.locator('.controls').getAttribute('data-ready-at')),now=await page.evaluate(()=>Date.now());await page.clock.fastForward(Math.max(280,until-now+30));}
async function tap(d){await page.getByRole('button',{name:`Move ${d}`,exact:true}).click();await finish();}
async function hold(d){await page.keyboard.down(key[d]);await page.clock.fastForward(230);await page.keyboard.up(key[d]);await finish();}
async function solve(entry){for(const action of entry.solution){if(typeof action==='object'&&'wait'in action){await page.clock.fastForward(action.wait);continue;}if(typeof action==='object')await hold(action.direction);else await tap(action);}await page.clock.fastForward(8000);await expect(page.getByRole('status')).toContainText('All clear!');}
try{
 await page.goto('http://127.0.0.1:5194/puzzles/devil-dice',{waitUntil:'domcontentloaded',timeout:120000});await expect(page).toHaveURL(root);
 await expect(page.getByRole('link',{name:'Devil Dice',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Battle · Coming soon'})).toBeDisabled();
 await page.getByRole('link',{name:'Learn to play'}).click();await rendered();
 const tutorials=await page.evaluate(async()=>{const {puzzles}=await import('/src/lib/games/devilDiceTutorials.ts');return puzzles.map(p=>({id:p.id,solution:p.solution}));});
 for(let i=0;i<tutorials.length;i++){await rendered();await solve(tutorials[i]);console.log(tutorials[i].id,'cleared');if(i<tutorials.length-1)await page.getByRole('button',{name:'Next tutorial'}).click();}
 await page.getByRole('button',{name:'Set D: Ice',exact:true}).click();await rendered();
 await page.getByRole('button',{name:'Move right',exact:true}).click();await page.clock.fastForward(300);await expect(page.locator('.controls')).toHaveAttribute('aria-busy','false');expect(Number(await page.locator('.scene').getAttribute('data-animating'))).toBeGreaterThan(0);
 await tap('up');await expect(page.locator('.scene')).toHaveAttribute('aria-label',/row 2, on the ground/);expect(Number(await page.locator('.scene').getAttribute('data-animating'))).toBeGreaterThan(0);console.log('Moved while ice was sliding');
 await page.goto(root+'/puzzles',{waitUntil:'domcontentloaded'});await rendered();
 const challenges=await page.evaluate(async()=>{const {challengePuzzles}=await import('/src/lib/games/demonDiceChallenges.ts');return challengePuzzles.map(p=>({id:p.id,solution:p.solution}));});
 for(let i=0;i<challenges.length;i++){await rendered();await solve(challenges[i]);console.log(challenges[i].id,'cleared');if(i<challenges.length-1)await page.getByRole('button',{name:'Next puzzle'}).click();}
 await page.goto(root+'/endless',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.game-root')).toHaveAttribute('data-phase','setup');await expect(page.locator('canvas')).toHaveCount(0);
 await page.getByLabel('Dice type').selectOption('wood');await page.getByRole('button',{name:'Start Endless'}).click();await rendered();
 await expect(page.getByTestId('endless-level')).toHaveText('1');await expect(page.locator('.scene')).toHaveAttribute('data-warnings','1');
 await expect(page.locator('.arena-top,.game-status,.compass,.readout')).toHaveCount(0);await expect(page.getByText('Trial settings',{exact:true})).toHaveCount(0);await expect(page.getByText('Next die',{exact:true})).toHaveCount(0);
 await tap('right');await expect(page.getByTestId('endless-score')).toHaveText('4');
 await page.getByRole('button',{name:'Pause',exact:true}).click();const before=await page.getByTestId('endless-score').innerText();await page.clock.fastForward(6000);expect(await page.getByTestId('endless-score').innerText()).toBe(before);await page.getByRole('button',{name:'Resume game',exact:true}).click();
 await page.getByRole('button',{name:'End run',exact:true}).click();await expect(page.locator('.game-root')).toHaveAttribute('data-phase','setup');await expect(page.getByLabel('Dice type')).toHaveValue('wood');
 await page.getByRole('button',{name:'View summary',exact:true}).click();await expect(page.getByRole('region',{name:'Run summary'})).toBeVisible();await page.getByRole('button',{name:'Retry',exact:true}).click();await rendered();
 let sawFullWhileRising=false;
 for(let i=0;i<450&&(await page.locator('.game-root').getAttribute('data-phase'))==='playing';i++){
  await page.clock.fastForward(750);const label=await page.locator('.scene').getAttribute('aria-label');const count=(label.match(/(?:Regular|Wood|Ice|Stone|Metal):/g)||[]).length;
  if(count===36&&(await page.locator('.game-root').getAttribute('data-phase'))==='playing')sawFullWhileRising=true;
 }
 expect(sawFullWhileRising).toBe(true);await expect(page.locator('.game-root')).toHaveAttribute('data-phase','losing');await expect(page.getByRole('status')).toContainText('Oh, dice!');
 await page.clock.fastForward(600);await expect(page.locator('.game-root')).toHaveAttribute('data-phase','losing');await page.clock.fastForward(1300);await expect(page.locator('.game-root')).toHaveAttribute('data-phase','summary');await expect(page.getByRole('heading',{name:'Packed to the pips!'})).toBeVisible();
 await page.getByRole('button',{name:'Back to settings',exact:true}).click();await expect(page.getByLabel('Dice type')).toHaveValue('wood');
 await page.setViewportSize({width:390,height:844});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error('Mobile settings overflow');
 if(errors.length)throw new Error(errors.join('\n'));
 console.log('PASS: old-route redirect, mode landing and attribution, 25 tutorials, 5 puzzles, free ice movement, setup and settings retention, level HUD, warnings, pause, end, delayed full-field loss, animation, summary, retry/back, mobile; no runtime errors.');
}finally{await browser.close();}
