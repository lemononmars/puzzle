import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const root='http://127.0.0.1:5194/puzzles/demon-dice';const errors=[];
async function fresh(){const p=await browser.newPage({viewport:{width:1280,height:1000}});await p.routeWebSocket('**',s=>s.close());await p.addInitScript(()=>{Math.random=()=>0;});p.on('pageerror',e=>errors.push(e.message));await p.clock.install({time:new Date('2026-10-26T00:00:00Z')});await p.clock.pauseAt(new Date('2026-10-26T00:00:01Z'));return p;}
const page=await fresh();
const key={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'};
async function ready(p){await expect(p.locator('.scene')).toHaveAttribute('data-ready','true',{timeout:120000});await p.clock.fastForward(50);}
async function finish(p){const deadline=Number(await p.locator('.controls').getAttribute('data-ready-at')),now=await p.evaluate(()=>Date.now());await p.clock.fastForward(Math.max(280,deadline-now+30));}
async function tap(p,d){await p.getByRole('button',{name:`Move ${d}`,exact:true}).click();await finish(p);}
try{
 await page.goto(root+'/puzzles',{waitUntil:'domcontentloaded',timeout:120000});console.log('Puzzle route loaded');await ready(page);
 const puzzles=await page.evaluate(async()=>{const {challengePuzzles}=await import('/src/lib/games/demonDiceChallenges.ts');return challengePuzzles.map(p=>({id:p.id,solution:p.solution}));});
 for(let i=0;i<puzzles.length;i++){await ready(page);for(const a of puzzles[i].solution){if(typeof a==='object'&&'wait'in a){await page.clock.fastForward(a.wait);continue;}if(typeof a==='object'){await page.keyboard.down(key[a.direction]);await page.clock.fastForward(230);await page.keyboard.up(key[a.direction]);await finish(page);}else await tap(page,a);}await page.clock.fastForward(8000);await expect(page.getByRole('status')).toContainText('All clear!');console.log(puzzles[i].id,'cleared');if(i<puzzles.length-1)await page.getByRole('button',{name:'Next puzzle'}).click();}
 await page.close();
 const p=await fresh();await p.goto(root+'/endless',{waitUntil:'domcontentloaded',timeout:120000});console.log('Endless setup loaded');
 await expect(p.getByRole('button',{name:'Start Endless'})).toBeEnabled();await expect(p.locator('canvas')).toHaveCount(0);await p.getByLabel('Dice type').selectOption('wood');await p.getByRole('button',{name:'Start Endless'}).click();await ready(p);
 await expect(p.getByTestId('endless-level')).toHaveText('1');await expect(p.locator('.scene')).toHaveAttribute('data-warnings','1');await expect(p.locator('.arena-top,.game-status,.compass,.readout')).toHaveCount(0);
 await tap(p,'right');await expect(p.getByTestId('endless-score')).toHaveText('4');
 await p.getByRole('button',{name:'Pause',exact:true}).click();await p.clock.fastForward(6000);await expect(p.getByTestId('endless-score')).toHaveText('4');await p.getByRole('button',{name:'Resume game',exact:true}).click();
 await p.getByRole('button',{name:'End run',exact:true}).click();await expect(p.locator('.game-root')).toHaveAttribute('data-phase','setup');await expect(p.getByLabel('Dice type')).toHaveValue('wood');await p.getByRole('button',{name:'View summary',exact:true}).click();await expect(p.getByRole('region',{name:'Run summary'})).toBeVisible();await p.getByRole('button',{name:'Retry',exact:true}).click();await ready(p);console.log('Settings, HUD, pause, end, summary, retry passed');
 let sawRisingFull=false;
 for(let i=0;i<450&&(await p.locator('.game-root').getAttribute('data-phase'))==='playing';i++){await p.clock.fastForward(750);const label=await p.locator('.scene').getAttribute('aria-label');if((label.match(/(?:Regular|Wood|Ice|Stone|Metal):/g)||[]).length===36&&(await p.locator('.game-root').getAttribute('data-phase'))==='playing')sawRisingFull=true;}
 expect(sawRisingFull).toBe(true);await expect(p.locator('.game-root')).toHaveAttribute('data-phase','losing');await expect(p.getByRole('status')).toContainText('Oh, dice!');await p.clock.fastForward(600);await expect(p.locator('.game-root')).toHaveAttribute('data-phase','losing');await p.clock.fastForward(1300);await expect(p.locator('.game-root')).toHaveAttribute('data-phase','summary');await expect(p.getByRole('heading',{name:'Packed to the pips!'})).toBeVisible();
 await p.getByRole('button',{name:'Back to settings',exact:true}).click();await expect(p.getByLabel('Dice type')).toHaveValue('wood');await p.setViewportSize({width:390,height:844});if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error('Mobile overflow');
 if(errors.length)throw new Error(errors.join('\n'));console.log('PASS: five challenge solutions, Endless setup, score/level HUD, warnings, pause/end, retained settings, full rising grace period, losing animation, summary and retry/back; no runtime errors.');
}finally{await browser.close();}
