import { error as pageError, redirect } from '@sveltejs/kit';

import { getPuzzle, getDailySpellingBee, numPuzzles } from '#lib/data/puzzles/spellingbee/index.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	if (id === 'daily') {
		const content = getDailySpellingBee();
		return { content } as any;
	}

	const numericId = parseInt(id, 10);
	if (isNaN(numericId) || numericId < 0 || numericId >= numPuzzles) {
		const newID = Math.floor(Math.random() * numPuzzles);
		return redirect(303, `/puzzles/spellingbee/${newID}`);
	}

	let content: any = getPuzzle(numericId);
	if (!content) {
		content = getDailySpellingBee();
	}

	return { content } as any;
};
