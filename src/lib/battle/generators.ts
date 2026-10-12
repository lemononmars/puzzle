import type { BattlePuzzleType, BattleRoundData, ThaiLetterBlock } from './types';
import crossroadData from '#lib/utils/crossroad_word.json';
import spellingBeeWords from '#lib/data/puzzles/spellingbee/7letters.json';
import { wordDatabase } from '#lib/data/puzzles/spelling/words.js';
import { buildWordList, generatePuzzle } from '#lib/wordladder/wordladder.js';
import dict from '#lib/dict.json';
import dictPythaiRaw from '#lib/utils/dict_pythainlp.json?raw';
import { getSubWords } from '#lib/utils/thaiwords.js';

const pythaiMap: Record<string, number> = JSON.parse(dictPythaiRaw);

const allThaiConsonants = [
	'ก',
	'ข',
	'ค',
	'ง',
	'จ',
	'ฉ',
	'ช',
	'ซ',
	'ญ',
	'ด',
	'ต',
	'ถ',
	'ท',
	'น',
	'บ',
	'ป',
	'ผ',
	'ฝ',
	'พ',
	'ฟ',
	'ม',
	'ย',
	'ร',
	'ล',
	'ว',
	'ส',
	'ห',
	'อ'
];

function shuffleArray<T>(arr: T[]): T[] {
	const copy = [...arr];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

// Thai combining character helpers
function isUpperChar(c: string): boolean {
	return ['ั', 'ิ', 'ี', 'ึ', 'ื', '็', '่', '้', '๊', '๋', '์', 'ํ'].includes(c);
}

function isLowerChar(c: string): boolean {
	return ['ุ', 'ู', 'ฺ'].includes(c);
}

export type ThaiBlock = ThaiLetterBlock;

export function parseThaiBlocks(w: string): ThaiBlock[] {
	const result: ThaiBlock[] = [];
	for (const char of w) {
		if (isUpperChar(char)) {
			if (result.length > 0) {
				result[result.length - 1].upper += char;
			} else {
				result.push({ base: '', upper: char, lower: '' });
			}
		} else if (isLowerChar(char)) {
			if (result.length > 0) {
				result[result.length - 1].lower += char;
			} else {
				result.push({ base: '', upper: '', lower: char });
			}
		} else {
			result.push({ base: char, upper: '', lower: '' });
		}
	}
	return result;
}

export function splitThaiCells(word: string): string[] {
	const cells: string[] = [];
	for (const char of word) {
		if ((isUpperChar(char) || isLowerChar(char)) && cells.length > 0) {
			cells[cells.length - 1] += char;
		} else {
			cells.push(char);
		}
	}
	return cells;
}

// 1. Crossroad Generator (with full clue lists for rerolling)
export function generateCrossroadRound(roundIndex: number): BattleRoundData {
	const entries = Object.entries(
		crossroadData as Record<string, { pre: string[]; post: string[] }>
	);
	const validEntries = entries.filter(
		([_, v]) => (v.pre?.length || 0) >= 2 && (v.post?.length || 0) >= 2
	);

	const randomIdx = Math.floor(Math.random() * validEntries.length);
	const [targetWord, clues] = validEntries[randomIdx] || entries[0];

	const preList = clues.pre || [];
	const postList = clues.post || [];

	return {
		roundIndex,
		puzzleType: 'crossroad',
		theme: 'general',
		title: 'Crossroad (ศัพท์สี่ทิศ)',
		payload: {
			targetWord,
			topClue: postList[0] || 'ต้น',
			bottomClue: preList[1] || preList[0] || 'ไม้',
			leftClue: postList[1] || postList[0] || 'ใบ',
			rightClue: preList[0] || 'ดวง',
			allPre: preList,
			allPost: postList
		}
	};
}

// 2. Spelling Bee Generator (Uses official project dataset $lib/data/puzzles/spellingbee/7letters.json)
export function generateSpellingBeeRound(roundIndex: number): BattleRoundData {
	const puzzle = spellingBeeWords[Math.floor(Math.random() * spellingBeeWords.length)] || {
		id: 0,
		word: 'กงเกวียน'
	};
	const word = puzzle.word;
	const solutions = getSubWords(word, false).filter((s) => s.length >= 3);
	const letters = shuffleArray(word.split(''));

	return {
		roundIndex,
		puzzleType: 'spellingbee',
		theme: 'general',
		title: `Spelling Bee (รวงผึ้ง #${puzzle.id})`,
		payload: {
			id: puzzle.id,
			word,
			letters,
			solutions,
			totalWords: solutions.length
		}
	};
}

// 3. Blanks Generator (Exact match with /puzzles/blanks with Thai blocks & marks)
export function generateBlanksRound(roundIndex: number): BattleRoundData {
	const eligibleWords = dict.filter((w) => {
		const bList = parseThaiBlocks(w);
		if (bList.length < 3 || bList.length > 7) return false;
		if ((pythaiMap[w] ?? 0) < 1) return false;
		const baseChars = bList.map((b) => b.base).filter((b) => allThaiConsonants.includes(b));
		const uniqueBases = Array.from(new Set(baseChars));
		return uniqueBases.some((c) => baseChars.filter((x) => x === c).length >= 2);
	});

	const shuffled = shuffleArray(eligibleWords).slice(0, 10);
	const questions: Array<{
		word: string;
		blocks: ThaiBlock[];
		targetChar: string;
	}> = [];

	for (const w of shuffled) {
		const bList = parseThaiBlocks(w);
		const baseChars = bList.map((b) => b.base).filter((b) => allThaiConsonants.includes(b));
		const uniqueBases = Array.from(new Set(baseChars));
		const multiples = uniqueBases.filter((c) => baseChars.filter((x) => x === c).length >= 2);

		if (multiples.length > 0) {
			const targetChar = multiples[Math.floor(Math.random() * multiples.length)];
			questions.push({
				word: w,
				blocks: bList,
				targetChar
			});
		}
	}

	return {
		roundIndex,
		puzzleType: 'blanks',
		theme: 'general',
		title: 'Blanks (ซ่อนอักษร)',
		payload: {
			questions,
			totalQuestions: questions.length
		}
	};
}

// 4. Spelling Quiz Generator (Uses official spelling dictionary wordDatabase from $lib/data/puzzles/spelling/words)
export function generateSpellingQuizRound(roundIndex: number): BattleRoundData {
	const shuffledDB = shuffleArray(
		wordDatabase.filter((w) => w.incorrect && w.incorrect.length > 0)
	).slice(0, 10);

	const questions: Array<{
		correct: string;
		incorrect: string;
		leftOption: string;
		rightOption: string;
		leftIsCorrect: boolean;
		explanation: string;
	}> = [];

	for (const item of shuffledDB) {
		const incorrect = item.incorrect[Math.floor(Math.random() * item.incorrect.length)];
		const leftIsCorrect = Math.random() > 0.5;

		questions.push({
			correct: item.correct,
			incorrect,
			leftOption: leftIsCorrect ? item.correct : incorrect,
			rightOption: leftIsCorrect ? incorrect : item.correct,
			leftIsCorrect,
			explanation: item.explanation || `คำที่ถูกต้องคือ "${item.correct}"`
		});
	}

	return {
		roundIndex,
		puzzleType: 'spellingquiz',
		theme: 'general',
		title: 'Spelling Quiz (ควิซสะกดคำ)',
		payload: {
			questions,
			totalQuestions: questions.length
		}
	};
}

// 5. Boggle Generator (4x4 grid with Thai words)
export function generateBoggleRound(roundIndex: number): BattleRoundData {
	const commonWords = dict.filter((word) => {
		const length = splitThaiCells(word).length;
		return length >= 3 && length <= 6 && (pythaiMap[word] ?? 0) >= 3;
	});

	const grid: string[][] = [
		['', '', '', ''],
		['', '', '', ''],
		['', '', '', ''],
		['', '', '', '']
	];
	const selectedWords: string[] = [];
	const positions = Array.from({ length: 16 }, (_, index) => ({
		r: Math.floor(index / 4),
		c: index % 4
	}));

	const tryPlaceWord = (word: string): boolean => {
		const cells = splitThaiCells(word);
		const placeFrom = (index: number, r: number, c: number, used: Set<string>): boolean => {
			const existing = grid[r][c];
			if (existing && existing !== cells[index]) return false;

			const key = `${r},${c}`;
			if (used.has(key)) return false;
			const wasEmpty = !existing;
			grid[r][c] = cells[index];
			if (index === cells.length - 1) return true;

			const nextUsed = new Set(used).add(key);
			const neighbours = shuffleArray(
				positions.filter(
					(pos) =>
						Math.abs(pos.r - r) <= 1 && Math.abs(pos.c - c) <= 1 && (pos.r !== r || pos.c !== c)
				)
			);
			for (const neighbour of neighbours) {
				if (placeFrom(index + 1, neighbour.r, neighbour.c, nextUsed)) return true;
			}

			if (wasEmpty) grid[r][c] = '';
			return false;
		};

		for (const start of shuffleArray(positions)) {
			if (placeFrom(0, start.r, start.c, new Set())) return true;
		}
		return false;
	};

	for (const word of shuffleArray(commonWords).slice(0, 80)) {
		if (tryPlaceWord(word)) selectedWords.push(word);
		if (selectedWords.length >= 4) break;
	}

	const extraLetters = shuffleArray(allThaiConsonants);
	let extraIndex = 0;
	for (let r = 0; r < 4; r++) {
		for (let c = 0; c < 4; c++) {
			if (!grid[r][c]) grid[r][c] = extraLetters[extraIndex++ % extraLetters.length];
		}
	}

	return {
		roundIndex,
		puzzleType: 'boggle',
		theme: 'general',
		title: 'Boggle (ค้นหาคำในตาราง)',
		payload: {
			grid,
			seedWords: selectedWords
		}
	};
}

// 6. Word Ladder Generator (Using full BFS wordladder engine)
export function generateWordLadderRound(roundIndex: number): BattleRoundData {
	const wordList3 = buildWordList(dict, 3);
	const puzzle = generatePuzzle(wordList3, 3, 5);

	if (puzzle) {
		return {
			roundIndex,
			puzzleType: 'wordladder',
			theme: 'general',
			title: 'Word Ladder (บันไดแปลงคำ)',
			payload: {
				start: puzzle.start,
				end: puzzle.end,
				minPath: puzzle.minPath,
				slotSize: 3
			}
		};
	}

	return {
		roundIndex,
		puzzleType: 'wordladder',
		theme: 'general',
		title: 'Word Ladder (บันไดแปลงคำ)',
		payload: {
			start: 'กานดา',
			end: 'ตาแดง',
			minPath: ['กานดา', 'กานดา', 'ตาแดง'],
			slotSize: 3
		}
	};
}

import { getQuizQuestions } from '#lib/data/puzzles/thaiquiz/engine.js';

// 7. Thai Common Knowledge Quiz Generator
export function generateThaiQuizRound(roundIndex: number): BattleRoundData {
	const questions = getQuizQuestions({ count: 10 });
	return {
		roundIndex,
		puzzleType: 'thaiquiz',
		theme: 'general',
		title: 'Quiz (ความรู้รอบตัวไทย)',
		payload: {
			questions,
			totalQuestions: questions.length
		}
	};
}

// Master Round Generator
export function generateBattleRounds(
	puzzleType: BattlePuzzleType,
	totalRounds: number
): BattleRoundData[] {
	const rounds: BattleRoundData[] = [];

	for (let i = 0; i < totalRounds; i++) {
		switch (puzzleType) {
			case 'spellingbee':
				rounds.push(generateSpellingBeeRound(i));
				break;
			case 'blanks':
				rounds.push(generateBlanksRound(i));
				break;
			case 'crossroad':
				rounds.push(generateCrossroadRound(i));
				break;
			case 'spellingquiz':
				rounds.push(generateSpellingQuizRound(i));
				break;
			case 'boggle':
				rounds.push(generateBoggleRound(i));
				break;
			case 'wordladder':
				rounds.push(generateWordLadderRound(i));
				break;
			case 'thaiquiz':
				rounds.push(generateThaiQuizRound(i));
				break;
			default:
				rounds.push(generateSpellingBeeRound(i));
				break;
		}
	}

	return rounds;
}
