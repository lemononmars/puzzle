import { afterEach, describe, expect, it, vi } from 'vitest';
import { encode, decode } from './helper';

afterEach(() => vi.restoreAllMocks());

describe('shareable answer encoding', () => {
 it('roundtrips Thai, English, mixed text, spaces, and punctuation in URL-safe strings', () => {
  for (const answer of ['A', 'ก', 'กabC', 'Hello World', 'ปริศนา 123 abc', 'คำตอบ / + ?']) {
   const encoded = encode(answer);
   expect(encoded, answer).toMatch(/^[A-Za-z0-9_-]+$/);
   expect(decode(encoded), answer).toBe(answer);
  }
 });
 it('treats missing input as empty rather than an answer', () => {
  for (const value of [undefined, null, '']) {
   expect(encode(value as string)).toBe('');
   expect(decode(value as string)).toBe('');
  }
 });
 it('rejects corrupted shared answers without throwing', () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  expect(decode('%%')).toBe('');
 });
});
