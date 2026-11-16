import dictionary from '#lib/utils/dict.js';
import { splitWord } from '#lib/utils/thai-text.js';

export type WordSet = {
	words: string[];
	added?: string;
	insertionAt?: number;
	parity?: 'odd' | 'even';
};
type Trie = { next: Map<string, Trie>; word?: string; id: number };

function isThreeBlockRearrangement(letters: string[], target: string) {
	for (let first = 1; first < letters.length - 1; first++) {
		for (let second = first + 1; second < letters.length; second++) {
			const a = letters.slice(0, first).join('');
			const b = letters.slice(first, second).join('');
			const c = letters.slice(second).join('');
			if ([a + c + b, b + a + c, b + c + a, c + a + b, c + b + a].includes(target)) return true;
		}
	}
	return false;
}

/** Thai puzzle tiles: combining vowels and tone marks travel with their base. */
export function findThaiWordSets(source: string[]) {
	const words = [
		...new Set(source.filter((word) => /^[ก-๎]+$/u.test(word) && !word.startsWith('การ')))
	].sort();
	const tiles = new Map(words.map((word) => [word, splitWord(word)]));
	const groups = new Map<string, string[]>();
	const result: WordSet[][] = [[], [], [], [], [], [], [], [], []];
	let id = 0;
	const node = (): Trie => ({ next: new Map(), id: id++ });
	const root = node();
	for (const word of words) {
		const letters = tiles.get(word)!;
		const key = JSON.stringify([...letters].sort());
		const group = groups.get(key) ?? [];
		group.push(word);
		groups.set(key, group);
		let cursor = root;
		for (const letter of letters) {
			if (!cursor.next.has(letter)) cursor.next.set(letter, node());
			cursor = cursor.next.get(letter)!;
		}
		cursor.word = word;
	}
	for (const group of groups.values()) {
		for (let a = 0; a < group.length; a++) {
			for (let b = a + 1; b < group.length; b++) {
				const letters = tiles.get(group[a])!;
				const isRotation = letters.some(
					(_, index) =>
						index > 0 && [...letters.slice(index), ...letters.slice(0, index)].join('') === group[b]
				);
				if (isRotation) result[7].push({ words: [group[a], group[b]] });
				else if (!isThreeBlockRearrangement(letters, group[b]))
					result[0].push({ words: [group[a], group[b]] });
			}
		}
	}
	for (const word of words) {
		const letters = tiles.get(word)!;
		// Emit each distinct reversal pair once; marks travel with their base tile.
		const reversed = [...letters].reverse().join('');
		if (word < reversed && tiles.has(reversed)) result[8].push({ words: [word, reversed] });
		// An inserted word must be contiguous and strictly inside the outer word.
		const insertions = new Set<string>();
		for (let start = 1; start < letters.length - 1; start++) {
			for (let end = start + 1; end < letters.length; end++) {
				const inner = letters.slice(start, end).join('');
				const outer = [...letters.slice(0, start), ...letters.slice(end)].join('');
				const key = JSON.stringify([outer, inner]);
				if (tiles.has(inner) && tiles.has(outer) && !insertions.has(key)) {
					result[4].push({ words: [word, outer, inner], insertionAt: start });
					insertions.add(key);
				}
			}
		}
		if (letters.length >= 2) {
			const alternating: string[] = [];
			for (const parity of ['odd', 'even'] as const) {
				const extracted = letters
					.filter((_, index) => index % 2 === (parity === 'odd' ? 0 : 1))
					.join('');
				alternating.push(extracted);
				if (tiles.has(extracted)) result[5].push({ words: [word, extracted], parity });
			}
			// Odd tiles belong to the starting word; even tiles belong to the second.
			if (alternating.every((part) => tiles.has(part))) {
				result[6].push({ words: [word, ...alternating] });
			}
		}
		// Rule 2 replaces splitting: remove one strictly internal tile from the target.
		const addedLetters = new Set<string>();
		for (let index = 1; index < letters.length - 1; index++) {
			const original = [...letters.slice(0, index), ...letters.slice(index + 1)].join('');
			if (tiles.has(original) && !addedLetters.has(original)) {
				result[1].push({ words: [original, word], added: letters[index] });
				addedLetters.add(original);
			}
		}
		// Walk two dictionary tries together, assigning each tile to exactly one word.
		const visited = new Set<string>();
		const weave = (index: number, a: Trie, b: Trie) => {
			const key = `${index}:${a.id}:${b.id}`;
			if (visited.has(key)) return;
			visited.add(key);
			if (index === letters.length) {
				if (
					a.word &&
					b.word &&
					a.word <= b.word &&
					word !== a.word + b.word &&
					word !== b.word + a.word
				) {
					result[2].push({ words: [word, a.word, b.word] });
				}
				return;
			}
			const left = a.next.get(letters[index]);
			const right = b.next.get(letters[index]);
			if (left) weave(index + 1, left, b);
			if (right) weave(index + 1, a, right);
		};
		weave(0, root, root);
		// Removing any one tile from the target must give the reversed source.
		if (letters.length >= 2) {
			const seen = new Set<string>();
			for (let index = 0; index < letters.length; index++) {
				const reversed = letters
					.filter((_, i) => i !== index)
					.reverse()
					.join('');
				if (tiles.has(reversed) && !seen.has(reversed)) {
					result[3].push({ words: [reversed, word], added: letters[index] });
					seen.add(reversed);
				}
			}
		}
	}
	// Keep one-tile dictionary entries only for reverse + one letter (rule 4).
	for (let index = 0; index < result.length; index++) {
		if (index !== 3) {
			result[index] = result[index].filter((set) =>
				set.words.every((word) => tiles.get(word)!.length > 1)
			);
		}
	}
	for (const sets of result)
		sets.sort(
			(a, b) =>
				tiles.get(a.words[0])!.length - tiles.get(b.words[0])!.length ||
				a.words.join('|').localeCompare(b.words.join('|'), 'th')
		);
	return { dictionarySize: words.length, sets: result };
}

let cached: ReturnType<typeof findThaiWordSets> | undefined;
export function getThaiWordSets() {
	return (cached ??= findThaiWordSets(dictionary));
}
