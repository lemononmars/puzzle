import { getThaiWordSets } from '#lib/server/thai-word-sets.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url, setHeaders }) => {
	setHeaders({
		'cache-control': 'private, no-store',
		'x-robots-tag': 'noindex, nofollow, noarchive'
	});
	const query = (url.searchParams.get('q') ?? '').trim();
	const generated = getThaiWordSets();
	const rule =
		Math.min(generated.sets.length, Math.max(1, Number(url.searchParams.get('rule')) || 1)) | 0;
	const matches = generated.sets[rule - 1].filter(
		(set) => !query || set.words.some((word) => word.includes(query))
	);
	const pages = Math.max(1, Math.ceil(matches.length / 100));
	const page = Math.min(pages, Math.max(1, Number(url.searchParams.get('page')) || 1)) | 0;
	return {
		rule,
		query,
		rows: matches.slice((page - 1) * 100, page * 100),
		counts: generated.sets.map((sets) => sets.length),
		total: matches.length,
		page,
		pages,
		dictionarySize: generated.dictionarySize
	};
};
