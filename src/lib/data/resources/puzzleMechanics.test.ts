import { describe, expect, it } from 'vitest';
import { PUZZLE_MECHANIC_CHAPTERS } from './puzzleMechanics';

describe('puzzle mechanics reference', () => {

	it('has unique anchors and all three requested title languages', () => {
		const mechanics = PUZZLE_MECHANIC_CHAPTERS.flatMap((chapter) => chapter.mechanics);
		expect(new Set(mechanics.map((mechanic) => mechanic.id)).size).toBe(mechanics.length);
		for (const mechanic of mechanics) {
			expect(mechanic.englishTitle.trim()).not.toBe('');
			expect(mechanic.thaiTitle.trim()).not.toBe('');
			expect(mechanic.japaneseTitle.trim()).not.toBe('');
			expect(mechanic.description.trim().length).toBeGreaterThan(20);
		}
	});
});
