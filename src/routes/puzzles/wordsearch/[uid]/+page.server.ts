import { error as pageError, redirect } from '@sveltejs/kit';

import { from } from '#lib/supabase.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { uid } = params;

	const { data, error } = await from('wordsearch').select('*').eq('uid', uid).single();

	if (error || !data) {
		console.error('Supabase error:', error);
		return pageError(404, 'Not found');
	}

	const content = {
		...data,
		type: 'wordsearch',
		date: data.created_at
	};

	return { content };
};
