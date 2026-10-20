import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';
import {
	getMechanicDetail,
	getAdjacentMechanics
} from '#lib/data/resources/puzzleMechanicDetails.js';

const articles = import.meta.glob<{ default: import('svelte').Component }>('/src/lib/content/mechanics/*.svelte');

export const load: PageLoad = async ({ params }) => {
	const mechanic = await getMechanicDetail(params.id);
	if (!mechanic) {
		throw error(404, `Mechanic "${params.id}" not found`);
	}
	const { prev, next } = getAdjacentMechanics(params.id);
	const articleModule = await articles[`/src/lib/content/mechanics/${params.id}.svelte`]?.();
	return {
		mechanic,
		article: articleModule?.default ?? null,
		prev,
		next
	};
};
