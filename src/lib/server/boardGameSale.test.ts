import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('live sale sheet', () => {
	beforeEach(() => { vi.resetModules(); });
	it('refreshes Sheet edits after the cache interval and marks outdated available stock for confirmation on failure', async () => {
		const now = vi.spyOn(Date, 'now').mockReturnValue(0);
		try {
			const { loadSaleCatalog } = await import('./boardGameSale.js');
			const read = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response('Title,sale ฿,Availability\nA,500,available'))
				.mockResolvedValueOnce(new Response('Title,sale ฿,Availability\nA,700,sold'))
				.mockResolvedValueOnce(new Response('Title,sale ฿,Availability\nA,600,available'))
				.mockRejectedValueOnce(new Error('Offline'));
			expect((await loadSaleCatalog(read)).games[0].price).toBe(500);
			await loadSaleCatalog(read);
			expect(read).toHaveBeenCalledTimes(1);
			now.mockReturnValue(61_000);
			expect((await loadSaleCatalog(read)).games[0]).toMatchObject({ price: 700, availability: 'sold' });
			now.mockReturnValue(122_000);
			await loadSaleCatalog(read);
			now.mockReturnValue(183_000);
			expect(await loadSaleCatalog(read)).toMatchObject({ stale: true, games: [{ price: 600, availability: 'check' }] });
		} finally { now.mockRestore(); }
	});
	it('labels the bundled copy on first-load failure and does not expose purchase costs', async () => {
		const { loadSaleCatalog } = await import('./boardGameSale.js');
		const catalog = await loadSaleCatalog(vi.fn<typeof fetch>().mockResolvedValue(new Response('<html>Sign in</html>')));
		expect(catalog.stale).toBe(true);
		expect(catalog.games.length).toBeGreaterThan(0);
		expect(catalog.games.some((game) => game.availability === 'available')).toBe(false);
		expect(Object.keys(catalog.games[0]).sort()).toEqual(['addOns', 'availability', 'condition', 'id', 'listing', 'note', 'price', 'title']);
	});
});
