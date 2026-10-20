import type { RequestHandler } from './$types';
import crossroadData from '#lib/utils/crossroad_word.json';
import { wordLength } from '#lib/utils/thai-text.js';
import { signPayload } from '#lib/server/puzzleToken.js';

const words = Object.keys(crossroadData);
const wordListLength = words.length;

function getRandomClues(list: string[]) {
	const l = list.length;
	const clue1 = Math.floor(Math.random() * l);
	const clue2 = Math.floor(Math.random() * (l - 1));
	return [list[clue1], list[(clue1 + clue2 + 1) % l]];
}

export const GET: RequestHandler = async ({ url }) => {
	try {
		const lengthParam = url.searchParams.get('length');
		const desiredLength = lengthParam ? parseInt(lengthParam, 10) : 0;

		let chosenWord = '';
		let chosenData: { pre: string[]; post: string[] } | null = null;

		let attempts = 0;
		do {
			const idx = Math.floor(Math.random() * wordListLength);
			chosenWord = words[idx];
			chosenData = (crossroadData as any)[chosenWord];
			attempts++;
		} while (desiredLength > 0 && wordLength(chosenWord) !== desiredLength && attempts < 500);

		if (!chosenData) {
			chosenWord = words[0];
			chosenData = (crossroadData as any)[chosenWord];
		}
		if (!chosenData) {
			return Response.json({ error: 'Crossroad data is empty' } as any, { status: 503 });
		}

		const preClues = getRandomClues(chosenData.pre);
		const postClues = getRandomClues(chosenData.post);

		// Clues: [top, right, bottom, left]
		// top: postClues[0] + WORD
		// right: WORD + preClues[0]
		// bottom: WORD + preClues[1]
		// left: postClues[1] + WORD
		const token = signPayload({
			type: 'crossroad',
			answer: chosenWord,
			pre: chosenData.pre,
			post: chosenData.post
		});

		return Response.json(
			{
				token,
				length: wordLength(chosenWord),
				clues: {
					top: postClues[0],
					right: preClues[0],
					bottom: preClues[1],
					left: postClues[1]
				}
			} as any,
			{ status: 200 }
		);
	} catch (err: any) {
		return Response.json({ error: err.message || 'Failed to generate crossroad puzzle' } as any, {
			status: 500
		});
	}
};
