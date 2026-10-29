import {
	loadRandomBest,
	saveRandomBest,
	loadCompleted,
	saveCompleted
} from './demonDiceProgress.js';
import { expect, it } from 'vitest';
it('isolates Random completion and validates sixes records', () => {
	const memory = new Map<string, string>();
	const storage = {
		getItem: (key: string) => memory.get(key) ?? null,
		setItem: (key: string, value: string) => {
			memory.set(key, value);
		}
	};
	saveCompleted(storage, 'random', ['AAA', 'JJJ']);
	saveCompleted(storage, 'retro', ['R001']);
	expect(loadCompleted(storage, 'random', ['AAA', 'JJJ'])).toEqual(['AAA', 'JJJ']);
	saveRandomBest(storage, { AAA: 15, JJJ: 20, ABC: -1, XYZ: 5, AAB: 21, AAC: 1.5 });
	expect(loadRandomBest(storage)).toEqual({ AAA: 15, JJJ: 20 });
	expect(loadRandomBest({ getItem: () => '{bad' })).toEqual({});
});
