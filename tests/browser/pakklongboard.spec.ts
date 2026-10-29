import { test, expect } from '@playwright/test';

test('Pakklong uses a full-width table and supports planning through the next turn', async ({
	page
}, testInfo) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.setViewportSize({ width: 1600, height: 1000 });
	await page.goto('/web-game/pakklongboard');
	const create = page.getByRole('button', { name: 'Create a new room' });
	await create.click();
	await page.waitForURL(/pakklongboard\/[^/]+$/);
	await page.getByRole('button', { name: 'Start Game!', exact: true }).click();
	await expect(page.locator('.phase-bar')).toContainText('Turn 1 · Planning');
	const geometry = await page.getByTestId('pakklong-market').evaluate((market) => {
		const board = market.closest('[data-testid="pakklong-table"]')!;
		const workspace = market.parentElement!;
		const rect = market.getBoundingClientRect();
		return {
			top: rect.top,
			boardTop: board.getBoundingClientRect().top,
			bottom: rect.bottom,
			workspaceBottom: workspace.getBoundingClientRect().bottom,
			width: board.getBoundingClientRect().width,
			overflow: document.documentElement.scrollWidth > innerWidth
		};
	});
	expect(geometry.top).toBeGreaterThanOrEqual(geometry.boardTop);
	const statusBox = await page.locator('.game-status-bar').boundingBox();
	expect(statusBox!.y).toBe(0);
	expect(geometry.top).toBeGreaterThanOrEqual(statusBox!.height);
	expect(geometry.top).toBeLessThan(150);
	await expect(page.getByRole('list', { name: 'Turn order' })).toBeVisible();
	await expect(page.getByTestId('site-navbar')).toHaveCount(0);
	expect(geometry.bottom).toBeLessThanOrEqual(geometry.workspaceBottom + 1);
	expect(geometry.width).toBeGreaterThan(1500);
	expect(geometry.overflow).toBe(false);
	await page.screenshot({ path: testInfo.outputPath('desktop.png'), fullPage: true });
	const shopBoxes = await page.locator('.shop').evaluateAll((shops) =>
		shops.map((shop) => {
			const r = shop.getBoundingClientRect();
			return { x: r.x, y: r.y };
		})
	);
	expect(new Set(shopBoxes.slice(0, 4).map((box) => box.y)).size).toBe(1);
	expect(shopBoxes[4].y).toBeGreaterThan(shopBoxes[0].y);
	expect(shopBoxes[5].y).toBe(shopBoxes[4].y);
	await expect
		.poll(() =>
			page
				.locator('.shop-art')
				.evaluateAll((images) =>
					images.every(
						(image) =>
							(image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0
					)
				)
		)
		.toBe(true);
	expect(await page.locator('.order-card .flower-count strong').allTextContents()).not.toContain(
		'0'
	);
	await page.getByRole('button', { name: 'Room settings', exact: true }).click();
	await expect(page.getByRole('dialog', { name: 'Room settings' })).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(page.getByRole('dialog', { name: 'Room settings' })).toBeHidden();

	await page.getByRole('button', { name: 'Place selected token at Bookstore' }).click();
	await expect(page.getByRole('dialog', { name: 'Time tokens for Bookstore' })).toBeVisible();
	await page.screenshot({ path: testInfo.outputPath('planning-picker.png'), fullPage: false });
	await page.getByRole('button', { name: 'Use time token 1 for Bookstore', exact: true }).click();
	for (const [token, shop] of [
		['2', 'Rose'],
		['3', 'Restaurant'],
		['4', 'Mums'],
		['x', 'Orchid'],
		['x', 'Tool']
	]) {
		await page
			.getByRole('button', { name: `Select time token ${token}`, exact: true })
			.first()
			.click();
		await page
			.getByRole('button', { name: `Place selected token at ${shop}`, exact: true })
			.click();
	}
	await expect(page.getByRole('button', { name: 'Change time token at Bookstore' })).toContainText(
		'1'
	);
	await page.getByRole('button', { name: 'Change time token at Bookstore' }).click();
	await page
		.getByRole('button', { name: 'Use time token 2 for Bookstore, swap with Rose', exact: true })
		.click();
	await expect(page.getByRole('button', { name: 'Change time token at Rose' })).toContainText('1');
	await expect(page.getByRole('button', { name: 'Change time token at Bookstore' })).toContainText(
		'2'
	);
	await page.getByRole('button', { name: 'Submit Planning', exact: true }).click();
	await expect(page.locator('.phase-bar')).toContainText('Market buying');
	await expect(page.locator('.active-shop')).toHaveCount(1);
	await page.screenshot({ path: testInfo.outputPath('active-shop.png'), fullPage: false });
	const deadline = Date.now() + 20000;
	while (
		Date.now() < deadline &&
		!(await page.getByRole('button', { name: 'Finish arranging', exact: true }).isVisible())
	) {
		const pass = page.getByRole('button', { name: 'Pass / End Turn', exact: true }).filter({ visible: true });
		if (await pass.isVisible()) await pass.click();
		await page.waitForTimeout(100);
	}
	await page
		.getByRole('button', { name: /^Select order:/ })
		.first()
		.click();
	await page.getByRole('button', { name: 'Arrange Bouquet', exact: true }).click();
	await expect(page.getByTestId('pakklong-player').getByRole('alert')).toContainText(
		/Quality|flowers/
	);
	const arrangeBox = await page
		.getByRole('button', { name: 'Arrange Bouquet', exact: true })
		.boundingBox();
	const finishBox = await page
		.getByRole('button', { name: 'Finish arranging', exact: true })
		.boundingBox();
	expect(finishBox!.y).toBeGreaterThan(arrangeBox!.y + arrangeBox!.height + 16);
	await page.getByRole('button', { name: 'Finish arranging', exact: true }).click();
	await expect(page.locator('.phase-bar')).toContainText('Turn 2');
	const buy = page
		.getByRole('button', { name: /^Buy (Pink|Blue|White) flower/ })
		.filter({ visible: true });
	await expect(buy.first()).toBeEnabled({ timeout: 10000 });
	const moneyBefore = Number(
		(await page.locator('.resource-grid dd').first().textContent())?.replace('฿', '')
	);
	await buy.first().click();
	await expect(page.locator('.resource-grid dd').first()).toHaveText(`${moneyBefore - 1}`);
	for (const width of [1280, 1024, 768, 390]) {
		await page.setViewportSize({ width, height: 900 });
		await expect
			.poll(() => page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
			.toBe(false);
	}
	await expect(page.getByRole('navigation', { name: 'Table sections' })).toBeVisible();
	await page.getByRole('button', { name: 'Your shop', exact: true }).click();
	await expect(page.getByTestId('pakklong-player')).toBeVisible();
	await expect(page.getByTestId('pakklong-market')).toBeHidden();
	await page.getByRole('button', { name: 'Market', exact: true }).click();
	await expect(page.getByTestId('pakklong-market')).toBeVisible();
	const mobileMarket = await page.getByTestId('pakklong-market').boundingBox();
	expect(mobileMarket!.y + mobileMarket!.height).toBeLessThanOrEqual(900);
	await page.screenshot({ path: testInfo.outputPath('mobile.png'), fullPage: true });
	expect(errors).toEqual([]);
});

test('rulebook is readable on desktop and mobile with the regular site navigation', async ({
	page
}, testInfo) => {
	await page.goto('/web-game/pakklongboard/rules');
	await expect(page.getByRole('heading', { name: 'Rulebook', exact: true })).toBeVisible({
		timeout: 20000
	});
	await expect(page.getByTestId('site-navbar')).toBeVisible();
	await expect(page.getByRole('navigation', { name: 'Rulebook contents' })).toBeVisible();
	await expect(
		page.getByRole('heading', { name: '6. Arranging bouquets', exact: true })
	).toBeVisible();
	for (const width of [1440, 390]) {
		await page.setViewportSize({ width, height: 950 });
		await expect
			.poll(() => page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
			.toBe(false);
		await page.screenshot({ path: testInfo.outputPath(`rulebook-${width}.png`), fullPage: false });
	}
	await page.getByRole('link', { name: 'Arranging bouquets', exact: true }).click();
	await expect(page).toHaveURL(/#bouquets$/);
	await page.goto('/web-game/pakklongdice');
	await page.getByRole('button', { name: 'Create a new room' }).click();
	await page.waitForURL(/pakklongdice\/[^/]+$/);
	await expect(page.getByTestId('site-navbar')).toHaveCount(0);
	await page.getByRole('button', { name: /Lobby/ }).click();
	await expect(page.getByTestId('site-navbar')).toBeVisible();
});

test('Autoplay advances all phases and can be stopped without stale actions', async ({ page }) => {
	const socketLogs: string[] = [];
	const errors: string[] = [];
	page.on('console', (message) => {
		if (message.text().includes('[socket]')) socketLogs.push(message.text());
	});
	page.on('pageerror', (error) => errors.push(error.message));
	await page.setViewportSize({ width: 1600, height: 1000 });
	await page.goto('/web-game/pakklongboard');
	await page.getByRole('button', { name: 'Create a new room' }).click();
	await page.waitForURL(/pakklongboard\/[^/]+$/);
	await page.getByLabel('Add computer players').selectOption('0');
	await page.getByRole('button', { name: 'Start Game!', exact: true }).click();
	await expect(page.locator('.phase-bar')).toContainText('Turn 1 · Planning');
	for (const width of [390, 768]) {
		await page.setViewportSize({ width, height: 900 });
		const pickerTrigger = page.getByRole('button', { name: 'Place selected token at Rose' });
		await pickerTrigger.click();
		const picker = page.getByRole('dialog', { name: 'Time tokens for Rose' });
		await expect(picker).toBeVisible();
		const box = await picker.boundingBox();
		expect(box!.x).toBeGreaterThanOrEqual(0);
		expect(box!.x + box!.width).toBeLessThanOrEqual(width);
		expect(box!.y + box!.height).toBeLessThanOrEqual(900);
		await page.keyboard.press('Escape');
		await expect(picker).toBeHidden();
		await expect(pickerTrigger).toBeFocused();
	}
	await page.setViewportSize({ width: 1600, height: 1000 });
	await page.getByLabel('Autoplay speed', { exact: true }).selectOption('2');
	const autoplayPosition = await page
		.getByRole('button', { name: 'Autoplay: Off', exact: true })
		.boundingBox();
	await page.getByRole('button', { name: 'Autoplay: Off', exact: true }).click();
	await expect(page.locator('.phase-bar')).toContainText('Turn 2', { timeout: 15000 });
	await page.getByRole('button', { name: 'Autoplay: On', exact: true }).click();
	await expect(page.getByRole('button', { name: 'Autoplay: Off', exact: true })).toBeVisible();
	const stoppedPosition = await page
		.getByRole('button', { name: 'Autoplay: Off', exact: true })
		.boundingBox();
	expect(stoppedPosition?.x).toBe(autoplayPosition?.x);
	expect(stoppedPosition?.y).toBe(autoplayPosition?.y);
	const snapshot = () =>
		page.evaluate(() => ({
			phase: document.querySelector('.phase-bar')?.textContent,
			shop: document.querySelector('.active-shop')?.getAttribute('aria-label'),
			resources: document.querySelector('.resource-grid')?.textContent,
			hand: document.querySelector('.order-hand')?.textContent
		}));
	const stopped = await snapshot();
	await page.waitForTimeout(1200);
	expect(await snapshot()).toEqual(stopped);
	expect(socketLogs).toEqual([]);
	expect(errors).toEqual([]);
	await expect(page.locator('button').filter({ hasText: /^chat$/ })).toHaveCount(0);
});
