import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const res = await fetch('/api/puzzle/wordsearch');
		const data = await res.json();

		const wordsearches = (Array.isArray(data) ? data : [])
			.filter((d) => d.is_public !== false)
			.map((d) => ({
				...d,
				type: 'wordsearch',
				date: d.created_at,
				difficulty: d.clues?.difficulty || 1
			}));

		return { wordsearches };
	} catch (e) {
		return { wordsearches: [] };
	}
};
