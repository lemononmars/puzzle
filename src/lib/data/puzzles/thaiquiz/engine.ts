import { THAI_QUIZ_DATABASE } from './questions';
import type { ThaiQuizCategory } from './types';

export interface QuizQuestionInstance {
	id: number;
	category: ThaiQuizCategory;
	question: string;
	choices: string[];
	correctIndex: number;
	acceptableAnswers: string[];
	explanation: string;
	difficulty: 'easy' | 'normal' | 'hard';
	tags: string[];
}

function mulberry32(a: number) {
	return function () {
		let t = (a += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export function shuffleArray<T>(arr: T[], rng = Math.random): T[] {
	const copy = [...arr];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

export function getQuizQuestions(options: {
	category?: ThaiQuizCategory | 'all';
	count?: number;
	difficulty?: 'all' | 'easy' | 'normal' | 'hard';
	seed?: number;
	shuffleChoices?: boolean;
	excludeIds?: number[];
}): QuizQuestionInstance[] {
	const {
		category = 'all',
		count = 10,
		difficulty = 'all',
		seed,
		shuffleChoices = true,
		excludeIds = []
	} = options;

	const rng = typeof seed === 'number' ? mulberry32(seed) : Math.random;

	let pool = THAI_QUIZ_DATABASE.filter((q) => {
		if (category !== 'all' && q.category !== category) return false;
		if (difficulty !== 'all' && q.difficulty !== difficulty) return false;
		if (excludeIds.includes(q.id)) return false;
		return true;
	});

	if (pool.length === 0 && excludeIds.length === 0) {
		pool = THAI_QUIZ_DATABASE;
	}

	const selected = shuffleArray(pool, rng).slice(0, count);

	return selected.map((item) => {
		if (!shuffleChoices) {
			return {
				...item,
				choices: [...item.choices],
				acceptableAnswers: item.acceptableAnswers || [item.choices[item.correctIndex]]
			};
		}

		const choicesWithFlag = item.choices.map((c, idx) => ({
			text: c,
			isCorrect: idx === item.correctIndex
		}));

		const shuffled = shuffleArray(choicesWithFlag, rng);
		const newCorrectIndex = shuffled.findIndex((c) => c.isCorrect);

		return {
			id: item.id,
			category: item.category,
			question: item.question,
			choices: shuffled.map((c) => c.text),
			correctIndex: newCorrectIndex,
			acceptableAnswers: item.acceptableAnswers || [item.choices[item.correctIndex]],
			explanation: item.explanation,
			difficulty: item.difficulty,
			tags: item.tags
		};
	});
}

export function getDailySeed(): number {
	const d = new Date();
	return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export function calculateQuestionScore(
	isCorrect: boolean,
	streak: number,
	timeRemainingSec = 0
): { points: number; bonus: number } {
	if (!isCorrect) return { points: 0, bonus: 0 };
	const basePoints = 100;
	const streakMultiplier = Math.min(2.5, 1 + streak * 0.15);
	const timeBonus = Math.round(Math.max(0, timeRemainingSec) * 5);
	const total = Math.round(basePoints * streakMultiplier) + timeBonus;
	return { points: total, bonus: timeBonus };
}

export function calculateQuizShowScore(
	questionLength: number,
	buzzedCharIndex: number,
	streak: number
): { points: number; earlyBonus: number; buzzedCharIndex: number } {
	const safeLength = Math.max(1, Math.trunc(questionLength));
	const safeBuzzIndex = Math.min(safeLength, Math.max(0, Math.trunc(buzzedCharIndex)));
	const unrevealedFraction = (safeLength - safeBuzzIndex) / safeLength;
	const earlyBonus = Math.round(Math.max(0.3, unrevealedFraction) * 150);
	return {
		points: 100 + earlyBonus + Math.max(0, Math.trunc(streak)) * 10,
		earlyBonus,
		buzzedCharIndex: safeBuzzIndex
	};
}

// Clean punctuation, spaces, and formatting characters
function cleanThaiText(text: string): string {
	return text
		.toLowerCase()
		.replace(/[\s\(\)\[\]\{\}\-\–\—\_\,\.\'\"\/\\\|\:\;\?\!\+]/g, '')
		.replace(/^(จังหวัด|ดอย|แม่น้ำ|อำเภอ|ตำบล|พระ|นาง|ท้าว|นาย|วัด|อุทยาน|เกาะ|หาด|แหลม)/g, '')
		.trim();
}

// Extract acceptable answer variations from choice text (e.g. "ดอกราชพฤกษ์ (คูน)" -> ["ดอกราชพฤกษ์", "ราชพฤกษ์", "คูน", "ดอกคูน"])
export function extractAcceptableAliases(
	choiceText: string,
	customAcceptable: string[] = []
): string[] {
	const aliases = new Set<string>();

	for (const a of customAcceptable) {
		if (a.trim()) aliases.add(a.trim());
	}

	const raw = choiceText.trim();
	aliases.add(raw);

	// 1. Split on slash, dash, hyphen, or comma
	const parts = raw
		.split(/[\/\-\–\,]/)
		.map((p) => p.trim())
		.filter(Boolean);
	for (const p of parts) {
		aliases.add(p);
	}

	// 2. Extract parentheses content e.g. "ดอกราชพฤกษ์ (คูน)"
	const parenMatches = raw.match(/\(([^)]+)\)/g);
	if (parenMatches) {
		for (const pm of parenMatches) {
			const inside = pm.replace(/[\(\)]/g, '').trim();
			if (inside) {
				aliases.add(inside);
				if (raw.startsWith('ดอก') && !inside.startsWith('ดอก')) {
					aliases.add(`ดอก${inside}`);
				}
			}
		}
		const withoutParen = raw.replace(/\([^)]+\)/g, '').trim();
		if (withoutParen) aliases.add(withoutParen);
	}

	// 3. Known Thai nicknames and common abbreviations
	if (raw.includes('นครราชสีมา')) aliases.add('โคราช');
	if (raw.includes('กรุงเทพมหานคร')) aliases.add('กรุงเทพ');
	if (raw.includes('เชียงใหม่')) aliases.add('เจียงใหม่');
	if (raw.includes('ท้าวทองกีบม้า')) aliases.add('มารีกีมาร์');
	if (raw.includes('สมเด็จพระนเรศวร')) aliases.add('พระนเรศวร');
	if (raw.includes('พ่อขุนรามคำแหง')) aliases.add('รามคำแหง');

	return Array.from(aliases);
}

export function levenshteinDistance(a: string, b: string): number {
	const al = a.length;
	const bl = b.length;
	if (al === 0) return bl;
	if (bl === 0) return al;

	const matrix: number[][] = [];
	for (let i = 0; i <= bl; i++) {
		matrix[i] = [i];
	}
	for (let j = 0; j <= al; j++) {
		matrix[0][j] = j;
	}

	for (let i = 1; i <= bl; i++) {
		for (let j = 1; j <= al; j++) {
			if (b.charAt(i - 1) === a.charAt(j - 1)) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] = Math.min(
					matrix[i - 1][j - 1] + 1, // substitution
					matrix[i][j - 1] + 1, // insertion
					matrix[i - 1][j] + 1 // deletion
				);
			}
		}
	}
	return matrix[bl][al];
}

// Remove Thai tone marks and diacritics (วรรณยุกต์และเครื่องหมายทัณฑฆาต)
function removeThaiToneMarks(text: string): string {
	return text.replace(/[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/g, '');
}

export function validateQuizShowAnswer(
	userInput: string,
	targetAnswer: string,
	acceptableAnswers: string[] = []
): boolean {
	const userRaw = userInput.trim();
	if (!userRaw || !targetAnswer.trim()) return false;

	const userClean = cleanThaiText(userRaw);
	if (userClean.length < 2) return false;

	const acceptableAliases = extractAcceptableAliases(targetAnswer, acceptableAnswers);

	for (const alias of acceptableAliases) {
		const aliasRaw = alias.trim();
		const aliasClean = cleanThaiText(aliasRaw);
		if (!aliasClean) continue;

		// 1. Exact match (case-insensitive and clean match)
		if (userRaw.toLowerCase() === aliasRaw.toLowerCase() || userClean === aliasClean) {
			return true;
		}

		// 2. Exact match ignoring Thai tone marks/diacritics
		const userNoTone = removeThaiToneMarks(userClean);
		const aliasNoTone = removeThaiToneMarks(aliasClean);
		if (userNoTone.length >= 2 && userNoTone === aliasNoTone) {
			return true;
		}

		// 3. Substring core-word containment
		if (aliasClean.length >= 3 && userClean.length >= 3) {
			if (
				aliasClean.includes(userClean) &&
				userClean.length >= Math.floor(aliasClean.length * 0.6)
			) {
				return true;
			}
			if (
				userClean.includes(aliasClean) &&
				aliasClean.length >= Math.floor(userClean.length * 0.6)
			) {
				return true;
			}
		}

		// 4. Typo tolerance (off by 1-2 letters via Levenshtein distance)
		const maxLenDiff = aliasClean.length >= 8 ? 3 : 2;
		if (aliasClean.length >= 3 && Math.abs(userClean.length - aliasClean.length) <= maxLenDiff) {
			const dist = levenshteinDistance(userClean, aliasClean);
			// 1 letter typo for words length 3-6
			if (aliasClean.length <= 6 && dist <= 1) {
				return true;
			}
			// Up to 2-3 letters typo for longer words
			if (aliasClean.length >= 7 && dist <= (aliasClean.length >= 10 ? 3 : 2)) {
				return true;
			}
		}

		// Typo tolerance on tone-normalized words
		if (aliasNoTone.length >= 3 && Math.abs(userNoTone.length - aliasNoTone.length) <= 2) {
			const distNoTone = levenshteinDistance(userNoTone, aliasNoTone);
			if (aliasNoTone.length <= 6 && distNoTone <= 1) {
				return true;
			}
			if (aliasNoTone.length >= 7 && distNoTone <= 2) {
				return true;
			}
		}

		// Raw text typo tolerance (for English / romanized text)
		const userLower = userRaw.toLowerCase();
		const aliasLower = aliasRaw.toLowerCase();
		if (aliasLower.length >= 3 && Math.abs(userLower.length - aliasLower.length) <= 2) {
			const distRaw = levenshteinDistance(userLower, aliasLower);
			if (aliasLower.length <= 6 && distRaw <= 1) {
				return true;
			}
			if (aliasLower.length >= 7 && distRaw <= 2) {
				return true;
			}
		}
	}

	return false;
}
