// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { get } from 'svelte/store';
beforeEach(() => { localStorage.clear(); vi.resetModules(); vi.restoreAllMocks(); });
describe('local game saves', () => {
 it('round trips game state without exporting unrelated browser data', async () => {
  const store = await import('./local');
  localStorage.setItem('username', 'Player');
  localStorage.setItem('auth-token', 'private');
  store.saveGame('/puzzles/eulersquare', 'Euler Square', { grid: [[1]], seconds: 12 });
  const backup = store.exportBackup();
  expect(backup).not.toContain('private');
  expect(backup).not.toContain('username');
  store.resetAllProgress();
  expect(localStorage.getItem('username')).toBe('Player');
  expect(store.loadGame('/puzzles/eulersquare')).toBeNull();
  store.importBackup(backup);
  expect(store.loadGame('/puzzles/eulersquare')).toEqual({ grid: [[1]], seconds: 12 });
 });
 it('validates the entire backup before writing and rejects unrelated keys and external paths', async () => {
  const store = await import('./local');
  store.saveGame('/puzzles/eulersquare', 'Euler', { grid: [[1]] });
  const key = 'puzzle-save:v1:/puzzles/eulersquare';
  const original = localStorage.getItem(key);
  const backup = (data: Record<string, string>) => JSON.stringify({ format: 'puzzle-local-backup', version: 1, data });
  expect(() => store.importBackup(backup({ [key]: '{}', username: '"replace"' }))).toThrow();
  expect(localStorage.getItem(key)).toBe(original);
  expect(() => store.importBackup(backup({ 'puzzle-save:v1:https://example.com': '{}' }))).toThrow();
 });
 it('reports storage failures without throwing from game autosave', async () => {
  const store = await import('./local');
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Full', 'QuotaExceededError'); });
  expect(() => store.saveGame('/puzzles/eulersquare', 'Euler', { grid: [[1]] })).not.toThrow();
  expect(get(store.storageMessage)).not.toBe('');
 });
});
