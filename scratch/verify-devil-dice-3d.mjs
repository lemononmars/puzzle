import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1280,height:1000}});
await page.routeWebSocket('**',socket=>socket.close());
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const move=async direction=>{const button=page.getByRole('button',{name:`Move ${direction}`,exact:true});await expect(button).toBeEnabled();await button.click();};
try{
 await page.goto('http://127.0.0.1:5194/puzzles/devil-dice',{waitUntil:'domcontentloaded',timeout:120000});
 await expect(page.locator('.scene')).toHaveAttribute('data-ready','true',{timeout:120000});
 await expect(page.locator('canvas')).toBeVisible();
 await page.screenshot({path:'scratch/devil-dice-3d-desktop.png',fullPage:true});
 const solutions=[['right','right'],['right'],['right'],['right','right'],['right','down','down','right','right']];
 for(let i=0;i<5;i++){
  await expect(page.locator('.scene')).toHaveAttribute('data-ready','true');
  for(const direction of solutions[i])await move(direction);
  await expect(page.getByRole('status')).toContainText('All clear!',{timeout:7000});
  console.log('Puzzle',i+1,'cleared');
  if(i<4)await page.getByRole('button',{name:'Next puzzle'}).click();
 }
 await page.getByRole('button',{name:'Trial · endless',exact:true}).click();
 await expect(page.locator('.scene')).toHaveAttribute('data-ready','true');
 await expect(page.getByTestId('trial-score')).toHaveText('0');
 await move('right');
 await expect(page.getByTestId('trial-score')).toHaveText('4');
 await page.getByRole('button',{name:'Pause P',exact:true}).click();
 const count=await page.locator('.trial-stats').innerText();
 await page.waitForTimeout(3300);
 expect(await page.locator('.trial-stats').innerText()).toBe(count);
 await page.getByRole('button',{name:'Resume P',exact:true}).click();
 await expect(page.getByRole('status')).not.toContainText('Paused');
 await expect.poll(()=>page.locator('.badge').innerText(),{timeout:6000}).not.toContain('8 dice left');
 await page.screenshot({path:'scratch/devil-dice-trial-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'scratch/devil-dice-trial-mobile.png',fullPage:true});
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error('Mobile overflow');
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.getByRole('button',{name:'Puzzles',exact:true}).click();
 await expect(page.locator('.scene')).toHaveAttribute('data-ready','true');
 await page.getByRole('button',{name:/A different face/}).click();
 await expect(page.locator('.scene')).toHaveAttribute('data-ready','true');
 await move('right');
 await expect(page.locator('.scene')).toHaveAttribute('data-animating','0');
 if(errors.length)throw new Error(errors.join('\n'));
 console.log('PASS: WebGL renderer, five puzzles, Trial scoring, spawns, pause/resume, responsive layout, reduced motion; no runtime errors.');
}finally{await browser.close();}
