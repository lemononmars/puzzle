export function splitWord(word: string) {
	const alphas = word.split('');
	const out: string[] = [];
	alphas.forEach(function (a) {
		if (a.match(/[ก-ฮ]/) || a.match(/[ใเแโไาำะๆฯฤา]/) || a.match(/[.*/]/)) {
			out.push(a);
		} else {
			out[out.length - 1] += a;
		}
	});
	return out;
}

export function isLegal(a: string) {
	return a.length == 1 && a.match(/[\u0E00-\u0E4C]/) !== null;
}

export function appendable(a: string, b: string) {
	return a.match(consonantRegex) && (b.match(upperLetterRegex) || b.match(lowerLetterRegex));
}

export function isUpper(a: string) {
	return a.match(upperLetterRegex) !== null;
}

export function isLower(a: string) {
	return a.match(lowerLetterRegex) !== null;
}

export function isMiddle(a: string) {
	return a.match(/[ก-ฮ]/) || a.match(/[ใเแโไาำะๆฯฤา]/);
}

export function isTall(a: string) {
	return a === 'ใ' || a === 'ไ' || a === 'โ';
}

export function wordLength(word: string) {
	return word.replace(/[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/g, '').length;
}

export function getFirstLetter(word: string) {
	for (const l of word.split('')) if (l.match(/[ก-ฮ]/)) return l;
	return '';
}

export const consonantRegex = /[\u0E01-\u0E2E]/;
export const upperLetterRegex = /[\u0E31\u0E34-\u0E37\u0E47-\u0E4C`]/;
export const lowerLetterRegex = /[\u0E38-\u0E39]/;
