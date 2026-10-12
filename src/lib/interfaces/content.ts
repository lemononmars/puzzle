export interface IContent {
	type: 'blog' | PuzzleType;
	id: number;
	title: string;
	date: string;
	tags?: string[];
	author?: string;
}

export interface IRebus extends IContent {
	type: 'rebus';
	image: string;
	question: string;
	hints?: string[];
	answer: string;
}

export interface IPuzzleCrossword extends IContent {
	type: 'crossword';
	clues: CrosswordClue[];
	row: number;
	col: number;
	uid: string;
}

export interface CrosswordClue {
	clue: string;
	answer: string;
	direction: 'down' | 'across';
	position: [number, number];
}

export interface IAlphabet extends IContent {
	type: 'alphabet';
	hints: string[];
	answers: string[];
}

export interface ISpellingBee {
	type: 'spellingbee';
	id: number;
	word: string;
}

export interface IPuzzleHuntSingle {
	index: number;
	title: string;
	file: string;
	hints: string[];
	solution?: string;
}

export interface IPuzzleHunt extends IContent {
	type: 'puzzlehunt';
	id: number;
	image?: string;
	title: string;
	puzzles: IPuzzleHuntSingle[];
}

export interface IMissingVowels extends IContent {
	type: 'missingvowels';
	title: string;
	answers: string[];
}

export interface ICryptogram extends IContent {
	type: 'cryptogram';
	title: string;
	answer: string;
	newlines: number[];
	showUsedLetters: boolean;
}

export type PuzzleType =
	'alphabet' | 'rebus' | 'crossword' | 'puzzlehunt' | 'missingvowels' | 'cryptogram';
