import { chromium, expect } from '@playwright/test';
const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:1280,height:960}});
const errors=[]; page.on('pageerror', e=>errors.push(e.message));
// Concurrent local servers share generated files; isolate verification from HMR reloads.
await page.routeWebSocket('**', socket => socket.close());
try {
 await page.goto('http://127.0.0.1:5194/puzzles/devil-dice',{waitUntil:'domcontentloaded',timeout:120000});
 await expect(page.getByRole('heading',{name:'Devil Dice',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Move right',exact:true})).toBeEnabled({timeout:60000});
 await page.screenshot({path:'scratch/devil-dice-desktop.png',fullPage:true});
 const solutions=[['right','right'],['right'],['right'],['right','right'],['right','down','down','right','right']];
 for(let i=0;i<5;i++) {
  console.log('Checking puzzle',i+1);
  for(const direction of solutions[i]) await page.getByRole('button',{name:`Move ${direction}`,exact:true}).click();
  await expect(page.getByRole('status')).toContainText('All clear!',{timeout:5000});
  if(i<4) await page.getByRole('button',{name:'Next puzzle'}).click();
 }
 await page.getByRole('button',{name:/A gentle push/}).click();
 await page.locator('h1').click();
 await page.keyboard.press('ArrowRight');
 await expect(page.getByText('1 moves · 2 dice left',{exact:true})).toBeVisible();
 await page.keyboard.press('z');
 await expect(page.getByText('0 moves · 2 dice left',{exact:true})).toBeVisible();
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'scratch/devil-dice-mobile.png',fullPage:true});
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)) throw new Error('Mobile overflow');
 await expect(page.getByRole('button',{name:'Climb up'})).toBeDisabled();
 await page.locator('h1').click(); await page.keyboard.press('Space');
 await expect(page.getByRole('status')).toContainText('sink halfway');
 await page.getByRole('button',{name:/A different face/}).click();
 await page.getByRole('button',{name:'Move right',exact:true}).click();
 const drop=page.getByRole('button',{name:'Drop down'});
 await expect(drop).toBeEnabled(); await drop.click();
 await page.getByRole('button',{name:'Move down',exact:true}).click();
 await expect(page.getByRole('img',{name:/Puzzle board/})).toHaveAttribute('aria-label',/on the ground/);
 if(errors.length) throw new Error(errors.join('\n'));
 console.log('PASS: all five puzzles, sink timers, level progression, keyboard movement, undo, touch controls, half-sunk transitions, mobile overflow, no runtime errors.');
} finally {await browser.close();}
