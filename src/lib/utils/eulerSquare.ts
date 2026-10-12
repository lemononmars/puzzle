export type BoardSize = 3 | 4 | 5;
export type ClueMode = 'separate' | 'cell';
export type Difficulty = 'normal' | 'hard';

export interface EulerCell {
	letter: number | null; // 0..N-1
	color: number | null; // 0..N-1
	isGivenLetter?: boolean;
	isGivenColor?: boolean;
}

export interface EulerSquarePuzzle {
	size: BoardSize;
	clueMode: ClueMode;
	difficulty: Difficulty;
	solution: { letter: number; color: number }[][];
	initialGrid: EulerCell[][];
	clueCount: number;
}

export interface ColorInfo {
	id: number;
	name: string;
	symbol: string;
	hex: string;
	bgClass: string;
	borderClass: string;
	textClass: string;
	solidBg: string;
}

export const EULER_LETTERS = ['A', 'B', 'C', 'D', 'E'];

export const EULER_COLORS: ColorInfo[] = [
	{
		id: 0,
		name: 'Red',
		symbol: '●', // Circle
		hex: '#ef4444',
		bgClass: 'bg-red-500/25',
		borderClass: 'border-red-500',
		textClass: 'text-red-400',
		solidBg: 'bg-red-500'
	},
	{
		id: 1,
		name: 'Blue',
		symbol: '■', // Square
		hex: '#3b82f6',
		bgClass: 'bg-blue-500/25',
		borderClass: 'border-blue-500',
		textClass: 'text-blue-400',
		solidBg: 'bg-blue-500'
	},
	{
		id: 2,
		name: 'Green',
		symbol: '▲', // Triangle
		hex: '#10b981',
		bgClass: 'bg-emerald-500/25',
		borderClass: 'border-emerald-500',
		textClass: 'text-emerald-400',
		solidBg: 'bg-emerald-500'
	},
	{
		id: 3,
		name: 'Yellow',
		symbol: '◆', // Diamond
		hex: '#eab308',
		bgClass: 'bg-amber-500/25',
		borderClass: 'border-amber-400',
		textClass: 'text-amber-300',
		solidBg: 'bg-amber-400'
	},
	{
		id: 4,
		name: 'Purple',
		symbol: '★', // Star
		hex: '#a855f7',
		bgClass: 'bg-purple-500/25',
		borderClass: 'border-purple-500',
		textClass: 'text-purple-400',
		solidBg: 'bg-purple-500'
	}
];

