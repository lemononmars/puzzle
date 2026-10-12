import { describe, it, expect } from 'vitest';
import { solvePentomino, countSolutions } from './pentomino_engine.js';

describe('Pentomino Engine', () => {
	describe('solvePentomino', () => {
		it('finds a solution for a standard 8x8 grid with 4 central holes', () => {
			const blockedCells = [
				[3, 3],
				[3, 4],
				[4, 3],
				[4, 4]
			];
			const solution = solvePentomino(blockedCells);
			expect(solution).not.toBeNull();

			if (solution) {
				// Verify blocked cells are present
				expect(solution[3][3]).toBe('X_BLOCK');
				expect(solution[3][4]).toBe('X_BLOCK');
				expect(solution[4][3]).toBe('X_BLOCK');
				expect(solution[4][4]).toBe('X_BLOCK');

				// Verify all other cells are filled with pieces
				let emptyCells = 0;
				let piecesUsed = new Set();
				for (let r = 0; r < 8; r++) {
					for (let c = 0; c < 8; c++) {
						if (solution[r][c] === null) emptyCells++;
						if (solution[r][c] !== null && solution[r][c] !== 'X_BLOCK') {
							piecesUsed.add(solution[r][c]);
						}
					}
				}
				expect(emptyCells).toBe(0);
				expect(piecesUsed.size).toBe(12); // All 12 pentominoes used
			}
		});

		it('returns null for an impossible board with 5 blocked cells', () => {
			const blockedCells = [
				[3, 3],
				[3, 4],
				[4, 3],
				[4, 4],
				[5, 5]
			];
			const solution = solvePentomino(blockedCells);
			expect(solution).toBeNull();
		});

		it('returns null quickly when 4 blocks create a disconnected region of size not divisible by 5', () => {
			// Block a corner to create an isolated area of size 1 (top left corner)
			const blockedCells = [
				[0, 1],
				[1, 0],
				[4, 3],
				[4, 4]
			];
			const solution = solvePentomino(blockedCells);
			expect(solution).toBeNull();
		});

		it('solves board adhering to forced cells', () => {
			const blockedCells = [
				[3, 3],
				[3, 4],
				[4, 3],
				[4, 4]
			];
			// Force a few pieces in known locations
			const forcedCells = [
				{ r: 0, c: 0, id: 'F' },
				{ r: 0, c: 1, id: 'I' },
				{ r: 0, c: 2, id: 'I' },
				{ r: 0, c: 3, id: 'I' },
				{ r: 0, c: 4, id: 'I' },
				{ r: 0, c: 5, id: 'I' },
				{ r: 0, c: 6, id: 'P' },
				{ r: 0, c: 7, id: 'P' }
			];

			const solution = solvePentomino(blockedCells, forcedCells);
			expect(solution).not.toBeNull();

			if (solution) {
				// Check if forced cells are respected
				expect(solution[0][0]).toBe('F');
				expect(solution[0][1]).toBe('I');
				expect(solution[0][2]).toBe('I');
				expect(solution[0][3]).toBe('I');
				expect(solution[0][4]).toBe('I');
				expect(solution[0][5]).toBe('I');
				expect(solution[0][6]).toBe('P');
				expect(solution[0][7]).toBe('P');
			}
		});
	});

	describe('countSolutions', () => {
		it('returns 0 for impossible configurations', () => {
			const blockedCells = [
				[3, 3],
				[3, 4],
				[4, 3],
				[4, 4],
				[5, 5]
			];
			const count = countSolutions(blockedCells);
			expect(count).toBe(0);
		});

		it('counts solutions correctly with many forced pieces (deterministic)', () => {
			const blockedCells = [
				[3, 3],
				[3, 4],
				[4, 3],
				[4, 4]
			];

			// Provide enough forced pieces to make the counting fast and unique
			const forcedCells = [
				{ r: 0, c: 0, id: 'F' },
				{ r: 0, c: 1, id: 'I' },
				{ r: 0, c: 2, id: 'I' },
				{ r: 0, c: 3, id: 'I' },
				{ r: 0, c: 4, id: 'I' },
				{ r: 0, c: 5, id: 'I' },
				{ r: 0, c: 6, id: 'P' },
				{ r: 0, c: 7, id: 'P' },
				{ r: 1, c: 0, id: 'F' },
				{ r: 1, c: 1, id: 'F' },
				{ r: 1, c: 2, id: 'F' },
				{ r: 1, c: 3, id: 'W' },
				{ r: 1, c: 4, id: 'W' },
				{ r: 1, c: 5, id: 'P' },
				{ r: 1, c: 6, id: 'P' },
				{ r: 1, c: 7, id: 'P' },
				{ r: 2, c: 0, id: 'Y' },
				{ r: 2, c: 1, id: 'F' },
				{ r: 2, c: 2, id: 'W' },
				{ r: 2, c: 3, id: 'W' },
				{ r: 2, c: 4, id: 'T' },
				{ r: 2, c: 5, id: 'T' },
				{ r: 2, c: 6, id: 'T' },
				{ r: 2, c: 7, id: 'N' },
				{ r: 3, c: 0, id: 'Y' },
				{ r: 3, c: 1, id: 'Y' },
				{ r: 3, c: 2, id: 'W' },
				{ r: 3, c: 5, id: 'T' },
				{ r: 3, c: 6, id: 'N' },
				{ r: 3, c: 7, id: 'N' }
			];

			const count = countSolutions(blockedCells, forcedCells);
			expect(count).toBeGreaterThan(0);
		});
	});
});
