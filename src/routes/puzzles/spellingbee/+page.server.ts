import { error as pageError, redirect } from '@sveltejs/kit';

import { numPuzzles } from '#lib/data/puzzles/spellingbee/index.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const randomId = Math.floor(Math.random() * numPuzzles);
	return redirect(303, `/puzzles/spellingbee/${randomId}`);
};
