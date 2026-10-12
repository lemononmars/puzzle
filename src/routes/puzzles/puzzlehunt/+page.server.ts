import { error as pageError, redirect } from '@sveltejs/kit';

import { puzzleHunts } from '#lib/data/puzzles/puzzlehunt/index.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { puzzleHunts } as any;
};
