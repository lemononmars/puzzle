import { from } from '#lib/supabase.js';
import { isAllowedTable, PUBLIC_TABLES, publicError } from '#lib/apiGuards.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { type, id } = params;
	if (!isAllowedTable(type, PUBLIC_TABLES)) {
		return publicError(404, 'Not found');
	}

	const field =
		type === 'crossword' || type === 'missingvowels' || type === 'alphabet' ? 'uid' : 'id';
	const { data, error } = await from(type).select('*').eq(field, id);

	if (error) return publicError();

	return Response.json(data[0], { status: 200, headers: { 'Content-Type': 'application/json' } });
};

/**
 * check the answer for the requested puzzle
 *
 * @param {null}
 * @return {object} array of objects
 */
export const POST: RequestHandler = async ({ params }) => {
	const { type, id } = params;
	const data = [{ result: 'incorrect', hint: 'no hint for you' }];

	return Response.json(data[0], { status: 200, headers: { 'Content-Type': 'application/json' } });
};
