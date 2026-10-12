import { loadSaleCatalog } from '#lib/server/boardGameSale.js';

export async function load({ setHeaders }: { setHeaders: (headers: Record<string, string>) => void }) {
	setHeaders({ 'cache-control': 'no-store' });
	return await loadSaleCatalog();
}
