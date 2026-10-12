import { parseSaleSheet, type SaleGame } from '#lib/data/boardGameSale.js';
import snapshot from '#lib/data/boardGameSaleSnapshot.json';

const sheetId = '1AtlRUY82vZMHqow1Sz6Zb1ZCn7OOkqUuLUAU1aVAvZw';
export const saleSheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit?gid=73895035#gid=73895035`;
const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=73895035`;
type Catalog = { games: SaleGame[]; checkedAt: string; stale: boolean };
let cache: Catalog | undefined;
let expiresAt = 0;
let pending: Promise<Catalog> | undefined;

/** Only the sale tab is fetched; purchase costs never reach the browser. */
export async function loadSaleCatalog(fetcher: typeof fetch = fetch): Promise<Catalog> {
	if (cache && Date.now() < expiresAt) return cache;
	if (pending) return pending;
	pending = (async () => {
		try {
			const response = await fetcher(csvUrl, { signal: AbortSignal.timeout(8000), redirect: 'error', cache: 'no-store' });
			if (!response.ok) throw new Error('Sale sheet unavailable');
			const games = parseSaleSheet(await response.text());
			cache = { games, checkedAt: new Date().toISOString(), stale: false };
			expiresAt = Date.now() + 60_000;
			return cache;
		} catch {
			const previous = cache ?? { games: snapshot.games as SaleGame[], checkedAt: snapshot.importedAt, stale: true };
			cache = { ...previous, stale: true, games: previous.games.map((game) => ({ ...game,
				availability: game.availability === 'available' ? 'check' : game.availability })) };
			expiresAt = Date.now() + 15_000;
			return cache;
		} finally { pending = undefined; }
	})();
	return pending;
}
