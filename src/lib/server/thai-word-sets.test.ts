import { describe, expect, it } from 'vitest';
import { findThaiWordSets, getThaiWordSets } from './thai-word-sets';

describe('Thai dictionary word sets', () => {
	it('preserves multiplicity, finds multi-part splits and ordered complements', () => {
		const { sets } = findThaiWordSets([
			'กราม',
			'กม',
			'รา',
			'มากร',
			'ก',
			'ร',
			'า',
			'ม',
			'กก',
			'กกก',
			'abc'
		]);
		expect(sets[0]).toContainEqual({ words: ['กราม', 'มากร'] });
		expect(sets[0]).not.toContainEqual({ words: ['กก', 'กกก'] });
		expect(sets[1]).toContainEqual({ words: ['กราม', 'ก', 'ร', 'า', 'ม'] });
		expect(sets[2]).toContainEqual({ words: ['กราม', 'กม', 'รา'] });
		expect(sets[2].filter((set) => set.words.join('|') === 'กก|ก|ก')).toHaveLength(1);
	});
	it('reverses attached-mark tiles and inserts exactly one tile anywhere', () => {
		const { sets } = findThaiWordSets(['ก่า', 'าก่', 'าก่ม', 'ามก่', 'มาก่', 'ก่าม', 'กา']);
		for (const target of ['าก่ม', 'ามก่', 'มาก่'])
			expect(sets[3]).toContainEqual({ words: ['ก่า', target], added: 'ม' });
		expect(sets[3]).not.toContainEqual({ words: ['ก่า', 'ก่าม'], added: 'ม' });
		expect(sets[0].some((set) => set.words.includes('ก่า') && set.words.includes('กา'))).toBe(
			false
		);
	});
	it('finds strictly internal contiguous insertions and deduplicates positions', () => {
		const { sets } = findThaiWordSets(['กราม', 'กม', 'รา', 'กร', 'าม', 'กกกก', 'กกก', 'ก']);
		expect(sets[4]).toContainEqual({ words: ['กราม', 'กม', 'รา'], insertionAt: 1 });
		expect(sets[4].some((set) => set.words.join('|') === 'กราม|กร|าม')).toBe(false);
		expect(sets[4].filter((set) => set.words.join('|') === 'กกกก|กกก|ก')).toHaveLength(1);
	});
	it('extracts every odd or even tile, preserving combining marks and one-based parity', () => {
		const { sets } = findThaiWordSets(['กราม', 'กา', 'รม', 'ก่ราม', 'ก่า', 'กรามก', 'กาก', 'ก']);
		expect(sets[5]).toContainEqual({ words: ['กราม', 'กา'], parity: 'odd' });
		expect(sets[5]).toContainEqual({ words: ['กราม', 'รม'], parity: 'even' });
		expect(sets[5]).toContainEqual({ words: ['ก่ราม', 'ก่า'], parity: 'odd' });
		expect(sets[5]).toContainEqual({ words: ['กรามก', 'กาก'], parity: 'odd' });
		expect(sets[5].some((set) => set.words[0] === 'ก')).toBe(false);
	});
	it('merges equal-length words or a starting word with exactly one extra tile', () => {
		const { sets } = findThaiWordSets([
			'กราม',
			'กา',
			'รม',
			'กรามก',
			'กาก',
			'ก่ราม',
			'ก่า',
			'กก',
			'ก'
		]);
		expect(sets[6]).toContainEqual({ words: ['กราม', 'กา', 'รม'] });
		expect(sets[6]).toContainEqual({ words: ['กรามก', 'กาก', 'รม'] });
		expect(sets[6]).toContainEqual({ words: ['ก่ราม', 'ก่า', 'รม'] });
		expect(sets[6].filter((set) => set.words[0] === 'กก')).toEqual([{ words: ['กก', 'ก', 'ก'] }]);
	});
	it('rejects arbitrary interleaving and a merge with a longer leftover tail', () => {
		const { sets } = findThaiWordSets(['กราม', 'กม', 'รา', 'กรามม', 'กาม', 'ร', 'ก']);
		expect(sets[2]).toContainEqual({ words: ['กราม', 'กม', 'รา'] });
		expect(sets[6].some((set) => set.words[0] === 'กราม')).toBe(false);
		expect(sets[6].some((set) => set.words[0] === 'กรามม')).toBe(false);
		expect(sets[6].some((set) => set.words[0] === 'ก')).toBe(false);
	});
	it('generates the complete project dictionary and includes the requested example', () => {
		const result = getThaiWordSets();
		expect(result.sets[2]).toContainEqual({ words: ['กราม', 'กม', 'รา'] });
		expect(result.sets.every((sets) => sets.length > 0)).toBe(true);
		console.log(
			'Thai word sets:',
			result.dictionarySize,
			result.sets.map((sets) => sets.length)
		);
	}, 120000);
});