function shuffle<T>(arr: T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

const BASE_4_L1 = [
	[0, 1, 2, 3],
	[1, 0, 3, 2],
	[2, 3, 0, 1],
	[3, 2, 1, 0]
];
const BASE_4_L2 = [
	[0, 1, 2, 3],
	[2, 3, 0, 1],
	[3, 2, 1, 0],
	[1, 0, 3, 2]
];

export function generateFullSolution(size: BoardSize): { letter: number; color: number }[][] {
	let rawL1: number[][];
	let rawL2: number[][];

	if (size === 4) {
		rawL1 = BASE_4_L1.map((r) => [...r]);
		rawL2 = BASE_4_L2.map((r) => [...r]);
	} else {
		rawL1 = Array.from({ length: size }, (_, r) =>
			Array.from({ length: size }, (_, c) => (r + c) % size)
		);
		rawL2 = Array.from({ length: size }, (_, r) =>
			Array.from({ length: size }, (_, c) => (r + 2 * c) % size)
		);
	}

	const rowPerm = shuffle(Array.from({ length: size }, (_, i) => i));
	const colPerm = shuffle(Array.from({ length: size }, (_, i) => i));
	const letterPerm = shuffle(Array.from({ length: size }, (_, i) => i));
	const colorPerm = shuffle(Array.from({ length: size }, (_, i) => i));
	const swapL = Math.random() > 0.5;

	const board: { letter: number; color: number }[][] = [];
	for (let r = 0; r < size; r++) {
		const row: { letter: number; color: number }[] = [];
		for (let c = 0; c < size; c++) {
			const origR = rowPerm[r];
			const origC = colPerm[c];
			const val1 = letterPerm[rawL1[origR][origC]];
			const val2 = colorPerm[rawL2[origR][origC]];
			row.push({
				letter: swapL ? val2 : val1,
				color: swapL ? val1 : val2
			});
		}
		board.push(row);
	}
	return board;
}

export function countSolutions(grid: EulerCell[][], size: BoardSize, maxSolutions = 2): number {
	const rowLetterMask = new Uint8Array(size);
	const colLetterMask = new Uint8Array(size);
	const rowColorMask = new Uint8Array(size);
	const colColorMask = new Uint8Array(size);
	const pairMask = new Uint8Array(size);

	for (let r = 0; r < size; r++) {
		for (let c = 0; c < size; c++) {
			const cell = grid[r][c];
			if (cell.letter !== null) {
				const bit = 1 << cell.letter;
				if (rowLetterMask[r] & bit || colLetterMask[c] & bit) return 0;
				rowLetterMask[r] |= bit;
				colLetterMask[c] |= bit;
			}
			if (cell.color !== null) {
				const bit = 1 << cell.color;
				if (rowColorMask[r] & bit || colColorMask[c] & bit) return 0;
				rowColorMask[r] |= bit;
				colColorMask[c] |= bit;
			}
			if (cell.letter !== null && cell.color !== null) {
				const colBit = 1 << cell.color;
				if (pairMask[cell.letter] & colBit) return 0;
				pairMask[cell.letter] |= colBit;
			}
		}
	}

	const letters = Array.from({ length: size }, () => new Int8Array(size));
	const colors = Array.from({ length: size }, () => new Int8Array(size));

	for (let r = 0; r < size; r++) {
		for (let c = 0; c < size; c++) {
			letters[r][c] = grid[r][c].letter !== null ? grid[r][c].letter! : -1;
			colors[r][c] = grid[r][c].color !== null ? grid[r][c].color! : -1;
		}
	}

	let solutions = 0;
	let nodeCount = 0;
	const MAX_NODES = 2500; // Early exit guard so solver never blocks UI

	function solve(): void {
		if (solutions >= maxSolutions) return;
		nodeCount++;
		if (nodeCount > MAX_NODES) {
			// If searching too many branches, it's underconstrained (has multiple solutions)
			solutions = Math.max(solutions, 2);
			return;
		}

		let bestR = -1;
		let bestC = -1;
		let minCandidates = 999;
		let bestCandidates: [number, number][] = [];

		for (let r = 0; r < size; r++) {
			for (let c = 0; c < size; c++) {
				const lVal = letters[r][c];
				const colVal = colors[r][c];
				if (lVal !== -1 && colVal !== -1) continue;

				let candCount = 0;
				const cands: [number, number][] = [];

				for (let l = 0; l < size; l++) {
					if (lVal !== -1 && lVal !== l) continue;
					if (lVal === -1 && (rowLetterMask[r] & (1 << l) || colLetterMask[c] & (1 << l))) continue;

					for (let col = 0; col < size; col++) {
						if (colVal !== -1 && colVal !== col) continue;
						if (colVal === -1 && (rowColorMask[r] & (1 << col) || colColorMask[c] & (1 << col)))
							continue;
						if (pairMask[l] & (1 << col)) continue;

						candCount++;
						cands.push([l, col]);
					}
				}

				if (candCount < minCandidates) {
					minCandidates = candCount;
					bestR = r;
					bestC = c;
					bestCandidates = cands;
					if (minCandidates === 0) break;
				}
			}
			if (minCandidates === 0) break;
		}

		if (bestR === -1) {
			solutions++;
			return;
		}

		if (minCandidates === 0) return;

		const prevL = letters[bestR][bestC];
		const prevCol = colors[bestR][bestC];

		for (const [l, col] of bestCandidates) {
			if (prevL === -1) {
				rowLetterMask[bestR] |= 1 << l;
				colLetterMask[bestC] |= 1 << l;
				letters[bestR][bestC] = l;
			}
			if (prevCol === -1) {
				rowColorMask[bestR] |= 1 << col;
				colColorMask[bestC] |= 1 << col;
				colors[bestR][bestC] = col;
			}
			pairMask[l] |= 1 << col;

			solve();

			if (prevL === -1) {
				rowLetterMask[bestR] &= ~(1 << l);
				colLetterMask[bestC] &= ~(1 << l);
				letters[bestR][bestC] = -1;
			}
			if (prevCol === -1) {
				rowColorMask[bestR] &= ~(1 << col);
				colColorMask[bestC] &= ~(1 << col);
				colors[bestR][bestC] = -1;
			}
			pairMask[l] &= ~(1 << col);

			if (solutions >= maxSolutions) break;
		}
	}

	solve();
	return solutions;
}

export function generatePuzzle(
	size: BoardSize,
	clueMode: ClueMode = 'separate',
	difficulty: Difficulty = 'normal'
): EulerSquarePuzzle {
	const solution = generateFullSolution(size);
	const initialGrid: EulerCell[][] = solution.map((row) =>
		row.map((c) => ({
			letter: c.letter,
			color: c.color,
			isGivenLetter: true,
			isGivenColor: true
		}))
	);

	if (clueMode === 'cell') {
		// Randomize cell to fill both letter and color together
		const cells: { r: number; c: number }[] = [];
		for (let r = 0; r < size; r++) {
			for (let c = 0; c < size; c++) {
				cells.push({ r, c });
			}
		}
		const shuffled = shuffle(cells);

		// First, reduce to minimal unique clues (hard difficulty)
		for (const cell of shuffled) {
			const { r, c } = cell;
			const oldL = initialGrid[r][c].letter;
			const oldCol = initialGrid[r][c].color;

			initialGrid[r][c].letter = null;
			initialGrid[r][c].color = null;
			initialGrid[r][c].isGivenLetter = false;
			initialGrid[r][c].isGivenColor = false;

			const numSols = countSolutions(initialGrid, size, 2);
			if (numSols !== 1) {
				// Revert: required for unique solution
				initialGrid[r][c].letter = oldL;
				initialGrid[r][c].color = oldCol;
				initialGrid[r][c].isGivenLetter = true;
				initialGrid[r][c].isGivenColor = true;
			}
		}

		// Count clues in hard mode
		const hardClueCells: { r: number; c: number }[] = [];
		const emptyCells: { r: number; c: number }[] = [];
		for (let r = 0; r < size; r++) {
			for (let c = 0; c < size; c++) {
				if (initialGrid[r][c].letter !== null) {
					hardClueCells.push({ r, c });
				} else {
					emptyCells.push({ r, c });
				}
			}
		}

		// For normal: use twice as many clues as hard!
		if (difficulty === 'normal') {
			const targetClues = Math.min(size * size, hardClueCells.length * 2);
			const neededExtra = targetClues - hardClueCells.length;
			const shuffledEmpty = shuffle(emptyCells);
			for (let i = 0; i < neededExtra && i < shuffledEmpty.length; i++) {
				const { r, c } = shuffledEmpty[i];
				initialGrid[r][c].letter = solution[r][c].letter;
				initialGrid[r][c].color = solution[r][c].color;
				initialGrid[r][c].isGivenLetter = true;
				initialGrid[r][c].isGivenColor = true;
			}
		}
	} else {
		// Randomize letter and color separately
		type Removable = { r: number; c: number; type: 'letter' | 'color' };
		const removables: Removable[] = [];

		for (let r = 0; r < size; r++) {
			for (let c = 0; c < size; c++) {
				removables.push({ r, c, type: 'letter' });
				removables.push({ r, c, type: 'color' });
			}
		}

		const shuffled = shuffle(removables);

		// First, reduce to minimal unique clues (hard difficulty)
		for (const item of shuffled) {
			const { r, c, type } = item;
			const oldVal = initialGrid[r][c][type];

			initialGrid[r][c][type] = null;
			if (type === 'letter') initialGrid[r][c].isGivenLetter = false;
			else initialGrid[r][c].isGivenColor = false;

			const numSols = countSolutions(initialGrid, size, 2);
			if (numSols !== 1) {
				initialGrid[r][c][type] = oldVal;
				if (type === 'letter') initialGrid[r][c].isGivenLetter = true;
				else initialGrid[r][c].isGivenColor = true;
			}
		}

		// Count clues in hard mode
		const hardClues: Removable[] = [];
		const removedClues: Removable[] = [];
		for (let r = 0; r < size; r++) {
			for (let c = 0; c < size; c++) {
				if (initialGrid[r][c].letter !== null) hardClues.push({ r, c, type: 'letter' });
				else removedClues.push({ r, c, type: 'letter' });

				if (initialGrid[r][c].color !== null) hardClues.push({ r, c, type: 'color' });
				else removedClues.push({ r, c, type: 'color' });
			}
		}

		// For normal: use twice as many clues as hard!
		if (difficulty === 'normal') {
			const totalClues = size * size * 2;
			const targetClues = Math.min(totalClues, hardClues.length * 2);
			const neededExtra = targetClues - hardClues.length;
			const shuffledRemoved = shuffle(removedClues);
			for (let i = 0; i < neededExtra && i < shuffledRemoved.length; i++) {
				const { r, c, type } = shuffledRemoved[i];
				initialGrid[r][c][type] = solution[r][c][type];
				if (type === 'letter') initialGrid[r][c].isGivenLetter = true;
				else initialGrid[r][c].isGivenColor = true;
			}
		}
	}

	let clueCount = 0;
	for (let r = 0; r < size; r++) {
		for (let c = 0; c < size; c++) {
			if (initialGrid[r][c].letter !== null) clueCount++;
			if (initialGrid[r][c].color !== null) clueCount++;
		}
	}

	return {
		size,
		clueMode,
		difficulty,
		solution,
		initialGrid,
		clueCount
	};
}

export interface CellConflicts {
	rowLetter: boolean;
	colLetter: boolean;
	rowColor: boolean;
	colColor: boolean;
	duplicatePair: boolean;
}

export function detectConflicts(
	grid: EulerCell[][],
	size: BoardSize
): { conflicts: { [key: string]: CellConflicts }; conflictList: string[] } {
	const conflicts: { [key: string]: CellConflicts } = {};
	const conflictList: string[] = [];

	for (let r = 0; r < size; r++) {
		for (let c = 0; c < size; c++) {
			conflicts[`${r},${c}`] = {
				rowLetter: false,
				colLetter: false,
				rowColor: false,
				colColor: false,
				duplicatePair: false
			};
		}
	}

	for (let r = 0; r < size; r++) {
		for (let c1 = 0; c1 < size; c1++) {
			const cell1 = grid[r][c1];
			for (let c2 = c1 + 1; c2 < size; c2++) {
				const cell2 = grid[r][c2];
				if (cell1.letter !== null && cell1.letter === cell2.letter) {
					conflicts[`${r},${c1}`].rowLetter = true;
					conflicts[`${r},${c2}`].rowLetter = true;
					conflictList.push(
						`Row ${r + 1}: Duplicate letter '${EULER_LETTERS[cell1.letter]}' in columns ${c1 + 1} & ${c2 + 1}`
					);
				}
				if (cell1.color !== null && cell1.color === cell2.color) {
					conflicts[`${r},${c1}`].rowColor = true;
					conflicts[`${r},${c2}`].rowColor = true;
					conflictList.push(
						`Row ${r + 1}: Duplicate color ${EULER_COLORS[cell1.color].name} (${EULER_COLORS[cell1.color].symbol}) in columns ${c1 + 1} & ${c2 + 1}`
					);
				}
			}
		}
	}

	for (let c = 0; c < size; c++) {
		for (let r1 = 0; r1 < size; r1++) {
			const cell1 = grid[r1][c];
			for (let r2 = r1 + 1; r2 < size; r2++) {
				const cell2 = grid[r2][c];
				if (cell1.letter !== null && cell1.letter === cell2.letter) {
					conflicts[`${r1},${c}`].colLetter = true;
					conflicts[`${r2},${c}`].colLetter = true;
					conflictList.push(
						`Column ${c + 1}: Duplicate letter '${EULER_LETTERS[cell1.letter]}' in rows ${r1 + 1} & ${r2 + 1}`
					);
				}
				if (cell1.color !== null && cell1.color === cell2.color) {
					conflicts[`${r1},${c}`].colColor = true;
					conflicts[`${r2},${c}`].colColor = true;
					conflictList.push(
						`Column ${c + 1}: Duplicate color ${EULER_COLORS[cell1.color].name} (${EULER_COLORS[cell1.color].symbol}) in rows ${r1 + 1} & ${r2 + 1}`
					);
				}
			}
		}
	}

	for (let r1 = 0; r1 < size; r1++) {
		for (let c1 = 0; c1 < size; c1++) {
			const cell1 = grid[r1][c1];
			if (cell1.letter === null || cell1.color === null) continue;

			for (let r2 = 0; r2 < size; r2++) {
				for (let c2 = 0; c2 < size; c2++) {
					if (r1 === r2 && c1 >= c2) continue;
					if (r1 > r2) continue;
					const cell2 = grid[r2][c2];
					if (cell1.letter === cell2.letter && cell1.color === cell2.color) {
						conflicts[`${r1},${c1}`].duplicatePair = true;
						conflicts[`${r2},${c2}`].duplicatePair = true;
						conflictList.push(
							`Duplicate pair '${EULER_LETTERS[cell1.letter]}${EULER_COLORS[cell1.color].symbol}' at (${r1 + 1},${c1 + 1}) and (${r2 + 1},${c2 + 1})`
						);
					}
				}
			}
		}
	}

	return { conflicts, conflictList };
}

export function isBoardSolved(grid: EulerCell[][], size: BoardSize): boolean {
	const { conflicts } = detectConflicts(grid, size);
	for (let r = 0; r < size; r++) {
		for (let c = 0; c < size; c++) {
			const cell = grid[r][c];
			if (cell.letter === null || cell.color === null) return false;
			const conf = conflicts[`${r},${c}`];
			if (
				conf.rowLetter ||
				conf.colLetter ||
				conf.rowColor ||
				conf.colColor ||
				conf.duplicatePair
			) {
				return false;
			}
		}
	}
	return true;
}

export interface HintResult {
	r: number;
	c: number;
	message: string;
	isCorrection: boolean;
}

export function getHint(
	playerGrid: EulerCell[][],
	solution: { letter: number; color: number }[][],
	size: BoardSize
): HintResult | null {
	// 1. Check if user made a wrong entry
	for (let r = 0; r < size; r++) {
		for (let c = 0; c < size; c++) {
			const cell = playerGrid[r][c];
			const sol = solution[r][c];
			if (
				(!cell.isGivenLetter && cell.letter !== null && cell.letter !== sol.letter) ||
				(!cell.isGivenColor && cell.color !== null && cell.color !== sol.color)
			) {
				return {
					r,
					c,
					message: `Row ${r + 1}, Col ${c + 1} has an incorrect entry. Review this cell!`,
					isCorrection: true
				};
			}
		}
	}

	// 2. Find an empty or partially filled cell with the most constrained options
	let bestR = -1;
	let bestC = -1;
	let bestScore = -1;
	let hintDetail = '';

	for (let r = 0; r < size; r++) {
		for (let c = 0; c < size; c++) {
			const cell = playerGrid[r][c];
			if (cell.letter !== null && cell.color !== null) continue;

			const rowLetters = new Set(playerGrid[r].map((x) => x.letter).filter((x) => x !== null));
			const colLetters = new Set(
				Array.from({ length: size }, (_, i) => playerGrid[i][c].letter).filter((x) => x !== null)
			);
			const rowColors = new Set(playerGrid[r].map((x) => x.color).filter((x) => x !== null));
			const colColors = new Set(
				Array.from({ length: size }, (_, i) => playerGrid[i][c].color).filter((x) => x !== null)
			);

			const letterCandidates = size - new Set([...rowLetters, ...colLetters]).size;
			const colorCandidates = size - new Set([...rowColors, ...colColors]).size;

			const score = 10 - letterCandidates + (10 - colorCandidates);
			if (score > bestScore) {
				bestScore = score;
				bestR = r;
				bestC = c;
				const sol = solution[r][c];
				if (cell.letter === null && cell.color === null) {
					hintDetail = `Row ${r + 1}, Col ${c + 1}: Try looking at letter '${EULER_LETTERS[sol.letter]}' or color '${EULER_COLORS[sol.color].name}' (${EULER_COLORS[sol.color].symbol})!`;
				} else if (cell.letter === null) {
					hintDetail = `Row ${r + 1}, Col ${c + 1}: Find the missing letter (it needs '${EULER_LETTERS[sol.letter]}')!`;
				} else {
					hintDetail = `Row ${r + 1}, Col ${c + 1}: Find the missing color (it needs ${EULER_COLORS[sol.color].name} ${EULER_COLORS[sol.color].symbol})!`;
				}
			}
		}
	}

	if (bestR !== -1) {
		return {
			r: bestR,
			c: bestC,
			message: hintDetail,
			isCorrection: false
		};
	}

	return null;
}
