import { from } from '#lib/supabase.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { type } = params;
	if (['weekly', 'seventh', 'tbs2021'].includes(type)) return Response.json({ error: 'Not found' }, { status: 404 });
	const { data, error } = await from('leaderboard').select('*').eq('puzzle_type', type);

	if (error) {
		return Response.json([], { status: 500, headers: { 'Content-Type': 'application/json' } });
	}
	return Response.json(data as any, {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
