import { from } from '#lib/supabase.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const { data, error } = await from('leaderboard')
			.select('*')
			.neq('puzzle_type', 'seventh')
			.neq('puzzle_type', 'tbs2021')
			.neq('puzzle_type', 'weekly')
			.order('created_at', { ascending: false })
			.limit(6);

		if (error || !data) {
			return Response.json([], { status: 200, headers: { 'Content-Type': 'application/json' } });
		}

		return Response.json(data, { status: 200, headers: { 'Content-Type': 'application/json' } });
	} catch {
		return Response.json([], { status: 200, headers: { 'Content-Type': 'application/json' } });
	}
};
