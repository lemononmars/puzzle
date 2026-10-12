import { error as pageError, redirect } from '@sveltejs/kit';

import { from } from '#lib/supabase.js';
import type { PageServerLoad } from './$types';

const defaultMissingVowels = {
	uid: 'default-1',
	title: 'คำไทยพยัญชนะล้วน',
	words: ['กงเกวียน', 'สถานบันเทิง', 'วิทยาศาสตร์', 'พฤกษศาสตร์'],
	author: 'Code Breaker',
	created_at: new Date().toISOString()
};

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	try {
		const { data, error } = await from('missingvowels').select('*').eq('uid', id).single();

		if (!error && data) {
			const content = {
				...data,
				type: 'missingvowels',
				date: data.created_at
			};
			return { content };
		}
	} catch (e) {
		// Fallback
	}

	const content = {
		...defaultMissingVowels,
		type: 'missingvowels',
		date: defaultMissingVowels.created_at
	};

	return { content };
};
