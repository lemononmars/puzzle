export const PUZZLE_TABLES = new Set([
	'alphabet',
	'crossword',
	'cryptogram',
	'missingvowels',
	'puzzlehunt',
	'rebus',
	'spellingbee',
	'wordsearch'
]);

export const PUBLIC_TABLES = new Set([...PUZZLE_TABLES, 'leaderboard']);

export const PUBLIC_INSERT_TABLES = new Set([
	'alphabet',
	'crossword',
	'missingvowels',
	'wordsearch'
]);

export function isAllowedTable(table: string, allowed: Set<string>) {
	return allowed.has(table);
}

export function publicError(status = 500, message = 'Internal server error') {
	return Response.json({ error: message }, { status });
}
