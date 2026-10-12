import { from } from '#lib/supabase.js';
import { isAllowedTable, PUBLIC_INSERT_TABLES, publicError } from '#lib/apiGuards.js';
import type { RequestHandler } from './$types';

/**
 * Insert a new puzzle of any type
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();

		const { type, data: puzzleData } = body;

		if (!type || !puzzleData) {
			return publicError(400, 'Missing type or data');
		}

		if (!isAllowedTable(type, PUBLIC_INSERT_TABLES)) {
			return publicError(404, 'Not found');
		}

		// Insert into the specified table (e.g. 'crossword', 'wordsearch', etc.)
		const { data, error } = await from(type).insert([puzzleData]);

		if (error) {
			console.error(`API Error inserting to ${type}:`, error);
			return publicError();
		}

		return Response.json(data ? data[0] : null, { status: 201 });
	} catch (error) {
		console.error('API Error:', error);
		return publicError();
	}
};
