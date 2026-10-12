import { from } from '#lib/supabase.js';
import { publicError } from '#lib/apiGuards.js';
import type { RequestHandler } from './$types';

/**
 * Get all crossword puzzles
 */
export const GET: RequestHandler = async () => {
	const { data, error } = await from('crossword')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) {
		console.error('API Error loading crossword puzzles:', error);
		return publicError();
	}

	return Response.json(data, { status: 200 });
};

/**
 * Insert a new crossword puzzle
 */
export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	// Ensure we are inserting into the correct table
	const { data, error } = await from('crossword').insert([body]);

	if (error) {
		console.error('API Error:', error);
		return publicError();
	}

	return Response.json(data ? data[0] : null, { status: 201 });
};
