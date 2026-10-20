import { describe, expect, it } from 'vitest';
import { crypticClues, letterBoxes } from './crypticClue.js';

describe('Thai cryptic letter boxes', () => {
	it('keeps stacked vowels and tone marks with their middle letter', () => {
		expect(letterBoxes('กุ้ง')).toEqual(['กุ้', 'ง']);
		expect(letterBoxes('สิงหา')).toEqual(['สิ', 'ง', 'ห', 'า']);
		expect(letterBoxes('เก้า')).toEqual(['เ', 'ก้', 'า']);
	});
	it('provides three usable highlight spans for every clue', () => {
		expect(crypticClues).toHaveLength(20);
		for (const puzzle of crypticClues) {
			expect(puzzle.hints.map(hint => hint.key)).toEqual(['definition', 'wordplay', 'fodder']);
			for (const hint of puzzle.hints) for (const part of hint.parts) expect(puzzle.clue.includes(part)).toBe(true);
		}
	});
	it('keeps the revised clue roles distinct', () => {
		expect(crypticClues[4].hints.find(hint => hint.key === 'fodder')?.parts).toEqual(['หอ', 'กีฬานักชก']);
		expect(crypticClues[14].definition).toBe('ในวัด');
	});
});
