import { test, expect } from '@playwright/test';

test('homepage menus work before hydration', async ({ browser, baseURL }) => {
	const context = await browser.newContext({
		javaScriptEnabled: false,
		viewport: { width: 1280, height: 900 }
	});
	const page = await context.newPage();
	await page.goto(baseURL + '/');
	await page
		.getByRole('navigation', { name: 'เมนูหลัก', exact: true })
		.getByText('เล่น', { exact: true })
		.click();
	await expect(page.getByRole('link', { name: 'ห้องเล่นทั้งหมด', exact: true })).toBeVisible();
	await expect(page.getByRole('link', { name: 'ห้องเล่นทั้งหมด', exact: true })).toHaveClass(
		/overview-link/
	);
	await context.close();
});

test('desktop menu supports hover, Escape, and keyboard activation on a fresh homepage', async ({
	page
}) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.goto('/', { waitUntil: 'networkidle' });
	const trigger = page
		.getByRole('navigation', { name: 'เมนูหลัก', exact: true })
		.locator('summary')
		.filter({ hasText: 'เล่น' });
	await trigger.hover();
	await expect(page.getByRole('link', { name: 'ห้องเล่นทั้งหมด', exact: true })).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(page.getByRole('link', { name: 'ห้องเล่นทั้งหมด', exact: true })).not.toBeVisible();
	await trigger.focus();
	await page.keyboard.press('Enter');
	await expect(page.getByRole('link', { name: 'ห้องเล่นทั้งหมด', exact: true })).toBeVisible();
});

test('mobile menu retains the bottom sheet and distinctive overview link', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');
	await page
		.getByRole('navigation', { name: 'เมนูหลัก', exact: true })
		.getByText('เล่น', { exact: true })
		.click();
	const dialog = page.getByRole('dialog', { name: 'เล่น', exact: true });
	await expect(dialog).toBeVisible();
	await expect(dialog.getByRole('link', { name: 'ห้องเล่นทั้งหมด', exact: true })).toHaveClass(
		/overview-link/
	);
	await page.keyboard.press('Escape');
	await expect(dialog).not.toBeVisible();
});

for (const width of [1280, 390]) {
	test(`wordplay searches while typing and applies selected lengths at ${width}px`, async ({
		page
	}) => {
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/resources/wordplay?rule=3');
		await expect(
			page.getByRole('tablist', { name: 'Wordplay types' }).getByRole('tab')
		).toHaveCount(8);
		const query = page.getByLabel('Find a word', { exact: true });
		await query.fill('กราม');
		await expect(page).toHaveURL(/q=%E0%B8%81%E0%B8%A3%E0%B8%B2%E0%B8%A1/);
		await expect(query).toBeFocused();
		await page.getByLabel('Min. length', { exact: true }).selectOption('4');
		await expect(page).toHaveURL(/min=4/);
		await page.getByLabel('Max. length', { exact: true }).selectOption('4');
		await expect(page).toHaveURL(/max=4/);
		const rows = page.getByRole('list', { name: 'Word sets' });
		await expect(rows).toContainText('กราม');
		await expect(rows).not.toContainText(/insert after|alternate tiles|added:|positions/);
		await expect.poll(() => rows.getByRole('listitem').count()).toBeLessThanOrEqual(100);
		await expect(
			page.getByLabel('Top result pages').getByRole('link', { name: 'Page 1', exact: true })
		).toHaveAttribute('href', /min=4.*max=4/);
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
		await page.getByRole('link', { name: 'Clear', exact: true }).click();
		await expect(query).toHaveValue('');
		await expect(page.getByLabel('Min. length', { exact: true })).toHaveValue('');
		const panel = page.getByRole('tabpanel');
		await expect
			.poll(async () => (await panel.boundingBox())!.y)
			.toBeLessThanOrEqual(width >= 1024 ? 104 : 20);
		await page
			.getByLabel('Bottom result pages')
			.getByRole('link', { name: 'Page 2', exact: true })
			.click();
		await expect(page).toHaveURL(/page=2/);
		await expect
			.poll(async () => (await panel.boundingBox())!.y)
			.toBeLessThanOrEqual(width >= 1024 ? 104 : 20);
		const rotation = page.getByRole('tab', { name: /Rotation/ });
		await rotation.click();
		await expect(rotation).toHaveAttribute('aria-selected', 'true');
		await expect(panel).toHaveAttribute('aria-labelledby', 'wordplay-tab-8');
		await expect
			.poll(async () => (await panel.boundingBox())!.y)
			.toBeLessThanOrEqual(width >= 1024 ? 104 : 20);
		await rotation.focus();
		await page.keyboard.press('Home');
		await expect(page.getByRole('tab', { name: /Anagram pairs/ })).toHaveAttribute(
			'aria-selected',
			'true'
		);
		await page.keyboard.press('ArrowLeft');
		await expect(rotation).toHaveAttribute('aria-selected', 'true');
		expect(errors).toEqual([]);
	});
}
