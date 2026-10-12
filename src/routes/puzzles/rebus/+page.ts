import type { PageLoad } from './$types';
export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/api/puzzle/rebus');
	const puzzles = await res.json();
	return {
		puzzles: Array.isArray(puzzles) ? puzzles : []
	};
};
