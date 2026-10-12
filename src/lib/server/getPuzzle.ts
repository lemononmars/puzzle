import type { PuzzleType } from '#lib/interfaces/index.js';
import { from } from '#lib/supabase.js';
import { isAllowedTable, PUBLIC_TABLES, publicError } from '#lib/apiGuards.js';

export async function getPuzzle(type: PuzzleType, id: number) {
	if (!isAllowedTable(type, PUBLIC_TABLES)) {
		return publicError(404, 'Not found');
	}

	const { data, error } = await from(type).select('*').eq('id', id);

	if (error) {
		return publicError();
	}
	return {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		body: data
	};
}
