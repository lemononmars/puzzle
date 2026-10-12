import type { PageLoad } from './$types';
import { staticHiddenLinkPuzzles } from '#lib/data/puzzles/hiddenlink.js';

export const load: PageLoad = async () => {
	return {
		puzzles: staticHiddenLinkPuzzles
	};
};
