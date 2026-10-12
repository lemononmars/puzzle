import type { PageLoad } from './$types';
import { staticLogicPuzzles } from '#lib/data/puzzles/logicpuzzle.js';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const res = await fetch('/api/puzzle/logicpuzzle');
		if (res.ok) {
			const data = await res.json();
			return {
				initialPuzzles: Array.isArray(data) && data.length > 0 ? data : staticLogicPuzzles
			};
		}
	} catch (e) {}
	return {
		initialPuzzles: staticLogicPuzzles
	};
};
