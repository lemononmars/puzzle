export type SearchRecord = { url: string; title: string; description: string };

const normalize = (value: string) => value.normalize('NFC').toLocaleLowerCase();

// Optimal string alignment distance also treats adjacent swapped letters as one typo.
function distance(a: string, b: string): number {
	const left = Array.from(a),
		right = Array.from(b);
	const rows = Array.from({ length: left.length + 1 }, (_, i) => [i]);
	for (let j = 0; j <= right.length; j++) rows[0][j] = j;
	for (let i = 1; i <= left.length; i++) {
		for (let j = 1; j <= right.length; j++) {
			rows[i][j] = Math.min(
				rows[i - 1][j] + 1,
				rows[i][j - 1] + 1,
				rows[i - 1][j - 1] + Number(left[i - 1] !== right[j - 1])
			);
			if (i > 1 && j > 1 && left[i - 1] === right[j - 2] && left[i - 2] === right[j - 1]) {
				rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + 1);
			}
		}
	}
	return rows[left.length][right.length];
}

function tokenScore(token: string, text: string): number {
	if (text.includes(token)) return 0;
	const length = Array.from(token).length;
	if (length < 3) return Infinity;
	const allowance = length >= 6 ? 2 : 1;
	const words = text.match(/[\p{L}\p{M}\p{N}]+/gu) ?? [];
	let best = Infinity;
	for (const word of words) {
		if (Math.abs(Array.from(word).length - length) > allowance) continue;
		best = Math.min(best, distance(token, word));
	}
	return best <= allowance ? best + 1 : Infinity;
}

export function searchRecords<T extends SearchRecord>(
	records: T[],
	query: string,
	limit = 30
): T[] {
	const value = normalize(query.trim());
	if (!value) return [];
	const tokens = value.split(/\s+/);
	return records
		.map((record) => {
			const title = normalize(record.title);
			const description = normalize(record.description);
			const score =
				tokens.reduce(
					(sum, token) =>
						sum + Math.min(tokenScore(token, title), tokenScore(token, description) + 3),
					0
				) + (title === value ? -2 : title.startsWith(value) ? -1 : 0);
			return { record, score };
		})
		.filter((result) => Number.isFinite(result.score))
		.sort((a, b) => a.score - b.score || a.record.title.localeCompare(b.record.title))
		.slice(0, limit)
		.map((result) => result.record);
}
