import { describe, it, expect } from 'vitest';
import {
	prepareDictionary,
	newWar,
	addWarLetter,
	challengeWar,
	answerWar,
	botWarAction,
	expireWar,
	TURN_MS,
	startingPool
} from './wordWars';
import frequency from './countdownLetterFrequency.json';
import countdownDictionary from '../utils/dict';
const dict = prepareDictionary(['กก', 'กา']);
const fixture = () => ({ ...newWar(dict, 0, () => 0), reserve: Array(10).fill('ก') as string[] });
describe('Word Wars opponent challenges and random reserve', () => {
	it('draws ten independent frequency-weighted letters and starts with an empty pool', () => {
		const s = newWar(dict, 0, () => 0);
		expect(s.reserve).toHaveLength(10);
		expect(s.pool).toEqual([]);
		expect(s.reserve.every((l) => l === String(frequency.vowels[0][0]))).toBe(true);
		expect(
			startingPool(dict, () => 1 - Number.EPSILON).every(
				(l) => l === String(frequency.consonants.at(-1)![0])
			)
		).toBe(true);
	});
	it('uses exactly the Countdown page frequency weights', () => {
		const c: Record<string, number> = {},
			v: Record<string, number> = {};
		for (const w of countdownDictionary)
			for (const l of w.trim().normalize('NFC').split('')) {
				const counts = /[ก-ฮ]/.test(l) ? c : /[ะาิีึืุูเแโใไำฤ]/.test(l) ? v : null;
				if (counts) counts[l] = (counts[l] ?? 0) + 1;
			}
		const weights = (n: Record<string, number>) =>
			Object.entries(n).map(([l, count]) => [l, Math.max(1, Math.floor(Math.sqrt(count)))]);
		expect(frequency).toEqual({ consonants: weights(c), vowels: weights(v) });
	});
	it('consumes just one selected reserve tile per addition', () => {
		const s = fixture(),
			n = addWarLetter(s, 'ก', 100);
		expect(n.reserve).toHaveLength(9);
		expect(n.pool).toEqual(['ก']);
		expect(n.turn).toBe(1);
		expect(s.reserve).toHaveLength(10);
		expect(() => addWarLetter(n, 'ข', 200)).toThrow('starting');
	});
	it('requires the opponent to answer using the pool without reserve tiles', () => {
		const c = challengeWar({ ...fixture(), pool: ['ก', 'ก'], reserve: Array(8).fill('ก') }, 100);
		expect(c.challenger).toBe(0);
		expect(c.turn).toBe(1);
		expect(() => answerWar(c, 'กกก', dict, 200)).toThrow('every tile');
		expect(answerWar(c, 'กก', dict, 200).scores).toEqual([0, 1]);
		expect(expireWar(c, dict, 100 + TURN_MS).scores).toEqual([1, 0]);
	});
	it('bot answers challenges and challenges an impossible pool', () => {
		const c = challengeWar({ ...fixture(), pool: ['ก', 'ก'] }, 100);
		expect(botWarAction(c, dict, 200).scores).toEqual([0, 1]);
		const impossible = { ...fixture(), turn: 1 as const, pool: ['ก', 'ข'] };
		const challenged = botWarAction(impossible, dict, 100);
		expect(challenged.phase).toBe('answer');
		expect(challenged.turn).toBe(0);
	});
});
