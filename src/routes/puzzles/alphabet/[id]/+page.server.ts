import { error as pageError, redirect } from '@sveltejs/kit';

import { from } from '#lib/supabase.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	const { data, error } = await from('alphabet').select('*').eq('uid', id).single();

	if (error || !data) {
		console.error('Supabase error loading alphabet puzzle:', error);
		return pageError(404, 'Not found');
	}

	const content = {
		...data,
		type: 'alphabet',
		date: data.created_at
	};

	return { content };
};
