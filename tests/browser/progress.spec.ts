import { test, expect } from '@playwright/test';

test('Euler board and player entries resume after reload', async ({ page }) => {
	await page.goto('/puzzles/eulersquare');
	const saved = () =>
		page.evaluate(
			() => JSON.parse(localStorage.getItem('puzzle-save:v1:/puzzles/eulersquare') || 'null')?.state
		);
	await expect.poll(saved).toBeTruthy();
	const initial = await saved();
	let r = 0,
		c = 0;
	outer: for (let row = 0; row < initial.currentSize; row++)
		for (let col = 0; col < initial.currentSize; col++)
			if (!initial.playerGrid[row][col].isGivenLetter) {
				r = row;
				c = col;
				break outer;
			}
	await page.getByRole('button', { name: `Row ${r + 1}, column ${c + 1}`, exact: true }).click();
	await page.keyboard.press('A');
	await expect.poll(async () => (await saved())?.playerGrid[r][c].letter).toBe(0);
	const before = await saved();
	await page.reload();
	await expect.poll(async () => (await saved())?.playerGrid).toEqual(before.playerGrid);
	expect((await saved()).puzzle).toEqual(before.puzzle);
});

test('Thai word search starts a worker and does not fetch Wikipedia for a standard search', async ({
	page
}) => {
	const requests: string[] = [];
	const workers: string[] = [];
	page.on('request', (request) => requests.push(request.url()));
	page.on('worker', (worker) => workers.push(worker.url()));
	await page.goto('/tools/thwordsearch');
	expect(workers).toHaveLength(0);
	await page.getByRole('textbox', { name: 'Thai word pattern', exact: true }).fill('แมว');
	await page.getByRole('textbox', { name: 'Thai word pattern', exact: true }).press('Enter');
	await expect(page.getByText('แมว', { exact: true })).toBeVisible({ timeout: 60000 });
	expect(workers.length).toBeGreaterThan(0);
	expect(requests.some((url) => /wiki[.-].*\.(json|js)/.test(url))).toBe(false);
});

test('homepage and service-worker installation leave dictionaries unloaded', async ({
	page,
	context
}) => {
	const requests: string[] = [];
	context.on('request', (request) => requests.push(request.url()));
	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	await page.evaluate(async () => {
		await navigator.serviceWorker.ready;
	});
	expect(requests.filter((url) => /\/(dict|wiki|dict_pythainlp)[.-]/.test(url))).toEqual([]);
	await expect(
		page.getByText('เลือกเกมด้านบนเพื่อเริ่มเล่น / Choose a game to start.', { exact: true })
	).not.toBeVisible();
});

test('word-ladder worker hints update the chain and resume the same puzzle', async ({ page }) => {
	await page.goto('/puzzles/wordladder');
	const saved = () =>
		page.evaluate(
			() => JSON.parse(localStorage.getItem('puzzle-save:v1:/puzzles/wordladder') || 'null')?.state
		);
	await expect.poll(saved, { timeout: 60000 }).toBeTruthy();
	const initial = await saved();
	await page.getByRole('button', { name: '💡 ใบ้', exact: true }).click();
	await expect.poll(async () => (await saved())?.chain.length, { timeout: 60000 }).toBe(2);
	const before = await saved();
	await page.reload();
	await expect.poll(async () => (await saved())?.chain, { timeout: 60000 }).toEqual(before.chain);
	expect((await saved()).end).toBe(initial.end);
});
