import dict from '#lib/utils/dict.js';

import {splitWord,isUpper,isLower,isTall,isMiddle,isLegal,appendable,wordLength,getFirstLetter} from './thai-text.js';
export * from './thai-text.js';
export function search(word: string) {
	return dict.includes(word);
}

export function getSubWords(word: string, allowRepeat = true) {
	const subWords: string[] = [];

	if (allowRepeat)
		for (const w of dict) {
			let match = true;
			for (let i = 0; i < w.length; i++) {
				if (!word.includes(w[i])) {
					match = false;
					break;
				}
			}
			if (match) {
				subWords.push(w);
			}
		}
	else
		for (const w of dict) {
			let match = true;
			for (let i = 0; i < w.length; i++) {
				const l = w[i];
				if (!word.includes(l) || w.indexOf(l) !== i) {
					match = false;
					break;
				}
			}
			if (match) {
				subWords.push(w);
			}
		}

	return subWords;
}
