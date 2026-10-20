import wikiUrl from '../wiki.json?url';
import dictionaryUrl from '../dict.json?url';
let dict: string[] = [];
let dictionaryReady: Promise<void> | undefined;
let wikiReady: Promise<void> | undefined;
async function prepare(includeWiki: boolean) {
	await (dictionaryReady ??= (
		import.meta.env.SSR
			? import('../dict.json').then((module) => module.default)
			: fetch(dictionaryUrl).then((response) => {
					if (!response.ok) throw new Error('Could not load Thai dictionary');
					return response.json();
				})
	).then((words) => {
		dict = words;
		dictSet = new Set(dict);
	}));
	if (includeWiki)
		await (wikiReady ??= (
			import.meta.env.SSR
				? import('../wiki.json').then((module) => module.default)
				: fetch(wikiUrl).then((response) => {
						if (!response.ok) throw new Error('Could not load Wikipedia word list');
						return response.json();
					})
		).then((words) => {
			wiki = words;
		}));
}
let wiki: string[] = [];
import abbrRaw from '#lib/data/thai_abbreviations.csv?raw';

function parseAbbrWords(raw: string): string[] {
	if (!raw) return [];
	const lines = raw.split('\n').slice(1);
	const set = new Set<string>();
	for (const line of lines) {
		const parts = line.split(',');
		if (parts[0]) set.add(parts[0].trim());
		if (parts[1]) set.add(parts[1].trim());
	}
	return Array.from(set).filter((w) => w.length > 0);
}

const abbrWords = parseAbbrWords(abbrRaw);

// --- Trie Implementation for Thai Crossword Optimization ---
let dictTrie: any = null;
let combinedTrie: any = null;

import {
	buildThaiTrie,
	searchThaiTrie,
	splitWord,
	wordLength,
	tokenizeQuery,
	matchCharClass
} from '../utils/thai-pattern.js';
function removeSymbols(word: string) {
	return word.replace(/[\*\.\/\&\|\^\[\]\~]/g, '');
}

let dictSet = new Set<string>();
let wikiSet: Set<string> | null = null;

