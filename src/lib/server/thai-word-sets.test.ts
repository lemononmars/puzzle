import { describe, expect, it } from 'vitest';
import { findThaiWordSets, getThaiWordSets } from './thai-word-sets';
import { splitWord } from '#lib/utils/thai-text.js';

describe('Thai dictionary word sets', () => {
	it('finds plain reversals once, preserving marks and excluding palindromes and missing words', () => {
		const { sets } = findThaiWordSets(['ก่ขุค', 'คขุก่', 'ก่ขุค', 'กขก', 'กราม', 'ก', 'การมา']);
		expect(sets[8]).toEqual([{ words: ['ก่ขุค', 'คขุก่'] }]);
	});
	it('lists rotations separately, deduplicating repeated cuts and preserving Thai marks', () => {
		const { sets } = findThaiWordSets([
			'กราม',
			'มกรา',
			'รกาม',
			'ก่ขค',
			'ขคก่',
			'กขกข',
			'ขกขก',
			'กก'
		]);
		expect(sets[7]).toContainEqual({ words: ['กราม', 'มกรา'] });
		expect(sets[0]).not.toContainEqual({ words: ['กราม', 'มกรา'] });
		expect(sets[0]).not.toContainEqual({ words: ['กราม', 'รกาม'] });
		expect(sets[7]).not.toContainEqual({ words: ['กราม', 'รกาม'] });
		expect(sets[7]).toContainEqual({ words: ['ก่ขค', 'ขคก่'] });
		expect(sets[7].filter((set) => set.words.join('|') === 'กขกข|ขกขก')).toHaveLength(1);
		expect(sets[7].some((set) => set.words[0] === set.words[1])).toBe(false);
	});
	it('adds one tile strictly inside a word, preserving marks and deduplicating repeated cuts', () => {
		const { sets } = findThaiWordSets(['กม', 'กรม', 'ก่ม', 'ก่รุม', 'กกก', 'กกกก', 'กมร', 'มกม']);
		expect(sets[1]).toContainEqual({ words: ['กม', 'กรม'], added: 'ร' });
		expect(sets[1]).toContainEqual({ words: ['ก่ม', 'ก่รุม'], added: 'รุ' });
		expect(sets[1].filter((set) => set.words.join('|') === 'กกก|กกกก')).toHaveLength(1);
		expect(
			sets[1].some((set) => set.words[0] === 'กม' && ['กมร', 'มกม'].includes(set.words[1]))
		).toBe(false);
	});
	it('removes the การ prefix from the dictionary used by every rule', () => {
		const source = ['การ', 'การมา', 'การกม', 'กม', 'กรม', 'มา', 'รกาม'];
		const result = findThaiWordSets(source);
		expect(result.dictionarySize).toBe(4);
		expect(
			result.sets.flat().every((set) => set.words.every((word) => !word.startsWith('การ')))
		).toBe(true);
		expect(result.sets[1]).toContainEqual({ words: ['กม', 'กรม'], added: 'ร' });
	});
	it('excludes rearrangements of three variable-length blocks while retaining deeper anagrams', () => {
		const { sets } = findThaiWordSets(['กขคงจฉ', 'คงกขจฉ', 'ฉจงคขก', 'ก่ขคง', 'งคขก่']);
		expect(sets[0]).not.toContainEqual({ words: ['กขคงจฉ', 'คงกขจฉ'] });
		expect(sets[0]).toContainEqual({ words: ['กขคงจฉ', 'ฉจงคขก'] });
		expect(sets[0]).toContainEqual({ words: ['ก่ขคง', 'งคขก่'] });
	});
	it('excludes plain rotations from anagrams and direct splits from interleaving', () => {
		const { sets } = findThaiWordSets(['กราม', 'มกรา', 'รกาม', 'กม', 'รา', 'กามา', 'กา', 'มา']);
		expect(sets[0]).not.toContainEqual({ words: ['กราม', 'มกรา'] });
		expect(sets[0]).not.toContainEqual({ words: ['กราม', 'รกาม'] });
		expect(
			sets[2].some(
				(set) =>
					set.words[0] === 'กามา' &&
					set.words.slice(1).includes('กา') &&
					set.words.slice(1).includes('มา')
			)
		).toBe(false);
		expect(sets[2]).toContainEqual({ words: ['กราม', 'กม', 'รา'] });
	});
	it('excludes one-tile words with attached marks except in reverse + one letter', () => {
		const { sets } = findThaiWordSets([
			'ก',
			'ก่',
			'กุ',
			'ก่กุ',
			'กุก่',
			'กุกราม',
			'กราม',
			'กุกรามกุ'
		]);
		for (const [index, rows] of sets.entries()) {
			if (index !== 3)
				expect(rows.every((row) => row.words.every((word) => splitWord(word).length > 1))).toBe(
					true
				);
		}
		expect(sets[3]).toContainEqual({ words: ['ก่', 'ก่กุ'], added: 'กุ' });
	});
	it('preserves multiplicity and finds ordered complements', () => {
		const { sets } = findThaiWordSets([
			'กราม',
			'กม',
			'รา',
			'มกรา',
			'รกาม',
			'ก',
			'ร',
			'า',
			'ม',
			'กก',
			'กกก',
			'กรามกรามกราม',
			'abc'
		]);
		expect(sets[0]).not.toContainEqual({ words: ['กราม', 'รกาม'] });
		expect(sets[0]).not.toContainEqual({ words: ['กราม', 'มกรา'] });
		expect(sets[0]).not.toContainEqual({ words: ['กก', 'กกก'] });
		expect(sets[2]).toContainEqual({ words: ['กราม', 'กม', 'รา'] });
		expect(sets[2].filter((set) => set.words.join('|') === 'กก|ก|ก')).toHaveLength(0);
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
		const { sets } = findThaiWordSets(['กราม', 'กม', 'รา', 'กร', 'าม', 'กกกกกก', 'กกกก', 'กก']);
		expect(sets[4]).toContainEqual({ words: ['กราม', 'กม', 'รา'], insertionAt: 1 });
		expect(sets[4].some((set) => set.words.join('|') === 'กราม|กร|าม')).toBe(false);
		expect(sets[4].filter((set) => set.words.join('|') === 'กกกกกก|กกกก|กก')).toHaveLength(1);
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
		expect(sets[6].filter((set) => set.words[0] === 'กก')).toEqual([]);
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
		expect(
			result.sets.flat().every((set) => set.words.every((word) => !word.startsWith('การ')))
		).toBe(true);
		for (const [index, sets] of result.sets.entries()) {
			if (index !== 3)
				expect(sets.every((set) => set.words.every((word) => splitWord(word).length > 1))).toBe(
					true
				);
		}
		expect(
			result.sets[3].some((set) => set.words.some((word) => splitWord(word).length === 1))
		).toBe(true);
		console.log(
			'Thai word sets:',
			result.dictionarySize,
			result.sets.map((sets) => sets.length)
		);
	}, 120000);
});
