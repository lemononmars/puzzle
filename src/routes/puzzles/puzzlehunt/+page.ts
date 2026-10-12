import { puzzleHunts as defaultPuzzleHunts } from '#lib/data/puzzles/puzzlehunt/index.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const res = await fetch('/puzzles/puzzlehunt.json');
		if (res.ok) {
			const data = await res.json();
			if (data && data.puzzleHunts) {
				return {
					puzzleHunts: data.puzzleHunts
				};
			}
		}
	} catch (e) {
		// Fallback
	}

	return {
		puzzleHunts: defaultPuzzleHunts
	};
};
