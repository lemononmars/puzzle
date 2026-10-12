import type { RequestHandler } from './$types';
import { questionGovernanceRepository } from '#lib/server/questionGovernanceRepository.js';
import { recordDiagnostic } from '#lib/diagnostics.js';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json().catch(() => ({}));
		if (
			typeof body.questionKey !== 'string' ||
			body.questionKey.length > 100 ||
			typeof body.category !== 'string' ||
			![-1, 1].includes(body.rating)
		)
			return Response.json({ error: 'Invalid feedback' } as any, { status: 400 });
		await questionGovernanceRepository.recordFeedback({
			questionKey: body.questionKey,
			category: body.category,
			rating: body.rating,
			reason: typeof body.reason === 'string' ? body.reason : undefined
		});
		return Response.json({ ok: true } as any, { status: 201 });
	} catch (error) {
		recordDiagnostic(
			'quiz.feedback_failed',
			{ message: error instanceof Error ? error.message : String(error) },
			'error'
		);
		return Response.json({ error: 'Unable to save feedback' } as any, { status: 500 });
	}
};
