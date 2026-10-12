import type { RequestHandler } from './$types';
import { createQuizSession, getStrippedQuestion } from '#lib/server/quizSessionStore.js';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json().catch(() => ({}));
		const { type = 'thaiquiz', count, category, mode, pack, excludeIds } = body;

		const session = await createQuizSession({
			type,
			count,
			category,
			mode,
			pack,
			excludeIds
		});

		const firstQuestion = getStrippedQuestion(session, 0);

		return Response.json(
			{
				sessionId: session.id,
				total: session.questions.length,
				type: session.type,
				firstQuestion
			} as any,
			{ status: 200 }
		);
	} catch (err: any) {
		return Response.json({ error: err.message || 'Failed to create quiz session' } as any, {
			status: 500
		});
	}
};
