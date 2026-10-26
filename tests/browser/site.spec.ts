import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('mechanics navigation updates the article and is accessible',async({page})=>{
 await page.goto('/resources/mechanics/answer-the-question-mark');
 await expect(page.getByRole('heading',{level:1})).toHaveText('Answer the Question Mark');
 await expect(page.getByRole('heading',{name:'วิธีสังเกต / Solving approach'})).toBeVisible();
 const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 expect(audit.violations).toEqual([]);
 await page.getByRole('link',{name:'Next: Read in Number Order',exact:true}).click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('Read in Number Order');
 await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content','Read in Number Order · Puzzle Mechanics · Chi Fun');
});

test('mobile search and navigation stay inside the viewport',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/search');
 await page.getByRole('searchbox',{name:'Search the website'}).fill('pentomino');
 await page.getByRole('button',{name:'ค้นหา',exact:true}).click();
 await expect(page.locator('main a[href="/tools/pentomino"]')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
 await page.getByRole('button',{name:'ค้น',exact:true}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('public search records exclude answers and unlisted sales',async({request})=>{
 const response=await request.get('/search-records.json');expect(response.ok()).toBe(true);
 const records=await response.json();
 expect(records.length).toBeGreaterThan(100);
 expect(records.some((record:any)=>record.url==='/resources/mechanics/answer-the-question-mark')).toBe(true);
 expect(records.some((record:any)=>/^\/(board-games|admin|check)(\/|$)/.test(record.url))).toBe(false);
 for(const record of records) expect(Object.keys(record).sort()).toEqual(['description','section','title','url']);
});

test('sharing metadata is rendered on the server without duplicate tags',async({request})=>{
 const response=await request.get('/portfolio/web-development');
 const html=await response.text();
 expect(html.match(/property="og:title"/g)).toHaveLength(1);
 expect(html).toContain('Web development · Chi Fun');
 expect(html).toContain('/images/portfolio/thai-board-game-database.png');
 expect(html).toMatch(/property="og:image" content="http[^\"]+"/);
});
