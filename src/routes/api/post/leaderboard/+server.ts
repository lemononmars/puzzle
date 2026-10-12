import { from } from '#lib/supabase.js';
import type { Leaderboard } from '#lib/interfaces/index.js';
import { sendhook } from '#lib/discordServer.js';
import type { RequestHandler } from './$types';

async function isDuplicateSubmission(
	puzzle_type: string,
	puzzle_id: string | number,
	name: string
): Promise<boolean> {
	if (puzzle_type === 'blanks' || puzzle_type === 'spellingquiz') {
		return false;
	}

	const { data: duplicateData } = await from('leaderboard')
		.select('*')
		.eq('puzzle_type', puzzle_type)
		.eq('puzzle_id', puzzle_id)
		.eq('name', name);

	return !!(duplicateData && duplicateData.length > 0);
}

export const POST: RequestHandler = async ({ request }) => {
	const submission: Leaderboard & { verification_token?: string } = await request.json();
	const { name, puzzle_type, puzzle_id, verification_token } = submission;

	if (['weekly', 'seventh', 'tbs2021'].includes(puzzle_type))
		return Response.json({ error: 'This puzzle type has been retired.' }, { status: 410 });

	// check for duplicate (skip for blanks and spellingquiz)
	if (await isDuplicateSubmission(puzzle_type, puzzle_id, name)) {
		return Response.json(
			{ error: 'You have already submitted a score for this puzzle.' },
			{ status: 400 }
		);
	}

	let finalScore = submission.score;

	const recordToInsert = {
		name,
		puzzle_type,
		puzzle_id,
		score: finalScore
	};

	const { data, error } = await from('leaderboard').insert(recordToInsert);

	if (error) {
		sendhook(':x: error submitting ' + puzzle_type + '/' + puzzle_id);
		return Response.json({ error: 'Internal server error' }, { status: 500 });
	}

	sendhook(
		':game_die: ' + puzzle_type + '/' + puzzle_id + ' solved by ' + name + ' - ' + submission.score
	);
	return Response.json(data, { status: 200 });
};
