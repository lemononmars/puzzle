import type { PageLoad } from './$types';
import { staticHiddenLinkPuzzles } from '#lib/data/puzzles/hiddenlink.js';

export const load: PageLoad = async ({ params }) => {
	const id = Number(params.id);
	const content = staticHiddenLinkPuzzles.find((p) => p.id === id) || null;

	return {
		content,
		id
	};
};
