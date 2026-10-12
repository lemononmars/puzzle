import { error as pageError, redirect } from '@sveltejs/kit';

import { cryptogram as staticCryptogram } from '#lib/data/puzzles/cryptogram/index.js';
import { from } from '#lib/supabase.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const tag = url.searchParams.get('tag');

	try {
		let query = from('cryptogram')
			.select('*')
			.eq('is_public', true)
			.order('created_at', { ascending: false });

		if (tag) {
			query = query.contains('tags', [tag]);
		}

		const { data, error } = await query;

		if (!error && data && data.length > 0) {
			const puzzles = data.map((d) => ({
				...d,
				type: 'cryptogram',
				date: d.created_at
			}));
			return { puzzles };
		}
	} catch (e) {
		console.error('Failed fetching cryptogram from Supabase:', e);
	}

	let filtered = staticCryptogram;
	if (tag) {
		filtered = staticCryptogram.filter((p) => p.tags?.includes(tag));
	}

	return { puzzles: filtered };
};
