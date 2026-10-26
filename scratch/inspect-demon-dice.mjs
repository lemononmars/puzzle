import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1280,height:1000}});await page.routeWebSocket('**',s=>s.close());
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:5194/puzzles/devil-dice',{waitUntil:'domcontentloaded',timeout:120000});
 const ready=async()=>{await expect(page.locator('.scene')).toHaveAttribute('data-ready','true',{timeout:120000});await page.waitForTimeout(200);};
 await ready();await page.screenshot({path:'scratch/demon-dice-desktop.png',fullPage:true});
 await page.getByRole('button',{name:'Set C: Wood',exact:true}).click();await ready();await page.screenshot({path:'scratch/demon-dice-wood.png',fullPage:true});
 await page.getByRole('button',{name:'Move right',exact:true}).click();await page.waitForTimeout(2000);await page.screenshot({path:'scratch/demon-dice-fading.png',fullPage:true});
 await page.getByRole('button',{name:'Set D: Ice',exact:true}).click();await ready();
 await page.getByRole('button',{name:'Move right',exact:true}).click();await page.waitForTimeout(350);await expect(page.locator('.controls')).toHaveAttribute('aria-busy','true');await page.waitForTimeout(900);await expect(page.locator('.controls')).toHaveAttribute('aria-busy','false');
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Set E: Stone & metal',exact:true}).click();await ready();await page.screenshot({path:'scratch/demon-dice-mobile.png',fullPage:true});
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error('Mobile overflow');
 if(errors.length)throw new Error(errors.join('\n'));
 console.log('PASS: live 3D visuals, slow ice cooldown, mobile layout, no runtime errors.');
}finally{await browser.close();}
