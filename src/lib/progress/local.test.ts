// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { get } from 'svelte/store';
beforeEach(() => {
	localStorage.clear();
	vi.resetModules();
	vi.restoreAllMocks();
});
describe('local puzzle progress', () => {
	it('round trips game state, favorites and notes through a backup without exporting unrelated data', async () => {
		const store = await import('./local');
		localStorage.setItem('username', 'Player');
		localStorage.setItem('auth-token', 'private');
		store.saveGame('/puzzles/eulersquare', 'Euler Square', { grid: [[1]], seconds: 12 });
		store.updateEntry('/puzzles/eulersquare', 'Euler Square', {
			favorite: true,
			note: 'Try row two'
		});
		const backup = store.exportBackup();
		expect(backup).not.toContain('private');
		expect(backup).not.toContain('username');
		store.resetAllProgress();
		expect(localStorage.getItem('username')).toBe('Player');
		expect(store.loadGame('/puzzles/eulersquare')).toBeNull();
		store.importBackup(backup);
		expect(store.loadGame('/puzzles/eulersquare')).toEqual({ grid: [[1]], seconds: 12 });
		expect(get(store.library)[0]).toMatchObject({
			favorite: true,
			note: 'Try row two',
			status: 'in-progress'
		});
	});
	it('validates the entire backup before writing and rejects external links and unrelated keys', async () => {
		const store = await import('./local');
		store.updateEntry('/puzzles/eulersquare', 'Euler', { note: 'Keep me' });
		const original = localStorage.getItem('puzzle-library:v1');
		expect(() =>
			store.importBackup(
				JSON.stringify({
					format: 'puzzle-local-backup',
					version: 1,
					data: { 'puzzle-library:v1': '[]', username: '"replace"' }
				})
			)
		).toThrow();
		expect(localStorage.getItem('puzzle-library:v1')).toBe(original);
		expect(() =>
			store.importBackup(
				JSON.stringify({
					format: 'puzzle-local-backup',
					version: 1,
					data: {
						'puzzle-library:v1': JSON.stringify([
							{
								path: 'https://example.com',
								title: 'Bad',
								favorite: true,
								note: '',
								status: 'saved',
								updatedAt: 1
							}
						])
					}
				})
			)
		).toThrow();
	});
	it('keeps notes exportable when browser storage is full', async () => {
		const store = await import('./local');
		vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new DOMException('Full', 'QuotaExceededError');
		});
		store.updateEntry('/puzzles/eulersquare', 'Euler', { note: 'Still here' });
		expect(get(store.storageMessage)).not.toBe('');
		expect(store.exportBackup()).toContain('Still here');
	});
});
