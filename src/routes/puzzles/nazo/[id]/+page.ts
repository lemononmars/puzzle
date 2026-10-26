import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { nazoPuzzles } from '#lib/data/puzzles/nazo.js';
export const load: PageLoad = ({ params }) => {
	const puzzle = nazoPuzzles.find((item) => String(item.id) === params.id);
	if (!puzzle) error(404, 'ไม่พบปริศนา');
	return { puzzle };
}

