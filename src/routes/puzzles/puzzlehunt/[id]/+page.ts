import { puzzleHunts as defaultPuzzleHunts } from '#lib/data/puzzles/puzzlehunt/index.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const id = Number(params.id);
	try {
		const res = await fetch(`/puzzles/puzzlehunt/${id}.json`);
		if (res.ok) {
			const data = await res.json();
			if (data && data.content) {
				return {
					content: data.content
				};
			}
		}
	} catch (e) {
		// Fallback
	}

	const content = defaultPuzzleHunts.find((n) => n.id === id) || defaultPuzzleHunts[0];
	return {
		content
	};
};
