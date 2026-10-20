export interface EnigMarchBlock {
	type: string;
	text: string;
	html: string;
	src?: string;
	children: EnigMarchBlock[];
}
export interface EnigMarchPuzzle {
	year: number;
	day: number;
	title: string;
	source: string;
	blocks: EnigMarchBlock[];
	hints: { title: string; blocks: EnigMarchBlock[] }[];
	solution: EnigMarchBlock[];
	answers: string[];
	checkerNote?: string;
	grid?: { size:number; kind:'sudoku'|'shade'|'loop' };
	solverUrl?: string;
}
