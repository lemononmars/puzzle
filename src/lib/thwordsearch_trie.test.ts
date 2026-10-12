import { describe, it, expect, beforeEach } from 'vitest';
import { buildThaiTrie, searchThaiTrie, search } from './thwordsearch';

describe('Trie Implementation for Thai Crossword Optimization', () => {

  describe('strict matching', () => {
    const words = ['แมว', 'แม่', 'หมา', 'กิน', 'กบ', 'กำ', 'กาง'];
    let trie: any;

    beforeEach(() => {
      trie = buildThaiTrie(words);
    });

    it('matches exact words', () => {
      expect(searchThaiTrie(trie, 'แมว', true)).toEqual(['แมว']);
      expect(searchThaiTrie(trie, 'กิน', true)).toEqual(['กิน']);
      expect(searchThaiTrie(trie, 'กาง', true)).toEqual(['กาง']);
    });

    it('matches words using wildcards', () => {
      expect(searchThaiTrie(trie, 'แ.ว', true)).toEqual(['แมว']);
      expect(searchThaiTrie(trie, 'แ.', true)).toEqual(['แม่']); // 'แม่' splits to ['แ', 'ม่'] which is 2 parts
      expect(searchThaiTrie(trie, 'ห.า', true)).toEqual(['หมา']);
      expect(searchThaiTrie(trie, 'ก.น', true)).toEqual([]); // 'กิ' is a single part, so it does not match 'ก' and '.'
      expect(searchThaiTrie(trie, 'กิ.', true)).toEqual(['กิน']);
      expect(searchThaiTrie(trie, 'ก.', true)).toEqual(['กบ', 'กำ']);
    });

    it('returns empty array when there are no matches', () => {
      expect(searchThaiTrie(trie, 'นก', true)).toEqual([]);
      expect(searchThaiTrie(trie, 'ห..', true)).toEqual(['หมา']);
      expect(searchThaiTrie(trie, 'ห...', true)).toEqual([]);
    });
    it('matches words using character classes [ ] with ranges and negations', () => {
      expect(searchThaiTrie(trie, 'แ[ม-ร]ว', true)).toEqual(['แมว']);
      expect(searchThaiTrie(trie, 'แ[ก-ค]ว', true)).toEqual([]);
      expect(searchThaiTrie(trie, 'แ[^ก-ค]ว', true)).toEqual(['แมว']);
      expect(searchThaiTrie(trie, 'แ[^ม]ว', true)).toEqual([]);
      expect(searchThaiTrie(trie, '[ก-ค]..', true)).toEqual(['กาง']);
      expect(searchThaiTrie(trie, 'ก[บำ]', true)).toEqual(['กบ', 'กำ']);
      expect(searchThaiTrie(trie, 'ก[^บ]', true)).toEqual(['กำ']);
    });
  });

  describe('loose matching', () => {
    const words = ['แมว', 'แม่', 'หมา', 'กิน', 'กบ', 'กำ', 'กาง'];
    let trie: any;

    beforeEach(() => {
      trie = buildThaiTrie(words);
    });

    it('matches exact words', () => {
      expect(searchThaiTrie(trie, 'แมว', false)).toEqual(['แมว']);
      expect(searchThaiTrie(trie, 'กิน', false)).toEqual(['กิน']);
    });

    it('matches using wildcards with loose prefixes', () => {
      // 'ก.' loosely matches 'กบ', 'กำ' and 'กิน'
      // because 'กิ' starts with 'ก', so 'ก' is considered a match for 'กิ',
      // and then '.' matches 'น', thus finding 'กิน'.
      expect(searchThaiTrie(trie, 'ก.', false)).toEqual(expect.arrayContaining(['กบ', 'กำ', 'กิน']));
      expect(searchThaiTrie(trie, 'ก..', false)).toEqual(['กาง']);
    });

    it('matches using character classes with loose prefixes', () => {
      expect(searchThaiTrie(trie, '[ก-ค].', false)).toEqual(expect.arrayContaining(['กบ', 'กำ', 'กิน']));
      expect(searchThaiTrie(trie, '[ก-ค]..', false)).toEqual(['กาง']);
    });
  });

  describe('search() end-to-end character class queries', () => {
    it('supports regexp character class [ ] in search()', async () => {
      const res = await search('[ใไโ]ก.', false);
      expect(res.valid).toBe(true);
      expect(res.results.length).toBeGreaterThan(0);
      expect(res.results).toContain('ใกล้');

      const rangeRes = await search('ส[ก-ฮ]น', false);
      expect(rangeRes.valid).toBe(true);
      expect(rangeRes.results).toContain('สนน');
    });
  });
});
