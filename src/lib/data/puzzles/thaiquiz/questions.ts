import type { ThaiQuizItem } from './types';
export { THAI_QUIZ_CATEGORIES } from './catalog';
import { GEOGRAPHY_QUESTIONS } from './data/geography';
import { LANGUAGE_LIT_QUESTIONS } from './data/language_lit';
import { CULTURE_TRADITION_QUESTIONS } from './data/culture_tradition';
import { FOOD_CUISINE_QUESTIONS } from './data/food_cuisine';
import { HISTORY_HERITAGE_QUESTIONS } from './data/history_heritage';
import { GENERAL_TRIVIA_QUESTIONS } from './data/general_trivia';
import { SCIENCE_QUESTIONS } from './data/science';
import { JAPANESE_POP_QUESTIONS } from './data/japanese_pop';
import { YEAR_2026_QUESTIONS } from './data/year_2026';

const RAW_THAI_QUIZ_DATABASE: ThaiQuizItem[] = [
	...GEOGRAPHY_QUESTIONS,
	...LANGUAGE_LIT_QUESTIONS,
	...CULTURE_TRADITION_QUESTIONS,
	...FOOD_CUISINE_QUESTIONS,
	...HISTORY_HERITAGE_QUESTIONS,
	...GENERAL_TRIVIA_QUESTIONS,
	...SCIENCE_QUESTIONS,
	...JAPANESE_POP_QUESTIONS,
	...YEAR_2026_QUESTIONS
];

function normalizeQuestion(question: string): string {
	return question.trim().toLocaleLowerCase('th-TH').replace(/\s+/g, ' ');
}

const seenBaseQuestions = new Set<string>();
const BASE_THAI_QUIZ_DATABASE = RAW_THAI_QUIZ_DATABASE.filter((question) => {
	const normalized = normalizeQuestion(question.question);
	if (seenBaseQuestions.has(normalized)) return false;
	seenBaseQuestions.add(normalized);
	return true;
});

export const THAI_QUIZ_DATABASE: ThaiQuizItem[] = [...BASE_THAI_QUIZ_DATABASE];

export {
	GEOGRAPHY_QUESTIONS,
	LANGUAGE_LIT_QUESTIONS,
	CULTURE_TRADITION_QUESTIONS,
	FOOD_CUISINE_QUESTIONS,
	HISTORY_HERITAGE_QUESTIONS,
	GENERAL_TRIVIA_QUESTIONS,
	SCIENCE_QUESTIONS,
	JAPANESE_POP_QUESTIONS,
	YEAR_2026_QUESTIONS
};
