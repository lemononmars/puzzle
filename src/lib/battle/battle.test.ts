import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateBoggleRound, splitThaiCells } from './generators';
import {
	canBuildWordFromLetters,
	getBogglePathWord,
	isBattleRoundOpen,
	isValidBogglePath
} from './rules';
import { claimBattleAction } from './actionReceipts';
import { validateBattleConfig } from './validation';
import type { BattleRoomMeta } from './types';

function gridContainsWord(grid: string[][], word: string): boolean {
	const cells = splitThaiCells(word);
	const visit = (index: number, row: number, col: number, used: Set<string>): boolean => {
		if (grid[row]?.[col] !== cells[index]) return false;
		if (index === cells.length - 1) return true;

		const nextUsed = new Set(used).add(`${row},${col}`);
		for (let rowDelta = -1; rowDelta <= 1; rowDelta++) {
			for (let colDelta = -1; colDelta <= 1; colDelta++) {
				if (rowDelta === 0 && colDelta === 0) continue;
				const nextRow = row + rowDelta;
				const nextCol = col + colDelta;
				if (
					nextRow >= 0 &&
					nextRow < grid.length &&
					nextCol >= 0 &&
					nextCol < grid[nextRow].length &&
					!nextUsed.has(`${nextRow},${nextCol}`) &&
					visit(index + 1, nextRow, nextCol, nextUsed)
				) {
					return true;
				}
			}
		}
		return false;
	};

	return grid.some((row, rowIndex) =>
		row.some((_cell, colIndex) => visit(0, rowIndex, colIndex, new Set()))
	);
}

describe('battle puzzle generation', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('places every advertised Boggle seed word on a legal adjacent path', () => {
		vi.spyOn(Math, 'random').mockReturnValue(0.5);
		const round = generateBoggleRound(0);
		const { grid, seedWords } = round.payload as { grid: string[][]; seedWords: string[] };

		expect(grid).toHaveLength(4);
		expect(grid.every((row) => row.length === 4)).toBe(true);
		expect(seedWords.length).toBeGreaterThan(0);
		for (const word of seedWords) {
			expect(gridContainsWord(grid, word), `expected ${word} to be traceable`).toBe(true);
		}
	});
});

describe('battle input rules', () => {
	it('rejects Spelling Bee words that use letters outside the puzzle', () => {
		expect(canBuildWordFromLetters('กาก', ['ก', 'า', 'ก'])).toBe(true);
		expect(canBuildWordFromLetters('กาง', ['ก', 'า', 'ก'])).toBe(false);
		expect(canBuildWordFromLetters('กากก', ['ก', 'า', 'ก'])).toBe(false);
	});

	it('only builds Boggle words from adjacent, unrepeated cells', () => {
		const grid = [
			['ก', 'า'],
			['ง', 'ร']
		];
		const legalPath = [
			{ r: 0, c: 0 },
			{ r: 0, c: 1 },
			{ r: 1, c: 0 }
		];
		expect(isValidBogglePath(grid, legalPath)).toBe(true);
		expect(getBogglePathWord(grid, legalPath)).toBe('กาง');
		expect(isValidBogglePath(grid, [...legalPath, { r: 0, c: 0 }])).toBe(false);
		expect(
			isValidBogglePath(grid, [
				{ r: 0, c: 0 },
				{ r: 0, c: 2 }
			])
		).toBe(false);
	});

	it('only accepts answers inside the authoritative round window', () => {
		expect(isBattleRoundOpen(1_000, 2_000, 999)).toBe(false);
		expect(isBattleRoundOpen(1_000, 2_000, 1_000)).toBe(true);
		expect(isBattleRoundOpen(1_000, 2_000, 1_999)).toBe(true);
		expect(isBattleRoundOpen(1_000, 2_000, 2_000)).toBe(false);
		expect(isBattleRoundOpen(null, 2_000, 1_500)).toBe(false);
	});
});

describe('battle mutation safety', () => {
	const config = {
		puzzleType: 'thaiquiz',
		mode: 'quiz',
		theme: 'general',
		difficulty: 'normal',
		rounds: 3,
		timePerRound: 60,
		maxPlayers: 4,
		roomName: ' Test room ',
		isPublic: true
	} as const;

	it('validates and normalizes room configuration at the boundary', () => {
		expect(validateBattleConfig(config)?.roomName).toBe('Test room');
		expect(validateBattleConfig({ ...config, rounds: 0 })).toBeNull();
		expect(validateBattleConfig({ ...config, maxPlayers: 17 })).toBeNull();
		expect(validateBattleConfig({ ...config, puzzleType: 'unknown' })).toBeNull();
	});

	it('claims a client action once and rejects a replay', () => {
		const meta = {
			config,
			rounds: [],
			currentRound: 0,
			roundStartTime: null,
			roundEndTime: null
		} as unknown as BattleRoomMeta;
		expect(claimBattleAction(meta, 'round-1:answer-2', 'player-a', 10)).toBe(true);
		expect(claimBattleAction(meta, 'round-1:answer-2', 'player-a', 11)).toBe(false);
		expect(meta.actionReceipts?.['round-1:answer-2']).toEqual({
			playerId: 'player-a',
			timestamp: 10
		});
	});

	it('bounds receipt growth while retaining the newest actions', () => {
		const meta = {
			config,
			rounds: [],
			currentRound: 0,
			roundStartTime: null,
			roundEndTime: null
		} as unknown as BattleRoomMeta;
		for (let index = 0; index < 510; index++) {
			claimBattleAction(meta, `action-${index}`, 'player-a', index);
		}
		expect(Object.keys(meta.actionReceipts || {})).toHaveLength(500);
		expect(meta.actionReceipts?.['action-509']).toBeDefined();
		expect(meta.actionReceipts?.['action-0']).toBeUndefined();
	});
});
