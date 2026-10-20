import { error } from '@sveltejs/kit';
import { crypticClues } from '#lib/data/puzzles/crypticClue.js';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const puzzle = crypticClues.find((item) => item.id === params.id);
	if (!puzzle) error(404, 'Cryptic clue not found');
	return { puzzle };
};
