import { describe, expect, it, vi } from 'vitest';
import { load } from './+page.server';

vi.mock('#lib/server/thai-word-sets.js', () => ({
	getThaiWordSets: () => ({
		dictionarySize: 4,
		sets: [
			Array.from({ length: 205 }, () => ({ words: ['ก่ราม', 'ก่า', 'รม'] })),
			[{ words: ['กรามก', 'กาก', 'รม'] }]
		]
	})
}));

async function page(query: string) {
	const headers = vi.fn();
	const result = await load({
		url: new URL(`https://example.com/resources/wordplay?${query}`),
		setHeaders: headers
	} as Parameters<typeof load>[0]);
	return { result: result!, headers };
}

describe('Wordplay filters and pagination', () => {
	it('paginates at 100 sets with a partial final page and clamps out-of-range pages', async () => {
		expect((await page('page=2')).result.rows).toHaveLength(100);
		const { result } = await page('page=999');
		expect(result.page).toBe(3);
		expect(result.rows).toHaveLength(5);
	});
	it('filters the main word by Thai tile length and searches all component words', async () => {
		const { result } = await page('min=4&max=4&q=รม');
		expect(result.total).toBe(205);
		expect(result.minLength).toBe(4);
		expect(result.maxLength).toBe(4);
		expect((await page('min=5')).result.total).toBe(0);
		expect((await page('rule=2&min=5&max=5')).result.total).toBe(1);
	});
	it('handles empty matches and invalid lengths while retaining noindex headers', async () => {
		const { result, headers } = await page('min=abc&max=-1&q=ไม่มี');
		expect(result.minLength).toBeNull();
		expect(result.maxLength).toBeNull();
		expect(result.total).toBe(0);
		expect(result.pages).toBe(1);
		expect(headers).toHaveBeenCalledWith(
			expect.objectContaining({ 'x-robots-tag': 'noindex, nofollow, noarchive' })
		);
	});
});
