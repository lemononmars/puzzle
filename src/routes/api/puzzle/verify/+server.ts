import type { RequestHandler } from './$types';
import { from } from '#lib/supabase.js';
import { isAllowedTable, PUBLIC_TABLES, publicError } from '#lib/apiGuards.js';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json().catch(() => ({}));
		const { type, id, uid, answer, roundIndex } = body;

		if (!type || !isAllowedTable(type, PUBLIC_TABLES)) {
			return publicError(400, 'Invalid puzzle type');
		}

		if (!answer || typeof answer !== 'string') {
			return Response.json({ error: 'Missing answer string' } as any, { status: 400 });
		}

		const cleanGuess = answer.trim();

		// Fetch true answer from Supabase
		const field =
			type === 'crossword' || type === 'missingvowels' || type === 'alphabet' ? 'uid' : 'id';
		const targetId = uid || id;

		const { data, error } = await from(type).select('*').eq(field, targetId).single();

		if (error || !data) {
			return Response.json({ error: 'Puzzle record not found' } as any, { status: 404 });
		}

		let isCorrect = false;
		let canonicalAnswer: string | undefined = undefined;

		if (type === 'rebus' || type === 'cryptogram') {
			const expected = (data.answer || '').trim();
			isCorrect = cleanGuess.toLowerCase() === expected.toLowerCase();
			if (isCorrect) canonicalAnswer = expected;
		} else if (type === 'missingvowels') {
			const answers: string[] = data.answers || [];
			if (typeof roundIndex === 'number' && roundIndex >= 0 && roundIndex < answers.length) {
				const expected = answers[roundIndex].trim();
				isCorrect = cleanGuess.toLowerCase() === expected.toLowerCase();
				if (isCorrect) canonicalAnswer = expected;
			} else {
				isCorrect = answers.some((a) => a.trim().toLowerCase() === cleanGuess.toLowerCase());
			}
		}

		return Response.json(
			{
				isCorrect,
				canonicalAnswer
			} as any,
			{ status: 200 }
		);
	} catch (err: any) {
		return Response.json({ error: err.message || 'Failed to verify puzzle answer' } as any, {
			status: 500
		});
	}
};
