import { getDailySpellingBee } from '#lib/data/puzzles/spellingbee/index.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const puzzle = getDailySpellingBee();
	return Response.json(puzzle, { status: 200, headers: { 'Content-Type': 'application/json' } });
};
