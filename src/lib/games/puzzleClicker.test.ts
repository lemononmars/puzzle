import { describe, expect, it } from 'vitest';
import { advance, buy, clickPower, earn, freshWorkshop, pencilPrice, price, production, restoreWorkshop } from './puzzleClicker.js';

describe('Puzzle Workshop economy', () => {
	it('spends exactly the price and increases the next cost without losing lifetime earnings', () => {
		const start = earn(freshWorkshop(0), 25);
		const next = buy(start, 0);
		expect(next.pieces).toBe(10);
		expect(next.lifetime).toBe(25);
		expect(next.owned).toEqual([1, 0, 0]);
		expect(production(next)).toBe(0.2);
		expect(price(15, 1)).toBe(18);
		expect(buy(next, 0)).toBe(next);
	});
	it('upgrades clicks and uses elapsed time for fractional production', () => {
		const upgraded = buy(earn(freshWorkshop(0), 40), 'pencil');
		expect(clickPower(upgraded)).toBe(2);
		expect(pencilPrice(upgraded)).toBe(45);
		const passive = buy(upgraded, 0);
		expect(advance(passive, 2500).pieces).toBeCloseTo(0.5);
		expect(advance(passive, -100).pieces).toBe(0);
	});
	it('caps offline earnings at eight hours and does not grant them twice', () => {
		const state = buy(earn(freshWorkshop(1000), 15), 0);
		const resumed = advance(state, 1000 + 86400000);
		expect(resumed.pieces).toBe(5760);
		expect(advance(resumed, resumed.savedAt).pieces).toBe(5760);
	});
	it('rejects malformed saves and preserves valid progress', () => {
		const state = buy(earn(freshWorkshop(1000), 15), 0);
		expect(restoreWorkshop(state, 2000)).toEqual(state);
		for (const saved of [null, {}, { ...state, pieces: Infinity }, { ...state, owned: [-1, 0, 0] }, { ...state, owned: [1] }, { ...state, lifetime: -1 }]) {
			expect(restoreWorkshop(saved, 2000)).toEqual(freshWorkshop(2000));
		}
		expect(restoreWorkshop({ ...state, savedAt: 9000 }, 2000).savedAt).toBe(2000);
	});
});
