import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('Chi Fun identity is consistent on the About page, navbar and app assets', async ({
	page,
	request
}, testInfo) => {
	await page.goto('/about');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Chi Fun / ไขสนุก');
	await expect(
		page.getByRole('link', { name: 'Chi Fun / ไขสนุก หน้าแรก', exact: true })
	).toBeVisible();
	await expect(page.locator('.brand img')).toHaveAttribute('src', '/images/brand/chi-fun-horizontal.svg?brand=lockups-v4');
	await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content', 'Chi Fun');
	await expect(page.getByRole('heading', { name: 'มีอะไรให้ลองบ้าง?', exact: true })).toBeVisible();
	const favicon = await request.get('/favicon.svg');
	expect(favicon.ok()).toBe(true);
	expect(await favicon.text()).toContain('key-bow');
	const manifest = await (await request.get('/manifest.webmanifest')).json();
	expect(manifest.name).toBe('Chi Fun · ไขสนุก');
	expect(manifest.shortcuts.every((item: any) => !item.url.includes('weekly'))).toBe(true);
	const audit = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
		.analyze();
	expect(audit.violations).toEqual([]);
	await page.screenshot({ path: testInfo.outputPath('chi-fun-about.png'), fullPage: true });
	await page.getByRole('button', { name: 'เพิ่มเติม', exact: true }).click();
	await expect(
		page.getByRole('link', { name: 'เกี่ยวกับ Chi Fun / ไขสนุก', exact: true })
	).toBeVisible();
	await page.keyboard.press('Escape');
	await page.setViewportSize({ width: 390, height: 844 });
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= document.documentElement.clientWidth
		)
	).toBe(true);
});
