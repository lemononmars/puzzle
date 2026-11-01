import { describe, expect, it } from 'vitest';
import { searchRecords } from './search';

const records = [
	{ url: '/description', title: 'A reference', description: 'Pentomino solver' },
	{ url: '/pentomino', title: 'Pentomino Solver', description: 'เครื่องมือช่วยไขปริศนา' },
	{ url: '/crossword', title: 'Crossword Builder', description: 'สร้างอักษรไขว้ภาษาไทย' },
	{ url: '/pips', title: 'Pip’s Plot', description: 'Web Game' }
];

describe('public metadata search', () => {
	it('matches prefixes while typing and ranks titles ahead of descriptions', () => {
		expect(searchRecords(records, 'PENTO')[0].url).toBe('/pentomino');
	});
	it('accepts missing letters and adjacent transpositions', () => {
		expect(searchRecords(records, 'pentmino')[0].url).toBe('/pentomino');
		expect(searchRecords(records, 'crosswrod')[0].url).toBe('/crossword');
	});
	it('matches Thai text and requires every query token', () => {
		expect(searchRecords(records, 'ภาษาไทย')[0].url).toBe('/crossword');
		expect(searchRecords(records, 'crosswrod builder')[0].url).toBe('/crossword');
		expect(searchRecords(records, 'crossword pentomino')).toEqual([]);
	});
	it('clears empty queries, rejects unrelated terms, and limits results', () => {
		expect(searchRecords(records, '  ')).toEqual([]);
		expect(searchRecords(records, 'zzzzzzzz')).toEqual([]);
		expect(searchRecords(records, 'pentomino', 1)).toHaveLength(1);
	});
});
