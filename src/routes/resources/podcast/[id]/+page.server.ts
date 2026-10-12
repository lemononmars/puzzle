import { error as pageError, redirect } from '@sveltejs/kit';

import { getPodcastById } from '#lib/data/podcasts/index.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;
	const episode = getPodcastById(id);

	if (episode) {
		return { episode } as any;
	}

	return pageError(404, 'Not found');
};
