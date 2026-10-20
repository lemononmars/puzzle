import { error } from '@sveltejs/kit';
import puzzles from '#lib/server/enigmarch.json';
import { puzzlePreview } from '#lib/server/enigmarch-presentation.js';
import type { EnigMarchBlock } from '#lib/enigmarch.js';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = ({ params }) => {
	const year = Number(params.year);
	if (![2023, 2024].includes(year)) error(404, 'Collection not found');
	return { year, puzzles: puzzles.filter(puzzle => puzzle.year === year).map(({ year, day, title, blocks }) => ({ year, day, title, image:puzzlePreview(blocks as EnigMarchBlock[]) || '/images/enigmarch/text-puzzle.svg' })) };
};
