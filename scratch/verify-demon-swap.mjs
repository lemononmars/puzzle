import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});const page=await browser.newPage();await page.routeWebSocket('**',s=>s.close());await page.addInitScript(()=>{Math.random=()=>0;});await page.clock.install({time:new Date('2026-10-26T00:00:00Z')});await page.clock.pauseAt(new Date('2026-10-26T00:00:01Z'));
try{
 await page.goto('http://127.0.0.1:5194/puzzles/demon-dice/endless',{waitUntil:'domcontentloaded',timeout:120000});await page.getByRole('button',{name:'Start Endless'}).click();await expect(page.locator('.scene')).toHaveAttribute('data-ready','true',{timeout:120000});await page.clock.fastForward(50);
 for(let i=0;i<2;i++){await page.getByRole('button',{name:'Move up',exact:true}).click();await page.clock.fastForward(280);}await page.clock.fastForward(2500);
 await expect(page.locator('.scene')).toHaveAttribute('aria-label',/Regular: top 1,[^.]*column 2, row 1/);
 await page.getByRole('button',{name:'Move left',exact:true}).click();await page.clock.fastForward(280);
 await expect(page.locator('.scene')).toHaveAttribute('aria-label',/Character at column 2, row 1, on a die/);await expect(page.locator('.scene')).toHaveAttribute('aria-label',/Regular: top 1,[^.]*column 3, row 1/);
 console.log('PASS: rolling into a rising die swaps it into the previous square while the player rolls normally.');
}finally{await browser.close();}
