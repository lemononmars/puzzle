import { adventureLevels } from '#lib/data/adventure_data.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const level = parseInt(params.level);
	const answer = params.answer;

	const stage = adventureLevels.find((l) => l.level === level);
	const nextStage = adventureLevels.find((l) => l.level === level + 1);

	// Case insensitive check
	if (stage && stage.answer.toLowerCase() === answer.toLowerCase()) {
		// If there is a next stage, give its code. If not, maybe just give a success message?
		// The store logic expects 'code' to be the access code for the next level.
		// Current adventureLevels data: Level 2 code is 'start' (placeholder).
		// We should verify that `stage.answer` actually maps to `nextStage.code` if we want consistency,
		// OR we just return `nextStage.code` here.

		const nextCode = nextStage ? nextStage.code : 'end';

		return Response.json(
			{
				result: 'correct',
				code: nextCode
			},
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		);
	} else {
		return Response.json(
			{
				result: 'incorrect',
				hint: 'try again'
			},
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		);
	}
};
