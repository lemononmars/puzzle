import { describe, it, expect, vi, afterEach } from 'vitest';
import { todayDateThaiString, dateToThaiString } from './date.js';

describe('Date Utilities', () => {
	describe('dateToThaiString', () => {
		it('converts date correctly with Thai Buddhist Era formatting', () => {
			expect(dateToThaiString('2023-01-01T12:00:00Z')).toBe('1 มกราคม 2566');
		});
	});

	describe('todayDateThaiString', () => {
		afterEach(() => {
			vi.restoreAllMocks();
		});

		it('handles Bangkok date boundary correctly', () => {
			vi.spyOn(Date, 'now').mockReturnValue(new Date('2023-01-01T20:00:00Z').getTime());
			expect(todayDateThaiString()).toBe('2 มกราคม 2566');
		});

		it('handles leap year', () => {
			vi.spyOn(Date, 'now').mockReturnValue(new Date('2024-02-28T20:00:00Z').getTime());
			expect(todayDateThaiString()).toBe('29 กุมภาพันธ์ 2567');
		});

	});
});