export async function search(
	query: string,
	includeWiki: boolean,
	abortSignal?: AbortSignal,
	progressObj?: { count: number },
	strict: boolean = true
) {
	if (!query) return { valid: false, count: 0, results: [] };
	await prepare(includeWiki);

	if (query.includes(';')) {
		return await solveSystem(query, includeWiki, abortSignal, progressObj, strict);
	}

	// Crossword optimization: check if query is a simple pattern (Thai chars, dots, and character classes)
	// No variable, no anagram, no subset, no length, no union/intersection
	const isSimplePattern =
		!query.match(/[\&\|\:\/\!\{\}\*\~]/) && !query.match(/(^|[^\[])([A-Z0-9])/);
	if (isSimplePattern) {
		if (includeWiki) {
			if (!combinedTrie)
				combinedTrie = buildThaiTrie([...dict, ...(wiki as string[]), ...abbrWords]);
		} else {
			if (!dictTrie) dictTrie = buildThaiTrie(dict);
		}
		const root = includeWiki ? combinedTrie : dictTrie;
		let results = searchThaiTrie(root, query, strict);
		// Sort locale Thai
		results = results.sort((a, b) => a.localeCompare(b, 'th'));
		return {
			valid: true,
			count: results.length,
			results: results,
			aborted: false
		};
	}

	let andMode = query.includes('&');
	let queries = query.split(/[\&\|]/).map(
		(q) =>
			q
				.trim()
				.replace(/[\*]{2,}/g, '*') // replace multiple * with a single *
				.replace(/\*\./g, '.*') // replace substring *. with .* for slight speedup
	);

	let excluded: string[] = [];
	let excludedQuery = queries.filter((q) => q.includes('^'));
	excludedQuery.forEach((eq) => (excluded = excluded.concat(splitWord(removeSymbols(eq)))));
	queries = queries.filter((q) => !q.includes('^'));
	// special case: if the user only inputs exclusion string, we search for all strings!
	if (excluded.length > 0 && queries.length == 0) queries = ['*'];

	let minLength = 0;
	let maxLength = 100;
	let lengthQuery = queries.find((q) => q.includes(':') || q.match(/^\d+(-\d*)?$/)); // only the first length query is used
	if (lengthQuery) {
		let colonIndex = lengthQuery.indexOf(':');
		let lengthStr = colonIndex >= 0 ? lengthQuery.slice(0, colonIndex) : lengthQuery;

		// a single number - exact match
		if (!lengthStr.includes('-')) lengthStr += '-' + lengthStr;
		const minStr = lengthStr.slice(0, lengthStr.indexOf('-'));
		const maxStr = lengthStr.slice(lengthStr.indexOf('-') + 1);
		if (minStr.length > 0) minLength = parseInt(minStr);
		if (maxStr.length > 0) maxLength = parseInt(maxStr);
	}

	let results: string[] = [];
	// check each word against all queries
	for (let i = 0; i < dict.length; i++) {
		if (abortSignal?.aborted)
			return { valid: true, count: results.length, results: results, aborted: true };
		if (i % 5000 === 0) await new Promise((r) => setTimeout(r, 0));

		let w = dict[i];
		const len = wordLength(w);
		if (len < minLength || len > maxLength) continue;
		let matchedQuery = 0;
		queries.forEach((q) => {
			var result = matchQuery(w, q, excluded, {}, strict);
			result = q.includes('!') ? !result : result;
			matchedQuery += result ? 1 : 0;
		});
		if ((andMode && matchedQuery === queries.length) || (!andMode && matchedQuery > 0)) {
			results.push(w);
			if (progressObj) progressObj.count = results.length;
		}
	}

	if (includeWiki) {
		let wikiList = [...(wiki as string[]), ...abbrWords];
		for (let i = 0; i < wikiList.length; i++) {
			if (abortSignal?.aborted)
				return { valid: true, count: results.length, results: results, aborted: true };
			if (i % 5000 === 0) await new Promise((r) => setTimeout(r, 0));

			let w = wikiList[i];
			const len = wordLength(w);
			if (len < minLength || len > maxLength) continue;
			let matchedQuery = 0;
			queries.forEach((q) => {
				var result = matchQuery(w, q, excluded, {}, strict);
				result = q.includes('!') ? !result : result;
				matchedQuery += result ? 1 : 0;
			});
			if ((andMode && matchedQuery === queries.length) || (!andMode && matchedQuery > 0)) {
				if (!results.includes(w)) {
					results.push(w);
					if (progressObj) progressObj.count = results.length;
				}
			}
		}
	}

	// sort locale Thai
	results = results.sort((a, b) => a.localeCompare(b, 'th'));
	return {
		valid: true,
		count: results.length,
		results: results,
		aborted: false
	};
}

export async function searchStrict(
	query: string,
	includeWiki: boolean,
	abortSignal?: AbortSignal,
	progressObj?: { count: number }
) {
	return await search(query, includeWiki, abortSignal, progressObj, true);
}

export async function solveSystem(
	query: string,
	includeWiki: boolean,
	abortSignal?: AbortSignal,
	progressObj?: { count: number },
	strict: boolean = true
) {
	await prepare(includeWiki);
	let patterns = query
		.split(';')
		.map((p) => p.trim())
		.filter((p) => p.length > 0);
	let results: string[] = [];

	if (includeWiki && !wikiSet) {
		wikiSet = new Set(wiki as string[]);
	}
	let dictToUse = includeWiki ? [...dict, ...(wiki as string[])] : dict;

	async function backtrack(
		patternIndex: number,
		currentVars: Record<string, string>,
		currentWords: string[]
	) {
		if (abortSignal?.aborted) return;
		if (results.length >= 200) return; // limit results for performance
		if (patternIndex === patterns.length) {
			let assignmentStr = Object.entries(currentVars)
				.map(([k, v]) => `${k}=${v}`)
				.join(', ');
			results.push(`${currentWords.join(' ; ')} (${assignmentStr})`);
			if (progressObj) progressObj.count = results.length;
			return;
		}

		let p = patterns[patternIndex];
		let pSplitted = tokenizeQuery(p);
		let hasUnbound = pSplitted.some((c) => c >= 'A' && c <= 'Z' && currentVars[c] === undefined);
		let hasWildcard = pSplitted.some(
			(c) => c === '*' || c === '.' || c.startsWith('[') || c === '/' || c === '~'
		);

		if (!hasUnbound && !hasWildcard) {
			let constructed = pSplitted.map((c) => (c >= 'A' && c <= 'Z' ? currentVars[c] : c)).join('');
			let isValid = dictSet.has(constructed) || (includeWiki && wikiSet!.has(constructed));
			if (isValid) {
				currentWords.push(constructed);
				await backtrack(patternIndex + 1, currentVars, currentWords);
				currentWords.pop();
			}
			return;
		}

		for (let i = 0; i < dictToUse.length; i++) {
			if (abortSignal?.aborted) return;
			if (i % 5000 === 0) await new Promise((r) => setTimeout(r, 0));

			let w = dictToUse[i];
			let varsCopy = { ...currentVars };
			if (matchQuery(w, p, [], varsCopy, strict)) {
				currentWords.push(w);
				await backtrack(patternIndex + 1, varsCopy, currentWords);
				currentWords.pop();
			}
			if (results.length >= 200) return;
		}
	}

	await backtrack(0, {}, []);

	return {
		valid: true,
		count: results.length,
		results: results,
		aborted: abortSignal?.aborted || false
	};
}

function matchQuery(
	w: string,
	q: string,
	e: string[],
	vars: Record<string, string> = {},
	strict: boolean = true
): boolean {
	// return if the word has any excluded character
	if (e.some((ec) => w.includes(ec))) return false;

	if (q.includes(':')) {
		q = q.slice(q.indexOf(':') + 1);
		if (q === '') return true;
	} else if (q.match(/^\d+(-\d*)?$/)) {
		return true;
	}

	const wordSplitted = splitWord(w);
	let querySplitted = tokenizeQuery(q);

	const checkMatch = (wCell: string, qCell: string) => {
		if (!wCell) return false;
		return strict ? wCell === qCell : wCell.startsWith(qCell);
	};

	let mode = { anagram: false, subset: false };
	const numWilds = querySplitted.reduce((prev, letter) => prev + (letter === '.' ? 1 : 0), 0);
	const numFillers = querySplitted.reduce((prev, letter) => prev + (letter === '*' ? 1 : 0), 0);

	if (querySplitted[0] === '/') mode.anagram = true;
	if (q.includes('{')) mode.subset = true;

	// Type 1: Anagram
	if (mode.anagram) {
		querySplitted = tokenizeQuery(removeSymbols(q));

		// first, check if their lenghts match
		if (numFillers == 0 && wordSplitted.length != querySplitted.length + numWilds) return false;
		if (numFillers > 0 && wordSplitted.length < querySplitted.length + numWilds) return false;

		let numMatches = 0;
		for (let qIndex = 0; qIndex < querySplitted.length; qIndex++) {
			const qToken = querySplitted[qIndex];
			for (let wIndex = 0; wIndex < wordSplitted.length; wIndex++) {
				if (wordSplitted[wIndex]) {
					const isMatched =
						qToken.startsWith('[') && qToken.endsWith(']')
							? matchCharClass(wordSplitted[wIndex], qToken, strict)
							: checkMatch(wordSplitted[wIndex], qToken);
					if (isMatched) {
						wordSplitted[wIndex] = '';
						numMatches++;
						break;
					}
				}
			}
		}

		// return if not all query letters match
		if (numMatches < querySplitted.length) return false;
		return true;
	}

	// Type 2: Subset
	// {abc} check if every letter in the word is in the set
	// {abc}+3 means up to 3 letters can be outside the subset
	if (mode.subset) {
		let subsetStart = q.indexOf('{');
		let subsetEnd = q.indexOf('}');
		if (subsetStart < 0 || subsetEnd < 0 || subsetEnd <= subsetStart) return false;
		let subset = splitWord(q.slice(subsetStart + 1, subsetEnd));
		let extra = q.slice(q.indexOf('}') + 1);
		let allowedExtra = 0;
		if (extra.length > 0 && extra[0] === '+') allowedExtra = parseInt(extra.slice(1)) || 0;
		let numOutside = 0;
		for (let wIndex = 0; wIndex < wordSplitted.length; wIndex++)
			if (!subset.some((s) => checkMatch(wordSplitted[wIndex], s))) numOutside++;
		if (numOutside > allowedExtra) return false;
		return true;
	}

	// Type 3: No anagram or subset - normal matching
	if (!mode.anagram) {
		let qIndex = 0,
			wIndex = 0;
		while (qIndex < querySplitted.length && wIndex < wordSplitted.length) {
			const qToken = querySplitted[qIndex];
			if (qToken === '*') {
				qIndex++;
				// if * was the last character, it's done!
				if (qIndex == querySplitted.length) return true;
				// otherwise, find the next matching character and recursively check the rest
				while (wIndex < wordSplitted.length) {
					const nextToken = querySplitted[qIndex];
					const wildMatch =
						nextToken === '.' ||
						(nextToken.startsWith('[') &&
							nextToken.endsWith(']') &&
							matchCharClass(wordSplitted[wIndex], nextToken, strict));
					if (wildMatch || checkMatch(wordSplitted[wIndex], nextToken))
						if (
							matchQuery(
								wordSplitted.slice(wIndex).join(''),
								querySplitted.slice(qIndex).join(''),
								e,
								vars,
								strict
							)
						)
							return true;
					wIndex++;
				}
				if (wIndex >= wordSplitted.length) return false;
			} else if (qToken.startsWith('[') && qToken.endsWith(']')) {
				if (matchCharClass(wordSplitted[wIndex], qToken, strict)) {
					qIndex++;
					wIndex++;
				} else {
					return false;
				}
			}
			// letter: must match
			// wild: increment
			else if (qToken === '.' || checkMatch(wordSplitted[wIndex], qToken)) {
				qIndex++;
				wIndex++;
			}
			// Variable A-Z or ~A-Z
			else if (
				(qToken >= 'A' && qToken <= 'Z') ||
				(qToken.startsWith('~') && qToken.length === 2 && qToken[1] >= 'A' && qToken[1] <= 'Z')
			) {
				let isReversed = qToken.startsWith('~');
				let token = isReversed ? qToken.slice(1) : qToken;

				if (vars[token]) {
					let boundSplitted = splitWord(vars[token]);
					if (isReversed) boundSplitted = [...boundSplitted].reverse();
					let match = true;
					for (let i = 0; i < boundSplitted.length; i++) {
						if (
							wIndex + i >= wordSplitted.length ||
							!checkMatch(wordSplitted[wIndex + i], boundSplitted[i])
						) {
							match = false;
							break;
						}
					}
					if (match) {
						if (
							matchQuery(
								wordSplitted.slice(wIndex + boundSplitted.length).join(''),
								querySplitted.slice(qIndex + 1).join(''),
								e,
								vars,
								strict
							)
						) {
							return true;
						}
					}
					return false; // Backtracking is handled by varsCopy in the caller
				} else {
					// Unbound. Try all lengths
					for (let len = 1; len <= wordSplitted.length - wIndex; len++) {
						let candidateArr = wordSplitted.slice(wIndex, wIndex + len);
						let candidate = isReversed
							? [...candidateArr].reverse().join('')
							: candidateArr.join('');
						vars[token] = candidate;
						if (
							matchQuery(
								wordSplitted.slice(wIndex + len).join(''),
								querySplitted.slice(qIndex + 1).join(''),
								e,
								vars,
								strict
							)
						) {
							return true;
						}
						delete vars[token];
					}
					return false;
				}
			} else return false;
		}

		//special case: * is at the end of query string
		// w = ABC
		// q = ABC*
		// here, w finishes earlier, but it should be matched to q
		if (
			wIndex == wordSplitted.length &&
			qIndex == querySplitted.length - 1 &&
			querySplitted[qIndex] === '*'
		)
			return true;
		if (qIndex < querySplitted.length || wIndex < wordSplitted.length) return false;
	}
	return true;
}
