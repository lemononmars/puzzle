import dictionaryUrl from '../dict.json?url';
let dictionary: Promise<string[]> | undefined;
import {
	buildWordList,
	generatePuzzle,
	bfsPath,
	splitSlots,
	diffSlots
} from '../wordladder/wordladder.js';
function buildComponents(words: string[]): string[][] {
	const n = words.length;
	const parent = Int32Array.from({ length: n }, (_, i) => i);
	const rank = new Int32Array(n);

	function find(x: number): number {
		while (parent[x] !== x) {
			parent[x] = parent[parent[x]];
			x = parent[x];
		}
		return x;
	}
	function union(a: number, b: number) {
		a = find(a);
		b = find(b);
		if (a === b) return;
		if (rank[a] < rank[b]) {
			const t = a;
			a = b;
			b = t;
		}
		parent[b] = a;
		if (rank[a] === rank[b]) rank[a]++;
	}

	// Pre-compute splits once
	const splits = words.map(splitSlots);

	// O(n²) adjacency
	for (let i = 0; i < n; i++) {
		for (let j = i + 1; j < n; j++) {
			if (diffSlots(splits[i], splits[j]) === 1) union(i, j);
		}
	}

	// Group by root
	const groups = new Map<number, string[]>();
	for (let i = 0; i < n; i++) {
		const r = find(i);
		if (!groups.has(r)) groups.set(r, []);
		groups.get(r)!.push(words[i]);
	}

	return [...groups.values()].sort((a, b) => b.length - a.length);
}

let words: string[] = [];
self.onmessage = async ({ data }) => {
	const { id, action, size, seed, start, end } = data;
	try {
		if (action === 'path') {
			self.postMessage({ id, result: bfsPath(start, end, words) });
			return;
		}
		const dict = await (dictionary ??= fetch(dictionaryUrl).then((response) => {
			if (!response.ok) throw new Error('Could not load Thai dictionary');
			return response.json();
		}));
		words = buildWordList(dict, size);
		const result =
			action === 'graph'
				? { wordCount: words.length, components: buildComponents(words) }
				: {
						words,
						puzzle: generatePuzzle(
							words,
							3,
							size === 3 ? 5 : size === 4 ? 6 : size === 5 ? 7 : 8,
							seed
						)
					};
		self.postMessage({ id, result });
	} catch (error) {
		self.postMessage({ id, error: error instanceof Error ? error.message : 'Word ladder failed' });
	}
};
