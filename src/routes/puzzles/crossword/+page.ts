import type { PageLoad } from './$types';
export const load: PageLoad = async ({ fetch }) => {
	try {
		const res = await fetch('/api/puzzle/crossword');
		const data = await res.json();

		const crosswords = (Array.isArray(data) ? data : [])
			.filter((d: any) => d.is_public !== false)
			.map((d: any) => ({
				...d,
				type: 'crossword',
				date: d.created_at
			}));

		return { crosswords };
	} catch (e) {
		return { crosswords: [] };
	}
};
