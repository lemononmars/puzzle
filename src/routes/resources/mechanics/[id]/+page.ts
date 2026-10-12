import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';
import {
	getMechanicDetail,
	getAdjacentMechanics,
	type MechanicDetail
} from '#lib/data/resources/puzzleMechanicDetails.js';

export const load: PageLoad = async ({ params }) => {
	const mechanic = getMechanicDetail(params.id);
	if (!mechanic) {
		throw error(404, `Mechanic "${params.id}" not found`);
	}
	const { prev, next } = getAdjacentMechanics(params.id);
	return {
		mechanic,
		prev,
		next
	};
};
