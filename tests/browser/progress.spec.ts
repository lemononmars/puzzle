import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('favorites and notes survive reload and backup restore', async ({ page }, testInfo) => {
	await page.goto('/resources/mechanics/answer-the-question-mark');
	await page.getByRole('button', { name: 'บันทึกไว้เล่น', exact: true }).click();
	await page.getByRole('button', { name: 'โน้ต', exact: true }).click();
	await page.getByLabel('โน้ตส่วนตัว / Private notes (this device)').fill('Remember the pattern');
	await page.reload();
	await expect(page.getByRole('button', { name: 'บันทึกแล้ว', exact: true })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	await page.goto('/library');
	await expect(page.getByText('Remember the pattern', { exact: true })).toBeVisible();
	const downloadPromise = page.waitForEvent('download');
	await page.getByRole('button', { name: 'Export backup', exact: true }).click();
	const download = await downloadPromise;
	const backup = await readFile((await download.path())!);
	await page.getByRole('button', { name: 'Reset local progress', exact: true }).click();
	await page.getByRole('button', { name: 'Clear puzzle data', exact: true }).click();
	await expect(page.getByText('Remember the pattern', { exact: true })).not.toBeVisible();
	await page
		.locator('main input[type="file"]')
		.setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: backup });
	await expect(page.getByText('Remember the pattern', { exact: true })).toBeVisible();
	await page.screenshot({
		path: testInfo.outputPath('local-progress-library.png'),
		fullPage: true
	});
});

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
	).toBeVisible();
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
