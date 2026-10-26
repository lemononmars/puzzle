import { chromium } from '@playwright/test';
const browser=await chromium.launch({headless:true}); const page=await browser.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:5193/boardgame/pakklongdice');await page.getByRole('button',{name:'Create a new room'}).click();
await page.waitForURL(/pakklongdice\/.+/);await page.waitForTimeout(1200);console.log('Room route',new URL(page.url()).pathname);await page.getByRole('button',{name:'Start Game!'}).click();await page.waitForTimeout(3200);console.log('Loaded dice images',await page.locator('img').evaluateAll(images=>images.filter(img=>img.src.includes('/boardgame/pakklongdice/')).map(img=>({loaded:img.complete&&img.naturalWidth>0}))));console.log('Body', (await page.locator('main').innerText()).slice(0,1600));
for(const width of [1280,390]){await page.setViewportSize({width,height:850});await page.goto('http://localhost:5193/boardgame');await page.getByRole('heading',{name:'Board games',exact:true}).waitFor();await page.screenshot({path:`scratch/boardgame-${width}.png`,fullPage:true});}
console.log('Errors',JSON.stringify(errors));await browser.close();
