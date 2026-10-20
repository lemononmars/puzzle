import { error, json } from '@sveltejs/kit';
import puzzles from '#lib/server/enigmarch.json';
import { normalizeEnigMarchAnswer, validateThermoSudoku } from '#lib/server/enigmarch-check.js';
import type { RequestHandler } from './$types';
export const POST: RequestHandler = async ({ params, request }) => {
	const puzzle = puzzles.find(puzzle => String(puzzle.year) === params.year && String(puzzle.day) === params.day);
	if (!puzzle) error(404, 'Puzzle not found');
	const body = await request.json().catch(() => null);
	if (typeof body?.answer !== 'string' || body.answer.length > 500) return json({ message: 'Please enter an answer.' }, { status: 400 });
	return json({ correct: puzzle.rules ? validateThermoSudoku(body.answer, puzzle.rules) : puzzle.answers.some(answer => normalizeEnigMarchAnswer(answer) === normalizeEnigMarchAnswer(body.answer)) });
};
