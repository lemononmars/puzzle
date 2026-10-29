import { test, expect } from '@playwright/test';

test('Endless allows repeated rolls beyond the tutorial move limit', async ({ page }) => {
	await page.addInitScript(() => {
		Math.random = () => 0.2;
	});
	await page.clock.install({ time: new Date('2026-10-26T00:00:00Z') });
	await page.clock.pauseAt(new Date('2026-10-26T00:00:01Z'));
	await page.goto('/web-game/pips-plot/endless');
	await page.getByRole('button', { name: 'Start Endless', exact: true }).click();
	const scene = page.locator('.scene');
	await expect(scene).toHaveAttribute('data-ready', 'true', { timeout: 120000 });
	await page.clock.fastForward(50);
	async function tap(direction: string) {
		await page.getByRole('button', { name: `Move ${direction}`, exact: true }).click();
		await page.clock.fastForward(460);
	}
	await tap('up');
	await tap('up');
	// Seed .2 starts on the second die, at column 5, row 3.
	await expect(scene).toHaveAttribute('aria-label', /Character at column 5, row 1, on a die/);
	await page.clock.fastForward(65000);
	await expect(page.getByTestId('endless-time')).toHaveText(/01:0[5-7]/);
	await tap('down');
	await tap('down');
	await expect(scene).toHaveAttribute('aria-label', /Character at column 5, row 3, on a die/);
});

test('holding Space grows a sparse Endless garden faster', async ({ page }) => {
	await page.addInitScript(() => {
		Math.random = () => 0;
	});
	await page.clock.install({ time: new Date('2026-10-26T00:00:00Z') });
	await page.clock.pauseAt(new Date('2026-10-26T00:00:01Z'));
	await page.goto('/web-game/pips-plot/endless');
	await page.getByRole('button', { name: 'Start Endless', exact: true }).click();
	const scene = page.locator('.scene');
	await expect(scene).toHaveAttribute('data-ready', 'true', { timeout: 120000 });
	await page.getByRole('button', { name: 'Move right', exact: true }).click();
	await page.clock.runFor(7600);
	await expect(page.getByText('Hold Space to speed up spawning')).toBeVisible();
	const before = (await scene.getAttribute('aria-label'))!.match(/Regular: top/g)!.length;
	await page.keyboard.down('Space');
	await page.clock.runFor(1000);
	await page.keyboard.up('Space');
	const after = (await scene.getAttribute('aria-label'))!.match(/Regular: top/g)!.length;
	expect(after).toBeGreaterThan(before);
});
