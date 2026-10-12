import { describe, expect, it } from 'vitest';
import { PUBLIC_TABLES, PUBLIC_INSERT_TABLES, isAllowedTable, publicError } from './apiGuards';

describe('public API access policy', () => {
 it('allows public puzzle reads but denies private and retired tables', () => {
  expect(isAllowedTable('crossword', PUBLIC_TABLES)).toBe(true);
  expect(isAllowedTable('leaderboard', PUBLIC_TABLES)).toBe(true);
  for (const table of ['users', 'profiles', 'weekly', 'seventh', 'tbs2021', '', 'nonexistent']) {
   expect(isAllowedTable(table, PUBLIC_TABLES), table).toBe(false);
  }
 });
 it('allows creator submissions without exposing score or private writes', () => {
  for (const table of ['alphabet', 'crossword', 'missingvowels', 'wordsearch']) {
   expect(isAllowedTable(table, PUBLIC_INSERT_TABLES), table).toBe(true);
  }
  for (const table of ['leaderboard', 'users', 'profiles', 'weekly', 'seventh', 'tbs2021']) {
   expect(isAllowedTable(table, PUBLIC_INSERT_TABLES), table).toBe(false);
  }
 });
 it('returns generic server errors and explicit public rejection messages', async () => {
  const failure = publicError();
  expect(failure.status).toBe(500);
  expect(await failure.json()).toEqual({ error: 'Internal server error' });
  const rejection = publicError(404, 'Not found');
  expect(rejection.status).toBe(404);
  expect(await rejection.json()).toEqual({ error: 'Not found' });
 });
});
