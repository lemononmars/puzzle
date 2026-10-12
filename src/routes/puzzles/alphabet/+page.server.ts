import { error as pageError, redirect } from '@sveltejs/kit';

import { from } from '#lib/supabase.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const tag = url.searchParams.get('tag');

	let query = from('alphabet')
		.select('*')
		.eq('is_public', true)
		.order('created_at', { ascending: false });

	if (tag) {
		query = query.contains('tags', [tag]);
	}

	const { data, error } = await query;

	if (error) {
		console.error('Supabase error listing alphabet puzzles:', error);
		return { error: error.message };
	}

	const puzzles = data.map((d) => ({
		...d,
		id: d.uid,
		uid: d.uid,
		type: 'alphabet',
		date: d.created_at
	}));

	return { puzzles };
};
