import type { PageLoad } from './$types';
export const load: PageLoad = async ({ fetch, params }) => {
	const { uid } = params;
	const res = await fetch(`/api/puzzle/crossword/${uid}`);
	const data = await res.json();

	const content = {
		...data,
		type: 'crossword',
		date: data.created_at
	};

	return { content };
};
