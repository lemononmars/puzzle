import type { ThaiQuizCategory } from '#lib/data/puzzles/thaiquiz/types.js';
import type { QuizSessionRepository } from './quizSessionRepository';
import { createQuizSessionRepository } from './quizSessionRepository';
import { questionGovernanceRepository } from './questionGovernanceRepository';

const SESSION_TYPES = new Set(['thechase', 'thaiquiz', 'quizshow']);
const CHASE_PACKS = new Set([1, 2, 3, 4, 5]);

export interface QuizSession {
	id: string;
	type: 'thechase' | 'thaiquiz' | 'quizshow';
	mode?: string;
	category?: string;
	createdAt: number;
	currentIndex: number;
	score: number;
	streak: number;
	maxStreak: number;
	questions: Array<{
		id: number;
		question: string;
		choices: string[];
		correctIndex: number;
		explanation: string;
		category: string;
		difficulty?: string;
		acceptableAnswers?: string[];
	}>;
}

const SESSION_TTL_MS = 2 * 60 * 60 * 1000;

let repository: QuizSessionRepository = createQuizSessionRepository();
export function setQuizSessionRepository(next: QuizSessionRepository): void {
	repository = next;
}

export async function createQuizSession(options: {
	type: 'thechase' | 'thaiquiz' | 'quizshow';
	count?: number;
	category?: ThaiQuizCategory | string;
	mode?: string;
	pack?: number;
	excludeIds?: number[];
}): Promise<QuizSession> {
	if (!SESSION_TYPES.has(options.type)) throw new Error('Invalid quiz session type');
	if (
		options.pack !== undefined &&
		(!Number.isInteger(options.pack) || !CHASE_PACKS.has(options.pack))
	) {
		throw new Error('Invalid Chase pack');
	}

	const sessionId =
		'qs_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
	const defaultCount = options.type === 'thechase' ? 25 : 10;
	const requestedCount =
		typeof options.count === 'number' && Number.isFinite(options.count)
			? Math.trunc(options.count)
			: defaultCount;
	const count = Math.min(50, Math.max(1, requestedCount));

	let rawQuestions: any[] = [];

	if (options.type === 'thechase') {
		const { getChaseQuestions } = await import('#lib/data/puzzles/thechase/questions.js');
		rawQuestions = getChaseQuestions({
			count,
			category: options.category && options.category !== 'all' ? options.category : undefined,
			pack: options.pack,
			excludeIds: options.excludeIds
		});
	} else {
		const { getQuizQuestions } = await import('#lib/data/puzzles/thaiquiz/engine.js');
		const reviewRecords = await questionGovernanceRepository.listReviews().catch(() => []);
		const reviews = new Map(reviewRecords.map((review) => [review.questionKey, review]));
		rawQuestions = getQuizQuestions({
			count: Math.min(50, count + 10),
			category:
				options.category && options.category !== 'all'
					? (options.category as ThaiQuizCategory)
					: 'all'
		})
			.filter(
				(question) =>
					reviews.get(`thaiquiz:${question.category}:${question.id}`)?.quality?.reviewStatus !==
					'retired'
			)
			.map((question) => {
				const review = reviews.get(`thaiquiz:${question.category}:${question.id}`);
				return review?.difficulty ? { ...question, difficulty: review.difficulty } : question;
			})
			.slice(0, count);
	}

	const session: QuizSession = {
		id: sessionId,
		type: options.type,
		mode: options.mode,
		category: options.category,
		createdAt: Date.now(),
		currentIndex: 0,
		score: 0,
		streak: 0,
		maxStreak: 0,
		questions: rawQuestions.map((q) => ({
			id: q.id,
			question: q.question,
			choices: q.choices,
			correctIndex: q.correctIndex,
			explanation: q.explanation || '',
			category: q.category,
			difficulty: q.difficulty,
			acceptableAnswers: q.acceptableAnswers
		}))
	};

	await repository.put(session);
	return session;
}

