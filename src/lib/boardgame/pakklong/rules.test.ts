import { describe, expect, it } from 'vitest';
import {
	arrangementError,
	generateMarket,
	generateStartingFlowerCards,
	getMyTimeTokens,
	placePlanningToken
} from './rules';
import { toolCost } from './constants';
import type { BouquetOrder, Player } from './types';

describe('Pakklong market payload', () => {
	it('never generates an out-of-range tool tier or an undefined price', () => {
		for (const roll of [0, 0.25, 0.5, 0.999999]) {
			const market = generateMarket(6, () => roll);
			expect(market[5]).toHaveLength(toolCost.length);
			market[5].forEach((tier, type) => {
				expect(Number.isFinite(toolCost[type][tier])).toBe(true);
			});
			expect(market.slice(1, 4).flat()).toHaveLength(12);
			expect(market[4]).toHaveLength(6);
		}
	});
	it('deals a complete six-player starting deck', () => {
		const cards = generateStartingFlowerCards(() => 0.5);
		expect(cards).toHaveLength(6);
		expect(cards.every((card) => card.slice(0, 3).reduce((a, b) => a + b, 0) === 2)).toBe(true);
	});
});
describe('bouquet arrangement', () => {
	const order: BouquetOrder = { flowers: [1, 1, 0], quality: 7, score: 2, level: 0 };
	it('requires both the right flower types and enough quality', () => {
		expect(
			arrangementError(
				order,
				[
					{ type: 0, quality: 3 },
					{ type: 1, quality: 2 }
				],
				1,
				0
			)
		).toBeUndefined();
		expect(
			arrangementError(
				order,
				[
					{ type: 0, quality: 3 },
					{ type: 1, quality: 2 }
				],
				0,
				0
			)
		).toBe('Quality not satisfied');
		expect(
			arrangementError(
				order,
				[
					{ type: 0, quality: 7 },
					{ type: 0, quality: 7 }
				],
				0,
				0
			)
		).toBe('Not enough flowers of some type');
	});
	it('rejects spending ribbons that do not improve the required quality', () => {
		expect(
			arrangementError(
				order,
				[
					{ type: 0, quality: 4 },
					{ type: 1, quality: 3 }
				],
				1,
				0
			)
		).toBe('Too many ribbons');
	});
	it('leaves exactly six planning tokens after the clock upgrade', () => {
		const tokens = getMyTimeTokens({ time: 3 } as Player);
		expect(tokens).toEqual([0, 1, 2, 4, 5, 6]);
	});
});

describe('shop-first planning', () => {
	it('swaps a used token with the destination shop instead of discarding it', () => {
		const plan = [1, 2, 3, 4, 5, 6];
		expect(placePlanningToken(plan, 4, 2)).toEqual([1, 5, 3, 4, 2, 6]);
		expect(plan).toEqual([1, 2, 3, 4, 5, 6]);
	});
	it('moves a used token to an empty shop and returns the empty slot to its origin', () => {
		expect(placePlanningToken([1, null, 3, null, null, null], 1, 1)).toEqual([
			null,
			1,
			3,
			null,
			null,
			null
		]);
	});
	it('replaces a token with an unused token and leaves other shops intact', () => {
		expect(placePlanningToken([1, 2, null, null, null, null], 0, 4)).toEqual([
			4,
			2,
			null,
			null,
			null,
			null
		]);
	});
});
