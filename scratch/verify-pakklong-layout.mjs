import { chromium } from '@playwright/test';
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1600,height:1000}});
page.on('pageerror',e=>console.log('ERROR',e.message));
await page.goto('http://localhost:5173/boardgame/pakklongboard');await page.getByRole('button',{name:'Create a new room'}).click();await page.waitForURL(/pakklongboard\/.+/);await page.getByRole('button',{name:'Start Game!'}).click();await page.getByRole('heading',{name:'Marketplace Bazaar'}).waitFor();
const box=await page.getByRole('heading',{name:'Marketplace Bazaar'}).evaluate(el=>{const market=el.parentElement;const shell=market.closest('.h-28');const m=market.getBoundingClientRect();const s=shell?.getBoundingClientRect();return{market:{x:m.x,y:m.y,width:m.width,height:m.height},canvas:s?{y:s.y,bottom:s.bottom,height:s.height}:null,pageWidth:innerWidth,documentWidth:document.documentElement.scrollWidth}});
console.log(JSON.stringify(box));console.log('BODY',(await page.locator('main').innerText()).slice(0,2000));await page.screenshot({path:'scratch/pakklong-before.png',fullPage:true});
const fail=box.market.y<(box.canvas?.y??0)||box.market.width<1000;console.log(fail?'FAIL board overflows its canvas or is constrained on desktop':'PASS');await browser.close();process.exitCode=fail?1:0;
