import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1280,height:1000}});await page.routeWebSocket('**',s=>s.close());
const root='http://127.0.0.1:5194/puzzles/demon-dice',errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(root,{waitUntil:'networkidle',timeout:120000});await page.screenshot({path:'scratch/demon-modes-landing-desktop.png',fullPage:true});
 await page.getByRole('link',{name:'Learn to play'}).click();await expect(page).toHaveURL(root+'/tutorials');await expect(page.locator('.scene')).toHaveAttribute('data-ready','true',{timeout:120000});
 await page.getByRole('link',{name:'All modes'}).click();await expect(page).toHaveURL(root);await expect(page.getByRole('link',{name:'Choose a puzzle'})).toBeVisible();
 await page.getByRole('link',{name:'Set up a run'}).click();await expect(page).toHaveURL(root+'/endless');await expect(page.getByRole('button',{name:'Start Endless'})).toBeEnabled();await page.screenshot({path:'scratch/demon-modes-settings-desktop.png',fullPage:true});
 await page.getByRole('button',{name:'Start Endless'}).click();await expect(page.locator('.scene')).toHaveAttribute('data-ready','true');await page.waitForTimeout(200);await page.screenshot({path:'scratch/demon-modes-endless-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(200);await page.screenshot({path:'scratch/demon-modes-endless-mobile.png',fullPage:true});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error('Mobile game overflow');
 await page.getByRole('button',{name:'End run',exact:true}).click();await expect(page.getByRole('button',{name:'Start Endless'})).toBeVisible();await page.screenshot({path:'scratch/demon-modes-settings-mobile.png',fullPage:true});
 await page.getByRole('link',{name:'All modes'}).click();await expect(page).toHaveURL(root);await page.screenshot({path:'scratch/demon-modes-landing-mobile.png',fullPage:true});
 if(errors.length)throw new Error(errors.join('\n'));
 console.log('PASS: real client navigation, landing/setup/game on desktop and mobile, end returns to settings, no runtime errors.');
}finally{await browser.close();}
