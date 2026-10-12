import type { RequestHandler } from './$types';
import { verifySignedPayload } from '#lib/server/puzzleToken.js';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json().catch(() => ({}));
		const { token, answer } = body;

		if (!token || !answer || typeof answer !== 'string') {
			return Response.json({ error: 'Missing token or answer' } as any, { status: 400 });
		}

		const payload = verifySignedPayload(token);
		if (!payload || payload.type !== 'crossroad') {
			return Response.json({ error: 'Invalid or expired puzzle token' } as any, { status: 400 });
		}

		const cleanAnswer = answer.trim();
		const expectedAnswer = (payload.answer || '').trim();

		const isExactMatch = cleanAnswer === expectedAnswer;

		// Check if alternative valid answer
		let isAlternativeValid = false;
		if (!isExactMatch && payload.pre && payload.post) {
			// If answer forms valid compound words with all provided clues
			// (Checked against server dictionary if needed, or exact match)
		}

		const isCorrect = isExactMatch || isAlternativeValid;

		return Response.json(
			{
				isCorrect,
				canonicalAnswer: isCorrect ? expectedAnswer : undefined
			} as any,
			{ status: 200 }
		);
	} catch (err: any) {
		return Response.json({ error: err.message || 'Failed to verify crossroad answer' } as any, {
			status: 500
		});
	}
};
