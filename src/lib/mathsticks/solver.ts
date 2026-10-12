export interface SegmentMap {
	[key: string]: number;
}

// Bitmask for digits (7 segments: a,b,c,d,e,f,g)
export const DIGIT_MASKS: SegmentMap = {
	'0': (1 << 0) | (1 << 1) | (1 << 2) | (1 << 3) | (1 << 4) | (1 << 5), // 63 (6 sticks)
	'1': (1 << 1) | (1 << 2), // 6 (2 sticks)
	'2': (1 << 0) | (1 << 1) | (1 << 3) | (1 << 4) | (1 << 6), // 91 (5 sticks)
	'3': (1 << 0) | (1 << 1) | (1 << 2) | (1 << 3) | (1 << 6), // 79 (5 sticks)
	'4': (1 << 1) | (1 << 2) | (1 << 5) | (1 << 6), // 102 (4 sticks)
	'5': (1 << 0) | (1 << 2) | (1 << 3) | (1 << 5) | (1 << 6), // 109 (5 sticks)
	'6': (1 << 0) | (1 << 2) | (1 << 3) | (1 << 4) | (1 << 5) | (1 << 6), // 125 (6 sticks)
	'7': (1 << 0) | (1 << 1) | (1 << 2), // 7 (3 sticks)
	'8': (1 << 0) | (1 << 1) | (1 << 2) | (1 << 3) | (1 << 4) | (1 << 5) | (1 << 6), // 127 (7 sticks)
	'9': (1 << 0) | (1 << 1) | (1 << 2) | (1 << 3) | (1 << 5) | (1 << 6) // 111 (6 sticks)
};

// Operator bitmask definitions
export const OPERATOR_MASKS: SegmentMap = {
	'-': 1 << 0, // 1 stick (mid-h)
	'+': (1 << 0) | (1 << 1), // 2 sticks (mid-h + mid-v)
	'=': (1 << 2) | (1 << 3) // 2 sticks (top-eq + bot-eq)
};

export function getMaskForToken(token: string): number {
	if (token === '' || token === '?') return 0;
	if (DIGIT_MASKS[token] !== undefined) return DIGIT_MASKS[token];
	if (OPERATOR_MASKS[token] !== undefined) return OPERATOR_MASKS[token];
	return 0;
}

export function countBits(n: number): number {
	let count = 0;
	while (n > 0) {
		count += n & 1;
		n >>= 1;
	}
	return count;
}

export function getSymbolStickCount(token: string): number {
	return countBits(getMaskForToken(token));
}

export function getTotalEquationSticks(equation: string): number {
	return equation.split('').reduce((sum, char) => sum + getSymbolStickCount(char), 0);
}

export function getSymbolTransition(
	fromChar: string,
	toChar: string
): { removed: number; added: number } {
	const maskA = getMaskForToken(fromChar);
	const maskB = getMaskForToken(toChar);
	return {
		removed: countBits(maskA & ~maskB),
		added: countBits(maskB & ~maskA)
	};
}

export function evaluateExpr(expr: string): number | null {
	try {
		const clean = expr.replace(/\s+/g, '');

		// Rule 1: Leading zeros are invalid (e.g. 02, 04, 07 are invalid)
		if (/\b0\d+/.test(clean)) return null;

		if (!/^[0-9\+\-\*\/]+$/.test(clean)) return null;
		const result = Function(`"use strict"; return (${clean})`)();
		return typeof result === 'number' && !isNaN(result) && isFinite(result) ? result : null;
	} catch {
		return null;
	}
}

export interface SolutionResult {
	equation: string;
	moves: number;
	details: string;
}

export function solveMathsticks(equation: string, maxMoves: number = 2): SolutionResult[] {
	const tokens = equation.replace(/\s+/g, '').split('');
	const n = tokens.length;
	const initialStickCount = getTotalEquationSticks(equation);
	const results: SolutionResult[] = [];
	const visited = new Set<string>();

	const candidatesPerToken: string[][] = tokens.map((t) => {
		if (/[0-9]/.test(t) || t === '') {
			return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ''];
		} else if (['-', '+', '='].includes(t)) {
			return ['-', '+', '='];
		} else {
			return [t];
		}
	});

	function search(index: number, currentTokens: string[]) {
		if (index === n) {
			const cand = currentTokens.join('');
			if (cand === tokens.join('') || visited.has(cand)) return;

			// Strict Stick Conservation Check
			const candStickCount = getTotalEquationSticks(cand);
			if (candStickCount !== initialStickCount) return;

			const eqParts = cand.split('=');
			if (eqParts.length !== 2) return;

			const lhs = evaluateExpr(eqParts[0]);
			const rhs = evaluateExpr(eqParts[1]);
			if (lhs === null || rhs === null || lhs !== rhs) return;

			let totalRemoved = 0;
			let totalAdded = 0;

			for (let i = 0; i < n; i++) {
				const trans = getSymbolTransition(tokens[i], currentTokens[i]);
				totalRemoved += trans.removed;
				totalAdded += trans.added;
			}

			if (totalRemoved === totalAdded && totalRemoved >= 1 && totalRemoved <= maxMoves) {
				visited.add(cand);
				results.push({
					equation: cand,
					moves: totalRemoved,
					details: `Move ${totalRemoved} stick${totalRemoved > 1 ? 's' : ''}`
				});
			}
			return;
		}

		for (const candChar of candidatesPerToken[index]) {
			currentTokens.push(candChar);
			search(index + 1, currentTokens);
			currentTokens.pop();
		}
	}

	search(0, []);
	return results.sort((a, b) => a.moves - b.moves);
}
