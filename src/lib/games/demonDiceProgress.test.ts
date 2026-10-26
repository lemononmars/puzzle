import { describe, it, expect } from 'vitest';
import {
	loadCompleted,
	saveCompleted,
	loadTutorialBest,
	saveTutorialBest
} from './demonDiceProgress.js';
describe('Demon Dice completed levels', () => {
	it('keeps a validated best tutorial result for the target star', () => {
		let data = '';
		const storage = {
			getItem: () => data,
			setItem: (_key: string, value: string) => {
				data = value;
			}
		};
		saveTutorialBest(storage, { A1: 3, C1: 1 });
		expect(loadTutorialBest(storage)).toEqual({ A1: 3, C1: 1 });
		data = '{"A1":1,"B2":-1,"C1":"bad","P1":2}';
		expect(loadTutorialBest(storage)).toEqual({ A1: 1 });
	});
	it('retains valid completed IDs across storage reads and separates modes', () => {
		const memory = new Map<string, string>();
		const storage = {
			getItem: (key: string) => memory.get(key) ?? null,
			setItem: (key: string, value: string) => {
				memory.set(key, value);
			}
		};
		saveCompleted(storage, 'tutorials', ['A1', 'E5', 'A1', 'unknown']);
		saveCompleted(storage, 'puzzles', ['P1']);
		expect(loadCompleted(storage, 'tutorials', ['A1', 'E5'])).toEqual(['A1', 'E5']);
		expect(loadCompleted(storage, 'puzzles', ['P1'])).toEqual(['P1']);
	});
	it('tolerates malformed and blocked browser storage', () => {
		expect(loadCompleted({ getItem: () => '{bad' }, 'tutorials', ['A1'])).toEqual([]);
		expect(() =>
			saveCompleted(
				{
					setItem: () => {
						throw Error('blocked');
					}
				},
				'tutorials',
				['A1']
			)
		).not.toThrow();
	});
});
