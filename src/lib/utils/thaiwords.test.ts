import { describe, expect, it } from 'vitest';
import { search, splitWord, appendable, isLegal, getSubWords } from './thaiwords';

describe('Thai crossword input', () => {
 it('accepts single Thai letters and marks, rejecting non-Thai and multi-character input', () => {
  for (const letter of ['ก', 'ะ', '์']) expect(isLegal(letter), letter).toBe(true);
  for (const letter of ['', 'กข', 'ก็', 'a', '1', ' ', '.', '๑', '๚']) expect(isLegal(letter), letter).toBe(false);
 });
 it('attaches upper and lower marks to consonants', () => {
  for (const mark of ['ั', 'ิ', '็', 'ุ', 'ู']) expect(appendable('ก', mark), mark).toBeTruthy();
 });
 it('keeps adjacent consonants and middle vowels separate and rejects non-Thai attachments', () => {
  for (const [first, next] of [['ก', 'ก'], ['ก', 'า'], ['ก', 'เ'], ['า', 'ั'], ['A', 'ั'], ['a', 'b'], ['ก', 'a']]) {
   expect(appendable(first, next), first + next).toBeFalsy();
  }
 });
});

describe('Thai word slots', () => {
 it('splits Thai words without separating attached vowels or tone marks', () => {
  expect(splitWord('ทำ')).toEqual(['ท', 'ำ']);
  expect(splitWord('ก็')).toEqual(['ก็']);
  expect(splitWord('น้ำ')).toEqual(['น้', 'ำ']);
  expect(splitWord('สวัสดี')).toEqual(['ส', 'วั', 'ส', 'ดี']);
  expect(splitWord('ประเทศไทย')).toEqual(['ป', 'ร', 'ะ', 'เ', 'ท', 'ศ', 'ไ', 'ท', 'ย']);
 });
 it('retains puzzle placeholders and handles empty input', () => {
  expect(splitWord('ก.ข*ค/')).toEqual(['ก', '.', 'ข', '*', 'ค', '/']);
  expect(splitWord('')).toEqual([]);
 });
});

describe('dictionary-backed word games', () => {
 it('accepts dictionary words and rejects misspellings or missing answers', () => {
  for (const word of ['ก็', 'กก', 'ก๊ก']) expect(search(word), word).toBe(true);
  for (const word of ['', 'not-a-thai-word', 'สวัสดีครับบ']) expect(search(word), word).toBe(false);
 });
 it('finds words using only the supplied letters when repeats are allowed', () => {
  const result = getSubWords('กบง', true);
  expect(result).toEqual(expect.arrayContaining(['กก', 'กง', 'กบ', 'ง', 'งก', 'งง', 'งบ', 'บ', 'บก', 'บง']));
  expect(result.every(word => [...word].every(letter => 'กบง'.includes(letter)))).toBe(true);
 });
 it('excludes repeated letters when repeats are disallowed', () => {
  const result = getSubWords('กบง', false);
  expect(result).toEqual(expect.arrayContaining(['กง', 'กบ', 'ง', 'งก', 'งบ', 'บ', 'บก', 'บง']));
  expect(result.every(word => new Set(word).size === word.length)).toBe(true);
  expect(getSubWords('xyz')).toEqual([]);
 });
});
