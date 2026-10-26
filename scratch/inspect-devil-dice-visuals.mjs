import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1280,height:1000}});
await page.routeWebSocket('**',s=>s.close());
const errors=[];page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:5194/puzzles/devil-dice',{waitUntil:'domcontentloaded',timeout:120000});
 await expect(page.locator('.scene')).toHaveAttribute('data-ready','true',{timeout:120000});
 await page.waitForTimeout(750);
 await page.screenshot({path:'scratch/devil-dice-final-desktop.png',fullPage:true});
 await page.getByRole('button',{name:'Move right',exact:true}).click();
 await expect(page.locator('.scene')).toHaveAttribute('data-facing','right');
 await page.waitForTimeout(400);
 await page.getByRole('button',{name:'Move right',exact:true}).click();
 await page.waitForTimeout(3000);
 await page.screenshot({path:'scratch/devil-dice-final-sinking.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:'Set B: Dice riding',exact:true}).click();
 await expect(page.locator('.scene')).toHaveAttribute('data-ready','true');await page.waitForTimeout(400);
 await page.screenshot({path:'scratch/devil-dice-final-mobile.png',fullPage:true});
 await page.getByRole('button',{name:/B2 A step closer/}).click();
 await expect(page.locator('.scene')).toHaveAttribute('data-ready','true');
 for(const direction of ['right','up','left']){
  const button=page.getByRole('button',{name:`Move ${direction}`,exact:true});
  await expect(button).toBeEnabled();await button.click();
  await expect(page.locator('.scene')).toHaveAttribute('data-facing',direction);
  await page.waitForTimeout(320);
 }
 await expect(page.getByRole('status')).toContainText('All clear!',{timeout:8000});
 console.log('PASS: B2 adjacent-dice walk, roll, facing, and clear.');
 console.log(JSON.stringify({errors}));
}finally{await browser.close();}
