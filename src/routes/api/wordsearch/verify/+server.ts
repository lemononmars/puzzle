import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json().catch(() => ({}));
		const { grid, words, selectionCoords } = body;

		if (
			!grid ||
			!Array.isArray(grid) ||
			!words ||
			!Array.isArray(words) ||
			!selectionCoords ||
			!Array.isArray(selectionCoords)
		) {
			return Response.json(
				{ error: 'Invalid payload: grid, words, and selectionCoords are required' } as any,
				{ status: 400 }
			);
		}

		if (selectionCoords.length === 0) {
			return Response.json({ matched: false } as any, { status: 200 });
		}

		// Extract characters from grid
		const selectedText = selectionCoords
			.map(([r, c]: [number, number]) => (grid[r] && grid[r][c] ? grid[r][c] : ''))
			.join('');
		const reversedText = selectedText.split('').reverse().join('');
		const cleanSel = selectedText.normalize('NFC').trim();
		const cleanRev = reversedText.normalize('NFC').trim();

		let matchedWord: string | null = null;
		let matchedIndex = -1;

		for (let i = 0; i < words.length; i++) {
			const w = words[i];
			const wordStr = typeof w === 'string' ? w : w.word || '';
			const cleanW = wordStr.normalize('NFC').trim();
			const charsStr = Array.isArray(w.chars) ? w.chars.join('').normalize('NFC').trim() : '';

			const matches =
				wordStr === selectedText ||
				wordStr === reversedText ||
				cleanW === cleanSel ||
				cleanW === cleanRev ||
				(charsStr && (charsStr === cleanSel || charsStr === cleanRev));

			if (matches) {
				matchedWord = wordStr;
				matchedIndex = i;
				break;
			}
		}

		if (matchedWord) {
			return Response.json(
				{
					matched: true,
					word: matchedWord,
					index: matchedIndex,
					line: {
						startR: selectionCoords[0][0],
						startC: selectionCoords[0][1],
						endR: selectionCoords[selectionCoords.length - 1][0],
						endC: selectionCoords[selectionCoords.length - 1][1]
					}
				} as any,
				{ status: 200 }
			);
		}

		return Response.json({ matched: false } as any, { status: 200 });
	} catch (err: any) {
		return Response.json({ error: err.message || 'Failed to verify word search line' } as any, {
			status: 500
		});
	}
};
