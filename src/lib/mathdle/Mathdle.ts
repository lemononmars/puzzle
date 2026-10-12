import Random from './Random';

export enum CharState {
	Correct = 0,
	OutOfPlace,
	Wrong,
	NotUsed
}

const emojiColors = {
	[CharState.Correct]: '🟩',
	[CharState.OutOfPlace]: '🟨',
	[CharState.Wrong]: '⬛',
	[CharState.NotUsed]: '⬜'
};

const DIFFICULTY_HARD = 2;

export function evaluate(expr: string): number {
	const sanitized = expr.trim();
	if (!/^[0-9\+\-\*\/\(\)\s]+$/.test(sanitized)) {
		throw new Error('Invalid arithmetic expression');
	}
	return Function(`"use strict"; return (${sanitized})`)();
}

export function validateEquation(word: string, solution: string, difficulty: number) {
	const inputSplitted: Array<string | null> = word.split('');
	const forbiddenIndices = word
		.replace(/[\+\-\*\/\=]/g, '')
		.split('')
		.map((c) => parseInt(c) - 1);
	const solutionSplitted: Array<string | null> = solution.split('');

	const output: Array<{ correct: CharState; char: string }> = word
		.split('')
		.map((char) => ({ correct: CharState.Wrong, char }));
	if (difficulty === DIFFICULTY_HARD)
		output.forEach(
			(op, idx) =>
				(op.correct = inputSplitted.includes('' + (idx + 1)) ? CharState.NotUsed : CharState.Wrong)
		);

	let solved = true;
	solutionSplitted.forEach((sChar, idx) => {
		if (sChar !== inputSplitted[idx]) solved = false;
	});
	if (solved) {
		output.forEach((op) => (op.correct = CharState.Correct));
		return output;
	}

	// First Pass: Match exact position
	solutionSplitted.forEach((sChar, idx) => {
		if (difficulty === DIFFICULTY_HARD && forbiddenIndices.includes(idx)) return;
		const char = inputSplitted[idx];
		if (char === sChar) {
			solutionSplitted[idx] = null;
			inputSplitted[idx] = null;
			output[idx].correct = CharState.Correct;
		}
	});

	// Second Pass: Match out-of-place
	solutionSplitted.forEach((_sChar, idx) => {
		if (difficulty === DIFFICULTY_HARD && forbiddenIndices.includes(idx)) return;
		const char = inputSplitted[idx];
		if (!char || !solutionSplitted.includes(char)) return;

		const idx1 = solutionSplitted.indexOf(char);
		solutionSplitted[idx1] = null;
		inputSplitted[idx] = null;
		output[idx].correct = CharState.OutOfPlace;
	});

	return output;
}

export function layout(
	alphabetRows: string[],
	validations: Array<{ correct: CharState; char: string }> = []
): Array<Record<string, CharState>> {
	const layoutRows: Array<Record<string, CharState>> = [];

	alphabetRows.forEach((alphabets) => {
		const layout: Record<string, CharState> = {};

		alphabets.split('').forEach((a) => {
			layout[a] = CharState.NotUsed;
		});

		validations.forEach(({ correct, char }) => {
			char.split('').forEach((c) => {
				if (correct < layout[c]) {
					layout[c] = correct;
				}
			});
		});

		layoutRows.push(layout);
	});

	return layoutRows;
}

export function getShareResults(attempts: Array<Array<{ correct: CharState }>>) {
	return attempts.map((attempt) => {
		return attempt
			.map(({ correct }) => {
				return emojiColors[correct];
			})
			.join('');
	});
}

export function getSolutions(seed: number) {
	let sols = ['', '', ''];
	const symbols = '+-/*'.split('');
	let random = new Random(seed);
	let n1 = 0,
		n2 = 0,
		n3 = 0,
		n4 = 0;

	// Easy
	let s1 = symbols[random.nextInt32([0, 3])];
	n2 = random.nextInt32([1, 10]);
	switch (s1) {
		case '/':
			n1 = n2 * random.nextInt32([2, 9]);
			break;
		case '-':
			n1 = n2 + random.nextInt32([1, 10]);
			break;
		case '*':
			n1 = random.nextInt32([2, 9]);
			break;
		case '+':
			n1 = random.nextInt32([1, 10]);
			break;
	}
	n3 = evaluate(n1 + s1 + n2);
	if (random.nextInt32([0, 1])) sols[0] = '' + n1 + s1 + n2 + '=' + n3;
	else sols[0] = '' + n3 + '=' + n1 + s1 + n2;

	// Medium
	s1 = symbols[random.nextInt32([0, 3])];
	n2 = random.nextInt32([1, 10]);
	switch (s1) {
		case '/':
			n1 = n2 * random.nextInt32([2, 9]);
			break;
		case '-':
			n1 = n2 + random.nextInt32([1, 10]);
			break;
		case '*':
			n1 = random.nextInt32([2, 9]);
			break;
		case '+':
			n1 = random.nextInt32([1, 10]);
			break;
	}

	let left = evaluate(n1 + s1 + n2);

	let s2 = symbols[random.nextInt32([0, 2])];
	n4 = random.nextInt32([1, 10]);
	switch (s2) {
		case '+':
			n3 = left - n4;
			break;
		case '-':
			n3 = left + n4;
			break;
		case '/':
			n3 = left * n4;
			break;
	}
	sols[1] = '' + n1 + s1 + n2 + '=' + n3 + s2 + n4;

	// Hard
	s1 = symbols[random.nextInt32([0, 3])];
	n2 = random.nextInt32([1, 10]);
	switch (s1) {
		case '/':
			n1 = n2 * random.nextInt32([2, 9]);
			break;
		case '-':
			n1 = n2 + random.nextInt32([1, 10]);
			break;
		case '*':
			n1 = random.nextInt32([2, 9]);
			break;
		case '+':
			n1 = random.nextInt32([1, 10]);
			break;
	}

	left = evaluate(n1 + s1 + n2);

	s2 = symbols[random.nextInt32([0, 2])];
	n4 = random.nextInt32([1, 10]);
	switch (s2) {
		case '+':
			n3 = left - n4;
			break;
		case '-':
			n3 = left + n4;
			break;
		case '/':
			n3 = left * n4;
			break;
	}
	sols[2] = '' + n1 + s1 + n2 + '=' + n3 + s2 + n4;

	return sols;
}
