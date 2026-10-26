import { describe, expect, it } from 'vitest';
import { matchesAnswer, tiles, wordPieces } from './wordpieces.js';

describe('five-word fragment puzzle', () => {
	it('consumes the entire bank across exactly five answers', () => {
		expect(wordPieces).toHaveLength(5);
		const used: string[] = [];
		wordPieces.forEach((_, index) => {
			const ids = tiles.filter(tile => tile.id.startsWith(`${index}-`)).map(tile => tile.id);
			expect(matchesAnswer(index, ids, used)).toBe(true);
			used.push(...ids);
		});
		expect(used).toHaveLength(tiles.length);
	});
	it('accepts identical fragments interchangeably but prevents reusing tiles', () => {
		expect(matchesAnswer(0, ['1-0', '0-1'], [])).toBe(true);
		expect(matchesAnswer(2, ['2-0', '3-0'], [])).toBe(true);
		expect(matchesAnswer(0, ['1-0', '0-1'], ['1-0'])).toBe(false);
		expect(matchesAnswer(0, ['0-0', '0-0'], [])).toBe(false);
	});
	it('rejects wrong order, incomplete answers and unknown IDs', () => {
		expect(matchesAnswer(0, ['0-1', '0-0'], [])).toBe(false);
		expect(matchesAnswer(0, ['0-0'], [])).toBe(false);
		expect(matchesAnswer(0, ['missing'], [])).toBe(false);
	});
});
