import type { RequestHandler } from './$types';
import {
	auditQuestion,
	questionKey,
	type QuestionReviewRecord
} from '#lib/quiz/contentGovernance.js';
import { questionGovernanceRepository } from '#lib/server/questionGovernanceRepository.js';

function authorized(request: Request): boolean {
	const expected = process.env.ADMIN_REVIEW_PASSWORD || 'nazo';
	return request.headers.get('x-admin-password') === expected;
}

export const GET: RequestHandler = async ({ request }) => {
	if (!authorized(request)) return Response.json({ error: 'Unauthorized' } as any, { status: 401 });
	const [{ THAI_QUIZ_DATABASE }, reviews, feedback] = await Promise.all([
		import('#lib/data/puzzles/thaiquiz/questions.js'),
		questionGovernanceRepository.listReviews(),
		questionGovernanceRepository.feedbackSummary()
	]);
	const byKey = new Map(reviews.map((review) => [review.questionKey, review]));
	return Response.json(
		{
			questions: THAI_QUIZ_DATABASE.map((question) => {
				const key = questionKey(question);
				const stats = feedback[key] || { up: 0, down: 0, attempts: 0, correct: 0 };
				const storedReview = byKey.get(key);
				const review = stats.attempts
					? {
							...storedReview,
							questionKey: key,
							empiricalCorrectRate: stats.correct / stats.attempts
						}
					: storedReview;
				return {
					...question,
					questionKey: key,
					audit: auditQuestion(question, review),
					review: storedReview,
					feedback: stats
				};
			})
		} as any,
		{ status: 200 }
	);
};

export const POST: RequestHandler = async ({ request }) => {
	if (!authorized(request)) return Response.json({ error: 'Unauthorized' } as any, { status: 401 });
	const body = await request.json().catch(() => ({}));
	if (typeof body.questionKey !== 'string' || body.questionKey.length > 100) {
		return Response.json({ error: 'Invalid question key' } as any, { status: 400 });
	}
	const review = body as QuestionReviewRecord;
	if (review.provenance?.sourceUrl && !/^https?:\/\//.test(review.provenance.sourceUrl)) {
		return Response.json({ error: 'Source must be an HTTP URL' } as any, { status: 400 });
	}
	await questionGovernanceRepository.putReview(review);
	return Response.json({ ok: true } as any, { status: 200 });
};
