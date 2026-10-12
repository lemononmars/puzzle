import type { RequestHandler } from './$types';
import { verifySessionAnswer } from '#lib/server/quizSessionStore.js';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json().catch(() => ({}));
		const {
			sessionId,
			questionId,
			choiceIndex,
			textAnswer,
			skip = false,
			simulateAccuracy,
			timeRemainingRatio = 1.0
		} = body;

		if (typeof sessionId !== 'string' || !sessionId || typeof questionId !== 'number') {
			return Response.json(
				{ error: 'Missing required parameters: sessionId, questionId, choiceIndex' } as any,
				{ status: 400 }
			);
		}

		const result = await verifySessionAnswer(
			sessionId,
			questionId,
			choiceIndex,
			textAnswer,
			skip === true,
			simulateAccuracy,
			timeRemainingRatio
		);

		if (result.error) {
			return Response.json({ error: result.error } as any, { status: 400 });
		}

		return Response.json(result as any, { status: 200 });
	} catch (err: any) {
		return Response.json({ error: err.message || 'Failed to verify answer' } as any, {
			status: 500
		});
	}
};
