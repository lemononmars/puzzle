import type { ThaiQuizCategory } from '#lib/data/puzzles/thaiquiz/types.js';

export interface CategoryMastery {
	attempts: number;
	correct: number;
	updatedAt: number;
}

export type MasteryMap = Partial<Record<ThaiQuizCategory, CategoryMastery>>;
const STORAGE_KEY = 'codebreaker_quiz_mastery_v1';

export function loadMastery(): MasteryMap {
	if (typeof localStorage === 'undefined') return {};
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as MasteryMap;
	} catch {
		return {};
	}
}

export function recordMastery(category: ThaiQuizCategory, isCorrect: boolean): MasteryMap {
	const mastery = loadMastery();
	const current = mastery[category] || { attempts: 0, correct: 0, updatedAt: 0 };
	mastery[category] = {
		attempts: current.attempts + 1,
		correct: current.correct + (isCorrect ? 1 : 0),
		updatedAt: Date.now()
	};
	if (typeof localStorage !== 'undefined')
		localStorage.setItem(STORAGE_KEY, JSON.stringify(mastery));
	return mastery;
}

export function masteryPercent(entry?: CategoryMastery): number {
	return entry?.attempts ? Math.round((entry.correct / entry.attempts) * 100) : 0;
}

export function masteryLabel(entry?: CategoryMastery): string {
	if (!entry || entry.attempts < 3) return 'กำลังเริ่มต้น';
	const percent = masteryPercent(entry);
	if (percent >= 85) return 'เชี่ยวชาญ';
	if (percent >= 65) return 'ชำนาญ';
	if (percent >= 45) return 'กำลังพัฒนา';
	return 'ควรทบทวน';
}
