/**
 * Thai Word Ladder core logic.
 *
 * A "slot" = one Thai consonant/leading-vowel character optionally followed
 * by diacritics (sara, tone marks).  Two words are adjacent if they have the
 * same slot count and differ in exactly one slot.
 *
 * Uses splitWord from thaiwords.ts for slot segmentation.
 */

import { splitWord } from '#lib/utils/thaiwords.js';

/** Alias for consistency with the rest of this module. */
export const splitSlots = splitWord;

const PURE_THAI_RE = /^[\u0E00-\u0E7F]+$/;

/** Number of slots (= "word length" in Thai sense). */
export function slotCount(word: string): number {
	return splitWord(word).length;
}

/** Number of differing slots between two same-length words. */
export function diffSlots(a: string[], b: string[]): number {
	if (a.length !== b.length) return Infinity;
	let d = 0;
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) {
			d++;
			if (d > 1) return d;
		}
	}
	return d;
}

/** Filter dictionary to only pure-Thai words of given slot count. */
export function buildWordList(dict: string[], n: number): string[] {
	const seen = new Set<string>();
	const out: string[] = [];
	for (const w of dict) {
		if (!PURE_THAI_RE.test(w)) continue;
		if (seen.has(w)) continue;
		if (slotCount(w) !== n) continue;
		seen.add(w);
		out.push(w);
	}
	return out;
}

/** Get all neighbours of a word in the word list (words differing by 1 slot). */
export function getNeighbors(word: string, wordList: string[]): string[] {
	const slots = splitSlots(word);
	const result: string[] = [];
	for (const w of wordList) {
		if (w === word) continue;
		if (diffSlots(slots, splitSlots(w)) === 1) result.push(w);
	}
	return result;
}

/** BFS: find shortest path from `start` to `end` in word list. Returns path or null. */
export function bfsPath(start: string, end: string, wordList: string[]): string[] | null {
	if (start === end) return [start];
	const wordSet = new Set(wordList);
	if (!wordSet.has(start) || !wordSet.has(end)) return null;

	const visited = new Map<string, string | null>();
	visited.set(start, null);
	const queue: string[] = [start];

	while (queue.length > 0) {
		const curr = queue.shift()!;
		const currSlots = splitSlots(curr);

		for (const w of wordList) {
			if (visited.has(w)) continue;
			if (diffSlots(currSlots, splitSlots(w)) === 1) {
				visited.set(w, curr);
				if (w === end) {
					// Reconstruct path
					const path: string[] = [];
					let node: string | null = end;
					while (node !== null) {
						path.unshift(node);
						node = visited.get(node) ?? null;
					}
					return path;
				}
				queue.push(w);
			}
		}
	}
	return null;
}

/**
 * Generate a puzzle: pick a random start word and find a target at BFS
 * distance [minDist, maxDist] away.  Returns { start, end, minPath }.
 *
 * Pre-computes all slot-splits once for efficiency.
 */
export function generatePuzzle(
	wordList: string[],
	minDist = 3,
	maxDist = 6,
	rngSeed?: number,
	currentStart?: string
): { start: string; end: string; minPath: string[] } | null {
	// Pre-compute splits for the entire word list once
	const allSplits = wordList.map((w) => splitSlots(w));

	// Seeded random (LCG) — use Math.imul for exact 32-bit hardware integer multiplication
	let seed = (rngSeed ?? Math.floor(Math.random() * 2_000_000_000)) >>> 0;
	function rnd(max: number) {
		seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
		return max > 0 ? seed % max : 0;
	}

	function nextInt(max: number) {
		if (max <= 0) return 0;
		if (rngSeed !== undefined) return rnd(max);
		return Math.floor(Math.random() * max);
	}

	// Try up to 100 random start words
	const attempts = Math.min(100, wordList.length);
	for (let a = 0; a < attempts; a++) {
		const startIdx = nextInt(wordList.length);
		const start = wordList[startIdx];
		if (currentStart && start === currentStart && wordList.length > 1) continue;

		// BFS by index; collect words at each distance layer
		const visitedParent = new Int32Array(wordList.length).fill(-2); // -2 = unvisited
		visitedParent[startIdx] = -1; // root
		let frontier: number[] = [startIdx];
		let dist = 0;
		const byDist: number[][] = [[]];

		while (frontier.length > 0 && dist < maxDist) {
			dist++;
			const nextFrontier: number[] = [];
			for (const ci of frontier) {
				const cSlots = allSplits[ci];
				for (let j = 0; j < wordList.length; j++) {
					if (visitedParent[j] !== -2) continue;
					if (diffSlots(cSlots, allSplits[j]) === 1) {
						visitedParent[j] = ci;
						nextFrontier.push(j);
					}
				}
			}
			byDist.push(nextFrontier);
			frontier = nextFrontier;
		}

		// Pick a target from [minDist, maxDist]
		const candidates: number[] = [];
		for (let d = minDist; d <= maxDist && d < byDist.length; d++) {
			candidates.push(...byDist[d]);
		}
		if (candidates.length === 0) continue;

		const endIdx = candidates[nextInt(candidates.length)];
		const end = wordList[endIdx];

		// Reconstruct minimal path via parent array
		const path: string[] = [];
		let idx = endIdx;
		while (idx !== -1) {
			path.unshift(wordList[idx]);
			idx = visitedParent[idx];
		}

		return { start, end, minPath: path };
	}
	return null;
}

/** Check if a chain of words is valid (each step differs by exactly 1 slot). */
export function validateChain(
	chain: string[],
	wordSet: Set<string>
): { valid: boolean; errorIdx: number } {
	for (let i = 0; i < chain.length; i++) {
		if (!wordSet.has(chain[i])) return { valid: false, errorIdx: i };
		if (i > 0) {
			const d = diffSlots(splitSlots(chain[i - 1]), splitSlots(chain[i]));
			if (d !== 1) return { valid: false, errorIdx: i };
		}
	}
	return { valid: true, errorIdx: -1 };
}
