import { chromium } from '@playwright/test';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage();
const errors=[]; page.on('pageerror',e=>errors.push(e.message));
for(const width of [1280,390]){
 await page.setViewportSize({width,height:850});
 for(const route of ['/boardgame','/boardgame/wordwars','/boardgame/settings','/boardgame/pakklongdice','/boardgame/pakklongboard','/boardgame/spacespy']){
  const response=await page.goto('http://localhost:5193'+route);await page.waitForTimeout(800);
  console.log(width,route,response.status(),await page.locator('h1').first().textContent(),await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
 }
 await page.goto('http://localhost:5193/boardgame');await page.screenshot({path:`scratch/boardgame-${width}.png`,fullPage:true});
}
console.log('PAGE ERRORS',JSON.stringify(errors));await browser.close();
