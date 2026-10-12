import { error as pageError, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { title, answer } = params;

	if (title.length > 0 && answer.length > 0) {
		return { title, answer };
	}

	return pageError(404, 'Not found');
};
