import { getThaiWordSets } from '#lib/server/thai-word-sets.js';
import { splitWord } from '#lib/utils/thai-text.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url, setHeaders }) => {
	setHeaders({
		'cache-control': 'private, no-store',
		'x-robots-tag': 'noindex, nofollow, noarchive'
	});
	const query = (url.searchParams.get('q') ?? '').trim();
	const lengthParam = (name: string) => {
		const value = Number(url.searchParams.get(name));
		return Number.isSafeInteger(value) && value > 0 ? value : null;
	};
	const minLength = lengthParam('min');
	const maxLength = lengthParam('max');
	const generated = getThaiWordSets();
	const rule =
		Math.min(generated.sets.length, Math.max(1, Number(url.searchParams.get('rule')) || 1)) | 0;
	const lengths = [
		...new Set(generated.sets[rule - 1].map((set) => splitWord(set.words[0]).length))
	].sort((a, b) => a - b);
	const matches = generated.sets[rule - 1].filter((set) => {
		const length = splitWord(set.words[0]).length;
		return (
			(!query || set.words.some((word) => word.includes(query))) &&
			(minLength === null || length >= minLength) &&
			(maxLength === null || length <= maxLength)
		);
	});
	const pages = Math.max(1, Math.ceil(matches.length / 100));
	const page = Math.min(pages, Math.max(1, Number(url.searchParams.get('page')) || 1)) | 0;
	return {
		rule,
		query,
		minLength,
		maxLength,
		lengths,
		rows: matches.slice((page - 1) * 100, page * 100),
		counts: generated.sets.map((sets) => sets.length),
		total: matches.length,
		page,
		pages,
		dictionarySize: generated.dictionarySize
	};
};
