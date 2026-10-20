export function buildThaiTrie(words: string[]) {
	const root: any = {};
	for (let i = 0; i < words.length; i++) {
		const word = words[i];
		const parts = splitWord(word);
		let curr = root;
		for (let j = 0; j < parts.length; j++) {
			const p = parts[j];
			if (!curr[p]) curr[p] = {};
			curr = curr[p];
		}
		curr.$ = true;
	}
	return root;
}

export interface ParsedCharClass {
	isNegated: boolean;
	ranges: Array<{ start: number; end: number }>;
	exactGraphemes: string[];
}

function isCombiningChar(c: string): boolean {
	const code = c.codePointAt(0)!;
	return (
		code === 0x0e31 || (code >= 0x0e34 && code <= 0x0e3a) || (code >= 0x0e47 && code <= 0x0e4e)
	);
}

export function parseCharClass(classToken: string): ParsedCharClass {
	const inner =
		classToken.startsWith('[') && classToken.endsWith(']') ? classToken.slice(1, -1) : classToken;

	const isNegated = inner.startsWith('^');
	const body = isNegated ? inner.slice(1) : inner;

	const ranges: Array<{ start: number; end: number }> = [];
	const exactGraphemes: string[] = [];

	const chars = Array.from(body);
	let i = 0;

	while (i < chars.length) {
		if (i + 2 < chars.length && chars[i + 1] === '-' && chars[i] !== '-' && chars[i + 2] !== '-') {
			const start = chars[i].codePointAt(0)!;
			const end = chars[i + 2].codePointAt(0)!;
			ranges.push({
				start: Math.min(start, end),
				end: Math.max(start, end)
			});
			i += 3;
		} else {
			let grapheme = chars[i];
			i++;
			while (i < chars.length && chars[i] !== '-' && isCombiningChar(chars[i])) {
				grapheme += chars[i];
				i++;
			}
			exactGraphemes.push(grapheme);
		}
	}

	return { isNegated, ranges, exactGraphemes };
}

export function matchCharClass(wCell: string, classToken: string, strict: boolean): boolean {
	if (!wCell) return false;
	const parsed = parseCharClass(classToken);

	let positiveMatch = false;

	for (const g of parsed.exactGraphemes) {
		if (strict) {
			if (wCell === g) {
				positiveMatch = true;
				break;
			}
		} else {
			if (wCell.startsWith(g) || g.startsWith(wCell)) {
				positiveMatch = true;
				break;
			}
		}
	}

	if (!positiveMatch && parsed.ranges.length > 0) {
		const firstCode = wCell.codePointAt(0)!;
		for (const r of parsed.ranges) {
			if (firstCode >= r.start && firstCode <= r.end) {
				if (strict) {
					if (wCell.length === 1 || (wCell.length === 2 && firstCode >= 0x10000)) {
						positiveMatch = true;
						break;
					}
				} else {
					positiveMatch = true;
					break;
				}
			}
		}
	}

	return parsed.isNegated ? !positiveMatch : positiveMatch;
}

export function tokenizeQuery(query: string): string[] {
	const tokens: string[] = [];
	let i = 0;

	while (i < query.length) {
		const c = query[i];

		if (c === '[') {
			const closeIdx = query.indexOf(']', i + 1);
			if (closeIdx !== -1) {
				tokens.push(query.slice(i, closeIdx + 1));
				i = closeIdx + 1;
				continue;
			}
		}

		if (c === '{') {
			const closeIdx = query.indexOf('}', i + 1);
			if (closeIdx !== -1) {
				let endIdx = closeIdx + 1;
				if (endIdx < query.length && query[endIdx] === '+') {
					endIdx++;
					while (endIdx < query.length && query[endIdx] >= '0' && query[endIdx] <= '9') {
						endIdx++;
					}
				}
				tokens.push(query.slice(i, endIdx));
				i = endIdx;
				continue;
			}
		}

		if (c === '~' && i + 1 < query.length && query[i + 1] >= 'A' && query[i + 1] <= 'Z') {
			tokens.push('~' + query[i + 1]);
			i += 2;
			continue;
		}

		if (c.match(/[A-Zก-ฮ]/) || c.match(/[ใเแโไาำะๆฯฤา]/) || c.match(/[\.\*\/\~]/)) {
			tokens.push(c);
			i++;
		} else if (
			tokens.length > 0 &&
			!tokens[tokens.length - 1].startsWith('[') &&
			!tokens[tokens.length - 1].startsWith('{')
		) {
			tokens[tokens.length - 1] += c;
			i++;
		} else {
			tokens.push(c);
			i++;
		}
	}

	return tokens;
}

export function searchThaiTrie(root: any, pattern: string, strict: boolean) {
	const parts = tokenizeQuery(pattern);
	const results: string[] = [];
	function dfs(node: any, idx: number, currentWord: string) {
		if (idx === parts.length) {
			if (node.$) results.push(currentWord);
			return;
		}
		const p = parts[idx];
		if (p === '.') {
			for (const key in node) {
				if (key === '$') continue;
				dfs(node[key], idx + 1, currentWord + key);
			}
		} else if (p.startsWith('[') && p.endsWith(']')) {
			for (const key in node) {
				if (key === '$') continue;
				if (matchCharClass(key, p, strict)) {
					dfs(node[key], idx + 1, currentWord + key);
				}
			}
		} else {
			if (strict) {
				if (node[p]) dfs(node[p], idx + 1, currentWord + p);
			} else {
				for (const key in node) {
					if (key === '$') continue;
					if (key.startsWith(p)) {
						dfs(node[key], idx + 1, currentWord + key);
					}
				}
			}
		}
	}
	dfs(root, 0, '');
	return results;
}

export function splitWord(word: string) {
	const alphas = word.split('');
	const out: string[] = [];

	alphas.forEach((a) => {
		if (a.match(/[A-Zก-ฮ]/) || a.match(/[ใเแโไาำะๆฯฤา]/) || a.match(/[\.\*\/\[\]\~]/)) {
			out.push(a);
		} else if (out.length > 0) {
			out[out.length - 1] += a;
		} else {
			out.push(a);
		}
	});

	return out;
}

export function wordLength(word: string) {
	return word.replace(/[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/g, '').length;
}

export function getFirstLetter(word: string) {
	for (var l of word.split('')) if (l.match(/[ก-ฮ]/)) return l;
	return '';
}
