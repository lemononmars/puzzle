import { from } from '#lib/supabase.js';
import { publicError } from '#lib/apiGuards.js';
import type { RequestHandler } from './$types';
import { staticLogicPuzzles } from '#lib/data/puzzles/logicpuzzle.js';

/**
 * Get all logic puzzles from database
 */
export const GET: RequestHandler = async () => {
	try {
		const { data, error } = await from('logic_puzzles')
			.select('*')
			.order('created_at', { ascending: false });

		if (!error && Array.isArray(data) && data.length > 0) {
			return Response.json(data, { status: 200, headers: { 'Content-Type': 'application/json' } });
		}
	} catch (e) {
		console.warn('Fallback to static logic puzzles:', e);
	}

	return Response.json(staticLogicPuzzles, {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};

/**
 * Insert a new logic puzzle into database
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { id, ...rawPuzzleData } = body;

		const puzzleData = {
			title: String(rawPuzzleData.title || '').trim(),
			genre: String(rawPuzzleData.genre || 'slither').trim(),
			genre_title: String(rawPuzzleData.genre_title || rawPuzzleData.genre || 'Slitherlink').trim(),
			url: String(rawPuzzleData.url || '').trim(),
			width: Number(rawPuzzleData.width) || 5,
			height: Number(rawPuzzleData.height) || 5,
			difficulty: String(rawPuzzleData.difficulty || 'Easy'),
			author: String(rawPuzzleData.author || 'Codebreaker').trim()
		};

		if (!puzzleData.title || !puzzleData.url) {
			return publicError(400, 'Title and URL are required');
		}

		const { data, error } = await from('logic_puzzles').insert([puzzleData]).select();

		if (error) {
			console.error('API Error inserting logic puzzle:', error);
			return publicError(400, error.message || 'Error inserting logic puzzle');
		}

		return Response.json(data ? data[0] : null, {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err: any) {
		console.error('API exception inserting logic puzzle:', err);
		return publicError(500, err.message || 'Server error');
	}
};

/**
 * Update an existing logic puzzle in database
 */
export const PUT: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { id, ...rawUpdates } = body;

		if (!id) {
			return publicError(400, 'Missing puzzle ID');
		}

		const updates: any = {};
		if (rawUpdates.title !== undefined) updates.title = String(rawUpdates.title).trim();
		if (rawUpdates.genre !== undefined) updates.genre = String(rawUpdates.genre).trim();
		if (rawUpdates.genre_title !== undefined)
			updates.genre_title = String(rawUpdates.genre_title).trim();
		if (rawUpdates.url !== undefined) updates.url = String(rawUpdates.url).trim();
		if (rawUpdates.width !== undefined) updates.width = Number(rawUpdates.width) || 5;
		if (rawUpdates.height !== undefined) updates.height = Number(rawUpdates.height) || 5;
		if (rawUpdates.difficulty !== undefined) updates.difficulty = String(rawUpdates.difficulty);
		if (rawUpdates.author !== undefined) updates.author = String(rawUpdates.author).trim();

		const { data, error } = await from('logic_puzzles').update(updates).eq('id', id).select();

		if (error) {
			console.error('API Error updating logic puzzle:', error);
			return publicError(400, error.message || 'Error updating logic puzzle');
		}

		return Response.json(data ? data[0] : null, {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err: any) {
		console.error('API exception updating logic puzzle:', err);
		return publicError(500, err.message || 'Server error');
	}
};

/**
 * Delete a logic puzzle from database
 */
export const DELETE: RequestHandler = async ({ request, url }) => {
	try {
		let id = url.searchParams.get('id');
		if (!id) {
			try {
				const body = await request.json();
				id = body.id;
			} catch (e) {}
		}

		if (!id) {
			return publicError(400, 'Missing puzzle ID');
		}

		const { error } = await from('logic_puzzles').delete().eq('id', Number(id));

		if (error) {
			console.error('API Error deleting logic puzzle:', error);
			return publicError(400, error.message || 'Error deleting logic puzzle');
		}

		return Response.json(
			{ success: true },
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		);
	} catch (err: any) {
		console.error('API exception deleting logic puzzle:', err);
		return publicError(500, err.message || 'Server error');
	}
};
