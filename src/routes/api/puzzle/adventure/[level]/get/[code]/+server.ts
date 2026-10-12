import { json as json$1 } from '@sveltejs/kit';
import { adventureLevels } from '#lib/data/adventure_data.js';

/** @type {import('./[code]').RequestHandler} */
export async function GET({ params }: { params: Record<string, string> }) {
	const level = parseInt(params.level);
	const code = params.code;

	const stage = adventureLevels.find((l) => l.level === level);

	if (stage && stage.code === code) {
		return json$1(
			{
				result: 'correct',
				question: stage.question,
				image: ''
			},
			{
				headers: { 'Content-Type': 'application/json' }
			}
		);
	} else {
		return json$1(
			{
				result: 'incorrect',
				hint: 'wrong code or level'
			},
			{
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
}
