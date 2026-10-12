import { describe, expect, it } from 'vitest';
import {
	MECHANIC_DETAILS,
	getAllMechanicIds,
	getAdjacentMechanics
} from './puzzleMechanicDetails';
import { PUZZLE_MECHANIC_CHAPTERS } from './puzzleMechanics';

describe('puzzleMechanicDetails dictionary', () => {
	it('has detail pages for every catalog entry', () => {
		const ids = getAllMechanicIds();
		const catalogIds = PUZZLE_MECHANIC_CHAPTERS.flatMap((chapter) => chapter.mechanics.map((mechanic) => mechanic.id));
		expect([...ids].sort()).toEqual(catalogIds.sort());
	});

	it('has complete information, valid vector SVG, and answers for every mechanic', () => {
		for (const [id, detail] of Object.entries(MECHANIC_DETAILS)) {
			expect(detail.id).toBe(id);
			expect(detail.englishTitle.trim()).not.toBe('');
			expect(detail.thaiTitle.trim()).not.toBe('');
			expect(detail.japaneseTitle.trim()).not.toBe('');
			expect(detail.detailedDescription.trim().length).toBeGreaterThan(20);
			expect(detail.solvingTechnique.trim().length).toBeGreaterThan(10);
			expect(detail.technicalTerms.length).toBeGreaterThanOrEqual(2);

			for (const term of detail.technicalTerms) {
				expect(term.en.trim()).not.toBe('');
				expect(term.ja.trim()).not.toBe('');
				expect(term.th.trim()).not.toBe('');
			}

			expect(detail.puzzle.svg).toContain('<svg');
			expect(detail.puzzle.svg).toContain('</svg>');
			expect(detail.puzzle.solutionSvg).toContain('<svg');
			expect(detail.puzzle.solutionSvg).toContain('</svg>');
			expect(detail.puzzle.acceptedAnswers.length).toBeGreaterThanOrEqual(1);
			expect(detail.puzzle.answerDisplay.trim()).not.toBe('');
			expect(detail.puzzle.solutionExplanation.trim().length).toBeGreaterThan(10);
		}
	});

	it('calculates previous and next navigation links properly', () => {
		const firstAdj = getAdjacentMechanics('answer-the-question-mark');
		expect(firstAdj.prev).toBeNull();
		expect(firstAdj.next).not.toBeNull();
		expect(firstAdj.next?.id).toBe('read-in-number-order');

		const secondAdj = getAdjacentMechanics('read-in-number-order');
		expect(secondAdj.prev?.id).toBe('answer-the-question-mark');
		expect(secondAdj.next?.id).toBe('follow-the-arrows');
	});
});
