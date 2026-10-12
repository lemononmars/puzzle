import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { QuestionReviewRecord } from '#lib/quiz/contentGovernance.js';
import { recordDiagnostic } from '#lib/diagnostics.js';

export interface FeedbackSummary {
	up: number;
	down: number;
	attempts: number;
	correct: number;
}

export interface QuestionGovernanceRepository {
	listReviews(): Promise<QuestionReviewRecord[]>;
	putReview(review: QuestionReviewRecord): Promise<void>;
	recordFeedback(input: {
		questionKey: string;
		category: string;
		rating: -1 | 1;
		reason?: string;
	}): Promise<void>;
	recordOutcome(input: {
		questionKey: string;
		category: string;
		isCorrect: boolean;
	}): Promise<void>;
	feedbackSummary(): Promise<Record<string, FeedbackSummary>>;
}

class MemoryQuestionGovernanceRepository implements QuestionGovernanceRepository {
	private reviews = new Map<string, QuestionReviewRecord>();
	private feedback: Array<{ questionKey: string; rating: -1 | 1 }> = [];
	private outcomes: Array<{ questionKey: string; isCorrect: boolean }> = [];
	async listReviews() {
		return Array.from(this.reviews.values());
	}
	async putReview(review: QuestionReviewRecord) {
		this.reviews.set(review.questionKey, review);
	}
	async recordFeedback(input: { questionKey: string; rating: -1 | 1 }) {
		this.feedback.push(input);
	}
	async recordOutcome(input: { questionKey: string; isCorrect: boolean }) {
		this.outcomes.push(input);
	}
	async feedbackSummary() {
		const result: Record<string, FeedbackSummary> = {};
		for (const item of this.feedback) {
			const summary = result[item.questionKey] || { up: 0, down: 0, attempts: 0, correct: 0 };
			item.rating === 1 ? summary.up++ : summary.down++;
			result[item.questionKey] = summary;
		}
		for (const item of this.outcomes) {
			const summary = result[item.questionKey] || { up: 0, down: 0, attempts: 0, correct: 0 };
			summary.attempts++;
			if (item.isCorrect) summary.correct++;
			result[item.questionKey] = summary;
		}
		return result;
	}
}

class SupabaseQuestionGovernanceRepository implements QuestionGovernanceRepository {
	constructor(private client: SupabaseClient) {}
	async listReviews() {
		const { data, error } = await this.client.from('quiz_question_reviews').select('review');
		if (error) throw error;
		return (data || []).map((row) => row.review as QuestionReviewRecord);
	}
	async putReview(review: QuestionReviewRecord) {
		const { error } = await this.client.from('quiz_question_reviews').upsert({
			question_key: review.questionKey,
			review,
			updated_at: new Date().toISOString()
		});
		if (error) throw error;
	}
	async recordFeedback(input: {
		questionKey: string;
		category: string;
		rating: -1 | 1;
		reason?: string;
	}) {
		const { error } = await this.client.from('quiz_question_feedback').insert({
			question_key: input.questionKey,
			category: input.category,
			rating: input.rating,
			reason: input.reason?.slice(0, 240) || null
		});
		if (error) throw error;
	}
	async recordOutcome(input: { questionKey: string; category: string; isCorrect: boolean }) {
		const { error } = await this.client.from('quiz_question_outcomes').insert({
			question_key: input.questionKey,
			category: input.category,
			is_correct: input.isCorrect
		});
		if (error) throw error;
	}
	async feedbackSummary() {
		const [{ data, error }, { data: outcomes, error: outcomeError }] = await Promise.all([
			this.client.from('quiz_question_feedback').select('question_key, rating'),
			this.client.from('quiz_question_outcomes').select('question_key, is_correct')
		]);
		if (error || outcomeError) throw error || outcomeError;
		const result: Record<string, FeedbackSummary> = {};
		for (const row of data || []) {
			const summary = result[row.question_key] || { up: 0, down: 0, attempts: 0, correct: 0 };
			row.rating === 1 ? summary.up++ : summary.down++;
			result[row.question_key] = summary;
		}
		for (const row of outcomes || []) {
			const summary = result[row.question_key] || { up: 0, down: 0, attempts: 0, correct: 0 };
			summary.attempts++;
			if (row.is_correct) summary.correct++;
			result[row.question_key] = summary;
		}
		return result;
	}
}

function createRepository(): QuestionGovernanceRepository {
	const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (url && key)
		return new SupabaseQuestionGovernanceRepository(
			createClient(url, key, {
				auth: { persistSession: false, autoRefreshToken: false }
			})
		);
	recordDiagnostic('quiz.governance_repository_fallback', { adapter: 'memory' }, 'warn');
	return new MemoryQuestionGovernanceRepository();
}

export const questionGovernanceRepository = createRepository();
