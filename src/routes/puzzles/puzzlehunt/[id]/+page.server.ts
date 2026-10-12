import { error as pageError, redirect } from '@sveltejs/kit';

import { puzzleHunts } from '#lib/data/puzzles/puzzlehunt/index.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;
	const content = puzzleHunts.find((h) => String(h.id) === String(id)) || puzzleHunts[0];
	return { content } as any;
};
