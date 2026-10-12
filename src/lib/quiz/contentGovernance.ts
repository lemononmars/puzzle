import type {
	QuestionBlueprint,
	QuestionProvenance,
	QuestionQualityMetadata,
	ThaiQuizItem
} from '#lib/data/puzzles/thaiquiz/types.js';

export type ReviewFindingCode =
	| 'missing_source'
	| 'stale_fact_check'
	| 'missing_blueprint'
	| 'short_explanation'
	| 'duplicate_choices'
	| 'weak_stem';

export interface QuestionReviewRecord {
	questionKey: string;
	provenance?: QuestionProvenance;
	blueprint?: QuestionBlueprint;
	quality?: QuestionQualityMetadata;
	difficulty?: 'easy' | 'normal' | 'hard';
	empiricalCorrectRate?: number;
	ratingUp?: number;
	ratingDown?: number;
}

export interface QuestionAudit {
	questionKey: string;
	score: number;
	findings: Array<{ code: ReviewFindingCode; messageTh: string }>;
	reviewStatus: QuestionQualityMetadata['reviewStatus'];
	calibratedDifficulty: 'easy' | 'normal' | 'hard';
	blueprint: QuestionBlueprint;
	provenance?: QuestionProvenance;
}

export const REVIEW_LANGUAGE_TH: Record<ReviewFindingCode, string> = {
	missing_source: 'ยังไม่มีแหล่งอ้างอิงที่ตรวจสอบย้อนกลับได้',
	stale_fact_check: 'ข้อเท็จจริงถึงกำหนดทบทวนแล้ว',
	missing_blueprint: 'ยังไม่ได้ระบุจุดความรู้และทักษะที่วัด',
	short_explanation: 'คำอธิบายสั้นเกินไป ควรบอกเหตุผลที่คำตอบถูก',
	duplicate_choices: 'ตัวเลือกซ้ำหรือใกล้เคียงกันเกินไป',
	weak_stem: 'คำถามสั้นหรือกำกวม ควรระบุสิ่งที่ต้องการถามให้ชัดเจน'
};

export function questionKey(question: Pick<ThaiQuizItem, 'id' | 'category'>): string {
	return `thaiquiz:${question.category}:${question.id}`;
}

export function inferQuestionBlueprint(question: ThaiQuizItem): QuestionBlueprint {
	const text = `${question.question} ${question.tags.join(' ')}`;
	let answerForm: QuestionBlueprint['answerForm'] = 'other';
	if (/ใคร|บุคคล|กษัตริย์|นัก/.test(text)) answerForm = 'person';
	else if (/ที่ไหน|จังหวัด|ประเทศ|สถานที่|เมือง/.test(text)) answerForm = 'place';
	else if (/ปีใด|เมื่อใด|พ.ศ.|ค.ศ.|วันที่/.test(text)) answerForm = 'date';
	else if (/เท่าไร|จำนวน|กี่/.test(text)) answerForm = 'number';
	else if (/เรื่องใด|ผลงาน|หนังสือ|เพลง/.test(text)) answerForm = 'work';
	else answerForm = 'term';

	const skill: QuestionBlueprint['skill'] = /เพราะเหตุใด|อย่างไร/.test(text)
		? 'understand'
		: /แตกต่าง|เปรียบเทียบ/.test(text)
			? 'compare'
			: 'recall';
	return { skill, knowledgePoint: question.tags[0] || question.category, answerForm };
}

export function calibrateDifficulty(
	declared: ThaiQuizItem['difficulty'],
	empiricalCorrectRate?: number
): ThaiQuizItem['difficulty'] {
	if (typeof empiricalCorrectRate !== 'number') return declared;
	if (empiricalCorrectRate >= 0.78) return 'easy';
	if (empiricalCorrectRate <= 0.42) return 'hard';
	return 'normal';
}

export function auditQuestion(
	question: ThaiQuizItem,
	review?: QuestionReviewRecord
): QuestionAudit {
	const findings: QuestionAudit['findings'] = [];
	const provenance = review?.provenance || question.provenance;
	const blueprint = review?.blueprint || question.blueprint || inferQuestionBlueprint(question);
	if (!provenance?.sourceUrl || !provenance.sourceTitle) findings.push(finding('missing_source'));
	if (provenance?.reviewAfter && Date.parse(provenance.reviewAfter) < Date.now())
		findings.push(finding('stale_fact_check'));
	if (!review?.blueprint && !question.blueprint) findings.push(finding('missing_blueprint'));
	if (question.explanation.trim().length < 24) findings.push(finding('short_explanation'));
	if (
		new Set(question.choices.map((choice) => choice.trim().toLocaleLowerCase('th-TH'))).size !==
		question.choices.length
	) {
		findings.push(finding('duplicate_choices'));
	}
	if (question.question.trim().length < 18) findings.push(finding('weak_stem'));
	return {
		questionKey: questionKey(question),
		score: Math.max(0, 100 - findings.length * 16),
		findings,
		reviewStatus: review?.quality?.reviewStatus || question.quality?.reviewStatus || 'needs_review',
		calibratedDifficulty: calibrateDifficulty(
			review?.difficulty || question.difficulty,
			review?.empiricalCorrectRate
		),
		blueprint,
		provenance
	};
}

function finding(code: ReviewFindingCode) {
	return { code, messageTh: REVIEW_LANGUAGE_TH[code] };
}
