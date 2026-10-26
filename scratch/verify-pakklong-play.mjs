import { chromium, expect } from '@playwright/test';
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1600,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
try {
 await page.goto('http://localhost:5173/boardgame/pakklongboard');await page.getByRole('button',{name:'Create a new room'}).click();await page.waitForURL(/pakklongboard\/.+/);await page.getByRole('button',{name:'Start Game!'}).click();await page.getByText('Turn 1 · Planning',{exact:true}).waitFor();
 const geometry=await page.getByTestId('pakklong-market').evaluate(el=>{const r=el.getBoundingClientRect();const t=el.closest('[data-testid="pakklong-table"]').getBoundingClientRect();return{marketY:r.y,marketBottom:r.bottom,tableY:t.y,tableWidth:t.width,viewport:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth}});console.log('DESKTOP',JSON.stringify(geometry));expect(geometry.marketY).toBeGreaterThan(geometry.tableY);expect(geometry.tableWidth).toBeGreaterThan(1500);expect(geometry.overflow).toBe(false);
 await page.screenshot({path:'scratch/pakklong-desktop.png',fullPage:true});
 const shops=['Restaurant','Rose','Orchid','Mums','Bookstore','Tool'];
 // Fill out of order to prove that players can plan the shop they choose.
 for(const [token,shop] of [['1','Bookstore'],['2','Rose'],['3','Restaurant'],['4','Mums'],['x','Orchid'],['x','Tool']]){await page.getByRole('button',{name:`Select time token ${token}`,exact:true}).first().click();await page.getByRole('button',{name:`Place selected token at ${shop}`,exact:true}).click();}
 await expect(page.getByRole('button',{name:'Remove time token from Bookstore'})).toContainText('Token 1');
 await page.getByRole('button',{name:'Submit Planning',exact:true}).click();await page.getByText('Turn 1 · Market buying',{exact:true}).waitFor();console.log('PLANNING PASS');
 // Continue through the real turn using legal passes, including simultaneous arranging.
 for(let step=0;step<100;step++){
  if(await page.getByText('Turn 1 · Arranging',{exact:true}).count())break;
  if(step%10===0)console.log('PROGRESS',step,await page.locator('.phase-bar').innerText());const pass=page.getByRole('button',{name:'Pass / End Turn',exact:true});if(await pass.count())await pass.click();else await page.waitForTimeout(200);
 }
 await page.getByRole('button',{name:'Finish arranging',exact:true}).waitFor();await page.getByRole('button',{name:'Finish arranging',exact:true}).click();await expect(page.locator('.phase-bar')).toContainText('Turn 2');console.log('TURN CYCLE PASS');
 for(const width of [1280,1024,768,390]){await page.setViewportSize({width,height:900});await page.waitForTimeout(100);const over=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);console.log('WIDTH',width,'overflow',over);expect(over).toBe(false);if(width===390)await page.screenshot({path:'scratch/pakklong-mobile.png',fullPage:true});}
 expect(errors).toEqual([]);console.log('BROWSER ERRORS',JSON.stringify(errors));
} catch(error) {console.log('FAIL BODY',await page.locator('main').innerText());await page.screenshot({path:'scratch/pakklong-play-failure.png',fullPage:true});throw error;} finally {await browser.close()}
