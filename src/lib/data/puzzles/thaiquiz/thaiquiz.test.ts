import { describe, it, expect } from 'vitest';
import { THAI_QUIZ_DATABASE, THAI_QUIZ_CATEGORIES } from './questions';
import {
	getQuizQuestions,
	calculateQuestionScore,
	calculateQuizShowScore,
	validateQuizShowAnswer
} from './engine';

describe('Thai Quiz Dataset & Engine', () => {
	it('should have 100% genuine questions with 4 choices, rich funnel clues, and acceptableAnswers', () => {
		expect(THAI_QUIZ_DATABASE.length).toBeGreaterThanOrEqual(800);

		// Synthetic dummy filler pattern detector
		const syntheticFillerRegex =
			/ลำดับที่\s*\d+|แห่งที่\s*\d+|รายการที่\s*\d+|พื้นที่อนุรักษ์ธรรมชาติ\s*\d+|องค์ความรู้วิทยาศาสตร์|ป๊อปคัลเจอร์ญี่ปุ่นลำดับที่|ประเพณีและวัฒนธรรมลำดับที่|อาหารและวัฒนธรรมการกินลำดับที่|ประวัติศาสตร์และมรดกไทยลำดับที่/;

		for (const q of THAI_QUIZ_DATABASE) {
			expect(q.id).toBeTypeOf('number');
			// Rephrased funnel questions are descriptive (> 25 characters)
			expect(q.question.trim().length).toBeGreaterThan(25);
			expect(q.choices).toHaveLength(4);
			expect(q.correctIndex).toBeGreaterThanOrEqual(0);
			expect(q.correctIndex).toBeLessThanOrEqual(3);
			expect(q.explanation.trim().length).toBeGreaterThan(5);

			// Must NOT contain synthetic template filler patterns
			expect(syntheticFillerRegex.test(q.question)).toBe(false);
			for (const c of q.choices) {
				expect(syntheticFillerRegex.test(c)).toBe(false);
			}

			// Must have explicit acceptable answers list
			expect(Array.isArray(q.acceptableAnswers)).toBe(true);
			expect(q.acceptableAnswers.length).toBeGreaterThan(0);

			// All choices must be non-empty and unique
			const uniqueChoices = new Set(q.choices);
			expect(uniqueChoices.size).toBe(4);
		}
	});

	it('should cover all 9 Thai Quiz categories with at least 100 genuine questions each', () => {
		expect(THAI_QUIZ_CATEGORIES).toHaveLength(9);
		for (const cat of THAI_QUIZ_CATEGORIES) {
			const items = THAI_QUIZ_DATABASE.filter((q) => q.category === cat.id);
			expect(items.length).toBeGreaterThanOrEqual(100);
		}
	});

	it('should keep every 2026 question sourced and ready for periodic review', () => {
		const questions2026 = THAI_QUIZ_DATABASE.filter((q) => q.category === 'year_2026');
		expect(questions2026).toHaveLength(100);
		for (const question of questions2026) {
			expect(question.provenance?.sourceUrl).toMatch(/^https:\/\//);
			expect(question.provenance?.factCheckedAt).toBe('2026-08-31');
			expect(question.blueprint?.knowledgePoint.trim().length).toBeGreaterThan(0);
			expect(question.quality?.reviewStatus).toBe('approved');
		}
	});

	it('should not contain duplicate IDs or duplicate question text', () => {
		const ids = new Set<number>();
		const questions = new Set<string>();
		for (const item of THAI_QUIZ_DATABASE) {
			const normalizedQuestion = item.question
				.trim()
				.toLocaleLowerCase('th-TH')
				.replace(/\s+/g, ' ');
			expect(ids.has(item.id), `duplicate id ${item.id}`).toBe(false);
			expect(questions.has(normalizedQuestion), `duplicate question ${item.question}`).toBe(false);
			ids.add(item.id);
			questions.add(normalizedQuestion);
		}
	});

	it('should generate shuffled questions and preserve correct choice text', () => {
		const questions = getQuizQuestions({ count: 5, shuffleChoices: true });
		expect(questions).toHaveLength(5);

		for (const q of questions) {
			const original = THAI_QUIZ_DATABASE.find((item) => item.id === q.id)!;
			const correctText = original.choices[original.correctIndex];
			expect(q.choices[q.correctIndex]).toBe(correctText);
		}
	});

	it('should deterministically generate questions with the same seed', () => {
		const seed = 20260823;
		const run1 = getQuizQuestions({ count: 5, seed });
		const run2 = getQuizQuestions({ count: 5, seed });

		expect(run1.map((q) => q.id)).toEqual(run2.map((q) => q.id));
		expect(run1.map((q) => q.choices)).toEqual(run2.map((q) => q.choices));
	});

	it('should exclude questions already used in the current game', () => {
		const first = getQuizQuestions({ count: 20, seed: 42 });
		const second = getQuizQuestions({ count: 20, seed: 43, excludeIds: first.map((q) => q.id) });
		const firstIds = new Set(first.map((q) => q.id));
		expect(second.some((q) => firstIds.has(q.id))).toBe(false);
	});

	it('should correctly calculate streak and time bonuses', () => {
		const zero = calculateQuestionScore(false, 0);
		expect(zero.points).toBe(0);

		const base = calculateQuestionScore(true, 0, 0);
		expect(base.points).toBe(100);

		const withStreakAndTime = calculateQuestionScore(true, 3, 5);
		expect(withStreakAndTime.points).toBeGreaterThan(145);
		expect(withStreakAndTime.bonus).toBe(25);
	});

	it('should award a larger Quiz Show bonus for an earlier buzz', () => {
		const early = calculateQuizShowScore(100, 20, 1);
		const late = calculateQuizShowScore(100, 90, 1);
		expect(early.points).toBeGreaterThan(late.points);
		expect(early.buzzedCharIndex).toBe(20);
		expect(late.buzzedCharIndex).toBe(90);
	});

	it('should accurately validate quiz show answers without false positives', () => {
		const target = 'ดอกราชพฤกษ์ (คูน)';
		const acceptable = ['ราชพฤกษ์', 'ดอกราชพฤกษ์', 'คูน', 'ดอกคูน', 'ต้นคูน', 'ต้นราชพฤกษ์'];

		// False matches that must NOT pass
		expect(validateQuizShowAnswer('ชบา', target, acceptable)).toBe(false);
		expect(validateQuizShowAnswer('ดอกชบา', target, acceptable)).toBe(false);
		expect(validateQuizShowAnswer('ดอกกุหลาบ', target, acceptable)).toBe(false);
		expect(validateQuizShowAnswer('ดอกมะลิ', target, acceptable)).toBe(false);
		expect(validateQuizShowAnswer('ดอกไม้', target, acceptable)).toBe(false);
		expect(validateQuizShowAnswer('สัญลักษณ์', target, acceptable)).toBe(false);

		// Valid matches that MUST pass
		expect(validateQuizShowAnswer('ดอกราชพฤกษ์', target, acceptable)).toBe(true);
		expect(validateQuizShowAnswer('ราชพฤกษ์', target, acceptable)).toBe(true);
		expect(validateQuizShowAnswer('คูน', target, acceptable)).toBe(true);
		expect(validateQuizShowAnswer('ดอกคูน', target, acceptable)).toBe(true);
		expect(validateQuizShowAnswer('ต้นคูน', target, acceptable)).toBe(true);

		// Province and person aliases
		expect(validateQuizShowAnswer('โคราช', 'นครราชสีมา', ['นครราชสีมา', 'โคราช'])).toBe(true);
		expect(validateQuizShowAnswer('นครราชสีมา', 'นครราชสีมา', ['นครราชสีมา', 'โคราช'])).toBe(true);
		expect(validateQuizShowAnswer('พระนเรศวร', 'สมเด็จพระนเรศวรมหาราช', ['พระนเรศวร'])).toBe(true);
		expect(
			validateQuizShowAnswer('มารีกีมาร์', 'ท้าวทองกีบม้า (มารี กีมาร์)', [
				'ท้าวทองกีบม้า',
				'มารีกีมาร์'
			])
		).toBe(true);

		// Typo tolerance (1-2 letters off)
		expect(
			validateQuizShowAnswer('โดราเอมอล', 'โดราเอมอน (Doraemon)', ['โดราเอมอน', 'Doraemon'])
		).toBe(true);
		expect(
			validateQuizShowAnswer('โกโจ ซาโตรู', 'โกโจ ซาโตรุ (Gojo Satoru)', ['โกโจ ซาโตรุ', 'Gojo'])
		).toBe(true);
		expect(validateQuizShowAnswer('พระนเรสวน', 'สมเด็จพระนเรศวรมหาราช', ['พระนเรศวร'])).toBe(true);
		expect(validateQuizShowAnswer('สุราษธานี', 'สุราษฎร์ธานี', ['สุราษฎร์ธานี'])).toBe(true);
		expect(validateQuizShowAnswer('pikachuu', 'พิคาชู (Pikachu)', ['พิคาชู', 'Pikachu'])).toBe(
			true
		);
	});

});
