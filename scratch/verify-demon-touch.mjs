import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const page=await context.newPage();
await page.routeWebSocket('**',s=>s.close());await page.clock.install({time:new Date('2026-10-25T14:00:00Z')});await page.clock.pauseAt(new Date('2026-10-25T14:00:01Z'));
try{
 await page.goto('http://127.0.0.1:5194/puzzles/devil-dice',{waitUntil:'domcontentloaded',timeout:120000});
 await expect(page.locator('.scene')).toHaveAttribute('data-ready','true',{timeout:120000});await page.clock.fastForward(50);
 await page.getByRole('button',{name:'Set B: Dice riding',exact:true}).click();await page.getByRole('button',{name:/B5 Push, climb, roll/}).click();await expect(page.locator('.scene')).toHaveAttribute('data-ready','true',{timeout:120000});await page.clock.fastForward(50);
 const arrow=page.getByRole('button',{name:'Move right',exact:true});for(let i=0;i<2;i++){await arrow.click();await page.clock.fastForward(300);}await page.clock.fastForward(3100);
 await arrow.scrollIntoViewIfNeeded();const b=await arrow.boundingBox();const cdp=await context.newCDPSession(page);
 const start=()=>cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:b.x+b.width/2,y:b.y+b.height/2}]});
 const stop=()=>cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await start();await page.clock.fastForward(250);await stop();await page.clock.fastForward(300);
 await expect(page.locator('.scene')).toHaveAttribute('aria-label',/on the ground/);
 await start();await page.clock.fastForward(600);await stop();await expect(page.locator('.scene')).toHaveAttribute('aria-label',/on a die/);
 const label=await page.locator('.scene').getAttribute('aria-label');await page.clock.fastForward(500);await expect(page.locator('.scene')).toHaveAttribute('aria-label',label);
 console.log('PASS: real touch input, short hold canceled, full hold climbed, release stopped movement.');
}finally{await browser.close();}
