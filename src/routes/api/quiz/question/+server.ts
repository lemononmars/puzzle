import type { RequestHandler } from './$types';
import { getQuizSession, getStrippedQuestion } from '#lib/server/quizSessionStore.js';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const sessionId = url.searchParams.get('sessionId');
		const indexStr = url.searchParams.get('index');

		if (!sessionId) {
			return Response.json({ error: 'Missing sessionId parameter' } as any, { status: 400 });
		}

		const session = await getQuizSession(sessionId);
		if (!session) {
			return Response.json({ error: 'Quiz session not found or expired' } as any, { status: 404 });
		}

		const index = indexStr !== null ? parseInt(indexStr, 10) : session.currentIndex;
		if (!Number.isInteger(index) || index !== session.currentIndex) {
			return Response.json({ error: 'Only the current question may be fetched' } as any, {
				status: 409
			});
		}
		const question = getStrippedQuestion(session, index);

		if (!question) {
			return Response.json(
				{ error: 'Question index out of range or game completed', isCompleted: true } as any,
				{ status: 404 }
			);
		}

		return Response.json(
			{
				question
			} as any,
			{ status: 200 }
		);
	} catch (err: any) {
		return Response.json({ error: err.message || 'Failed to fetch question' } as any, {
			status: 500
		});
	}
};