export async function getQuizSession(sessionId: string): Promise<QuizSession | null> {
	const session = await repository.get(sessionId);
	if (!session) return null;
	if (Date.now() - session.createdAt > SESSION_TTL_MS) {
		await repository.delete(sessionId);
		return null;
	}
	return session;
}

export function getStrippedQuestion(session: QuizSession, index: number) {
	if (index < 0 || index >= session.questions.length) return null;
	const q = session.questions[index];
	return {
		sessionId: session.id,
		index,
		total: session.questions.length,
		id: q.id,
		question: q.question,
		choices: q.choices,
		category: q.category,
		difficulty: q.difficulty
		// Notice: correctIndex, explanation & acceptableAnswers are STRICTLY STRIPPED
	};
}

export async function verifySessionAnswer(
	sessionId: string,
	questionId: number,
	chosenIndex: number | undefined,
	textAnswer: string | undefined,
	skip: boolean,
	simulateAccuracy: number | undefined = undefined,
	timeRemainingRatio = 1.0
) {
	const session = await getQuizSession(sessionId);
	if (!session) {
		return { error: 'Session expired or not found' };
	}

	const currentQ = session.questions[session.currentIndex];
	if (!currentQ || currentQ.id !== questionId) return { error: 'Question is not current' };
	let isCorrect = false;
	let resolvedChoiceIndex = chosenIndex;
	if (skip) {
		isCorrect = false;
	} else if (session.type === 'thechase' && typeof simulateAccuracy === 'number') {
		const accuracy = Math.min(1, Math.max(0, simulateAccuracy));
		const incorrect = currentQ.choices
			.map((_choice, index) => index)
			.filter((index) => index !== currentQ.correctIndex);
		resolvedChoiceIndex =
			Math.random() < accuracy
				? currentQ.correctIndex
				: incorrect[Math.floor(Math.random() * incorrect.length)];
		isCorrect = resolvedChoiceIndex === currentQ.correctIndex;
	} else if (session.type === 'quizshow') {
		if (typeof textAnswer !== 'string' || !textAnswer.trim())
			return { error: 'Invalid text answer' };
		const { validateQuizShowAnswer } = await import('#lib/data/puzzles/thaiquiz/engine.js');
		isCorrect = validateQuizShowAnswer(
			textAnswer,
			currentQ.choices[currentQ.correctIndex],
			currentQ.acceptableAnswers
		);
	} else {
		if (
			!Number.isInteger(chosenIndex) ||
			chosenIndex! < 0 ||
			chosenIndex! >= currentQ.choices.length
		) {
			return { error: 'Invalid choice index' };
		}
		isCorrect = resolvedChoiceIndex === currentQ.correctIndex;
	}
	const safeTimeRemainingRatio = Number.isFinite(timeRemainingRatio)
		? Math.min(1, Math.max(0, timeRemainingRatio))
		: 1;

	let points = 0;
	if (isCorrect) {
		session.streak++;
		if (session.streak > session.maxStreak) session.maxStreak = session.streak;
		// Base: 100 pts + streak bonus (up to 50 pts) + time speed multiplier
		const streakBonus = Math.min(50, (session.streak - 1) * 10);
		points = Math.round((100 + streakBonus) * Math.max(0.5, safeTimeRemainingRatio));
		session.score += points;
	} else {
		session.streak = 0;
	}

	const finalized = session.type !== 'quizshow' || isCorrect || skip;
	if (finalized) session.currentIndex++;
	await repository.put(session);
	if (finalized && session.type !== 'thechase') {
		void questionGovernanceRepository
			.recordOutcome({
				questionKey: `thaiquiz:${currentQ.category}:${currentQ.id}`,
				category: currentQ.category,
				isCorrect
			})
			.catch(() => undefined);
	}

	return {
		isCorrect,
		correctIndex: finalized ? currentQ.correctIndex : -1,
		explanation: finalized ? currentQ.explanation : '',
		points,
		totalScore: session.score,
		streak: session.streak,
		maxStreak: session.maxStreak,
		isCompleted: finalized && session.currentIndex >= session.questions.length,
		nextQuestion: getStrippedQuestion(session, session.currentIndex),
		chosenIndex: resolvedChoiceIndex
	};
}
