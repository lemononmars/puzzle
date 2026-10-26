import { chromium } from '@playwright/test';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
try {
 await page.goto('http://localhost:5192/puzzles/wordpieces', { waitUntil: 'domcontentloaded', timeout: 60000 });
 await page.getByRole('heading', { name: 'คำต่อชิ้น', exact: true }).waitFor();
 for (const parts of [['ดอก','ไม้'], ['ดอก','เบี้ย'], ['แม่','น้ำ'], ['น้ำ','ปลา'], ['ใจ','ดี']]) {
  for (const part of parts) await page.getByRole('button', { name: part, exact: true }).first().click();
  await page.getByRole('button', { name: 'ตรวจคำตอบ', exact: true }).click();
 }
 await page.getByRole('heading', { name: 'ต่อครบทั้ง 5 คำแล้ว!' }).waitFor();
 await page.screenshot({ path: 'scratch/wordpieces-mobile-complete.png', fullPage: true });
 await page.getByRole('button', { name: 'เล่นอีกครั้ง' }).click();
 await page.getByRole('button', { name: 'ขอคำใบ้เพิ่ม' }).click();
 await page.getByText('คำใบ้เพิ่ม: มักนำมาจัดใส่แจกัน', { exact: true }).waitFor();
 if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error('Mobile overflow');
 await page.screenshot({ path: 'scratch/wordpieces-mobile.png', fullPage: true });
 await page.setViewportSize({ width: 1280, height: 900 });
 await page.screenshot({ path: 'scratch/wordpieces-desktop.png', fullPage: true });
 if (errors.length) throw new Error(errors.join('\n'));
 console.log('Passed: five answers, duplicate tiles, completion, replay, hints, mobile overflow, no page errors.');
} finally { await browser.close(); }
