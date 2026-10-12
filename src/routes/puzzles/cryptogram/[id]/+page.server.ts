import { error as pageError, redirect } from '@sveltejs/kit';

import { cryptogram as staticCryptogram } from '#lib/data/puzzles/cryptogram/index.js';
import { from } from '#lib/supabase.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	try {
		const { data, error } = await from('cryptogram').select('*').eq('id', id).single();

		if (!error && data) {
			const content = {
				...data,
				type: 'cryptogram',
				date: data.created_at
			};
			return { content };
		}
	} catch (e) {
		console.error('Failed fetching cryptogram [id] from Supabase:', e);
	}

	const fallback = staticCryptogram.find((p) => String(p.id) === String(id)) || staticCryptogram[0];

	return { content: fallback };
};
