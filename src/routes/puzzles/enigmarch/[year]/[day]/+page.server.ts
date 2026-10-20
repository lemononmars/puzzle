import { error } from '@sveltejs/kit';
import puzzles from '#lib/server/enigmarch.json';
import { presentPuzzle, puzzlePreview } from '#lib/server/enigmarch-presentation.js';
import type { EnigMarchPuzzle } from '#lib/enigmarch.js';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = ({ params }) => {
	const puzzle = puzzles.find(puzzle => String(puzzle.year) === params.year && String(puzzle.day) === params.day);
	if (!puzzle) error(404, 'Puzzle not found');
	const publicPuzzle = presentPuzzle(puzzle as EnigMarchPuzzle);
	return { social: {image:puzzlePreview(puzzle.blocks) || undefined}, puzzle: publicPuzzle, canCheck: !puzzle.grid && (puzzle.answers.length > 0 || Boolean(puzzle.rules)) };
};
