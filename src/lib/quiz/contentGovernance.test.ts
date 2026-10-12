import { describe, expect, it } from 'vitest';
import {
	auditQuestion,
	calibrateDifficulty,
	inferQuestionBlueprint,
	REVIEW_LANGUAGE_TH
} from './contentGovernance';
import type { ThaiQuizItem } from '#lib/data/puzzles/thaiquiz/types.js';
import { masteryLabel, masteryPercent } from './mastery';

const question: ThaiQuizItem = {
	id: 1,
	category: 'science',
	question: 'นักวิทยาศาสตร์ผู้เสนอทฤษฎีนี้คือใคร?',
	choices: ['คนหนึ่ง', 'คนสอง', 'คนสาม', 'คนสี่'],
	correctIndex: 0,
	acceptableAnswers: ['คนหนึ่ง'],
	explanation: 'คำตอบนี้เป็นผู้เสนอทฤษฎีและเผยแพร่ผลงานที่เป็นรากฐานของแนวคิดดังกล่าว',
	difficulty: 'normal',
	tags: ['นักวิทยาศาสตร์']
};

describe('quiz content governance', () => {
	it('uses consistent Thai review language and flags missing editorial metadata', () => {
		const audit = auditQuestion(question);
		expect(audit.findings.map((item) => item.code)).toContain('missing_source');
		expect(audit.findings.map((item) => item.code)).toContain('missing_blueprint');
		expect(audit.findings[0].messageTh).toBe(REVIEW_LANGUAGE_TH[audit.findings[0].code]);
	});

	it('infers a reusable blueprint from the stem and tags', () => {
		expect(inferQuestionBlueprint(question)).toEqual({
			skill: 'recall',
			knowledgePoint: 'นักวิทยาศาสตร์',
			answerForm: 'person'
		});
	});

	it('calibrates difficulty from observed correctness', () => {
		expect(calibrateDifficulty('hard', 0.9)).toBe('easy');
		expect(calibrateDifficulty('easy', 0.3)).toBe('hard');
		expect(calibrateDifficulty('easy', 0.6)).toBe('normal');
	});

	it('scores a sourced and reviewed question without metadata findings', () => {
		const audit = auditQuestion(question, {
			questionKey: 'thaiquiz:science:1',
			provenance: {
				sourceUrl: 'https://example.com/reference',
				sourceTitle: 'Reference',
				factCheckedAt: '2026-08-30'
			},
			blueprint: { skill: 'recall', knowledgePoint: 'นักวิทยาศาสตร์', answerForm: 'person' },
			quality: { reviewStatus: 'approved' }
		});
		expect(audit.findings).toEqual([]);
		expect(audit.score).toBe(100);
		expect(audit.reviewStatus).toBe('approved');
	});

	it('turns answer history into understandable mastery levels', () => {
		expect(masteryPercent({ attempts: 10, correct: 8, updatedAt: 1 })).toBe(80);
		expect(masteryLabel({ attempts: 10, correct: 8, updatedAt: 1 })).toBe('ชำนาญ');
		expect(masteryLabel({ attempts: 2, correct: 2, updatedAt: 1 })).toBe('กำลังเริ่มต้น');
	});
});
