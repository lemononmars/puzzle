import { describe, expect, it } from 'vitest';
import { inspectPath, pointAtDistance, targets, ARTWORK_OFFSET_Y } from './geometry';

// 1 in the progress row → 2 → 3 → instruction 4 → Thai 5/6 → Thai 7/8 → 9 → 10.
const solution = [
	{ x: 47, y: 40 },
	{ x: 174, y: 917 },
	{ x: 944, y: 917 },
	{ x: 290, y: 601 },
	{ x: 685, y: 628 }
];

describe('four-line path validation', () => {
	it('locates six on หก rather than the preceding มห and excludes the upper vowel', () => {
		const six = targets.find((target) => target.id === 'thai-six')!;
		expect(six.box).toEqual([500, 793 + ARTWORK_OFFSET_Y, 560, 827 + ARTWORK_OFFSET_Y]);
		expect(
			inspectPath([
				{ x: 470, y: 920 },
				{ x: 495, y: 920 }
			]).hits.some((hit) => hit.id === 'thai-six')
		).toBe(false);
		expect(
			inspectPath([
				{ x: 500, y: 890 },
				{ x: 560, y: 890 }
			]).hits.some((hit) => hit.id === 'thai-six')
		).toBe(false);
	});
	it('counts only the initially visible progress 1, not the other progress circles', () => {
		const result = inspectPath([
			{ x: 20, y: 40 },
			{ x: 940, y: 40 }
		]);
		expect(result.hits.map((hit) => hit.id)).toEqual(['progress-one']);
		expect(result.orderedHits.map((hit) => hit.value)).toEqual([1]);
	});
	it('removes the old corner number targets', () => {
		expect(targets.some((target) => target.id.startsWith('corner-'))).toBe(false);
		expect(
			inspectPath([
				{ x: 25, y: 70 },
				{ x: 120, y: 70 }
			]).hits
		).toEqual([]);
	});
	it('skips an early 3, then reveals 1 and 2 when encountered in order', () => {
		const result = inspectPath([
			{ x: 120, y: 610 },
			{ x: 47, y: 40 },
			{ x: 84, y: 410 },
			{ x: 180, y: 460 },
			{ x: 200, y: 460 }
		]);
		expect(result.hits[0].value).toBe(3);
		expect(result.orderedHits.map((hit) => hit.value)).toEqual([1, 2]);
		expect(result.valid).toBe(false);
	});
	it('produces no reveals for a complete path missing 1', () => {
		const result = inspectPath([
			{ x: 80, y: 400 },
			{ x: 120, y: 610 },
			{ x: 200, y: 610 },
			{ x: 220, y: 660 },
			{ x: 240, y: 660 }
		]);
		expect(result.total).toBeGreaterThan(0);
		expect(result.orderedHits).toEqual([]);
	});
	it.each([
		'one',
		'four',
		'five',
		'six',
		'seven',
		'eight',
		'text-one',
		'text-four',
		'thai-five',
		'thai-six',
		'thai-seven',
		'thai-eight'
	])('counts the %s artwork element', (id) => {
		const target = targets.find((target) => target.id === id)!;
		const [left, top, right, bottom] = target.box;
		const result = inspectPath([
			{ x: left + 1, y: (top + bottom) / 2 },
			{ x: right - 1, y: (top + bottom) / 2 }
		]);
		expect(result.hits.some((hit) => hit.id === id)).toBe(true);
	});
	it.each(['ten-one', 'text-ten-one'])('allows %s as 1 without double-counting 10', (id) => {
		const target = targets.find((target) => target.id === id)!;
		const [left, top, right, bottom] = target.box;
		const result = inspectPath([
			{ x: (left + right) / 2, y: top + 2 },
			{ x: (left + right) / 2, y: bottom - 2 }
		]);
		expect(result.hits.map((hit) => hit.id)).toEqual([id]);
		expect(result.hits[0].value).toBe(1);
	});
	it('accepts the hidden-number solution, including a turn within 9', () => {
		const result = inspectPath(solution);
		expect(result.hits.map((hit) => hit.value)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
		expect(result.valid).toBe(true);
	});
	it('rejects the same lines traversed in reverse', () => {
		expect(inspectPath([...solution].reverse()).valid).toBe(false);
	});
	it('rejects incomplete paths and paths missing the tiny Thai marks', () => {
		expect(inspectPath(solution.slice(0, 4)).valid).toBe(false);
		expect(inspectPath(solution.map((p, i) => (i === 2 ? { ...p, y: 950 } : p))).valid).toBe(false);
	});
	it('rejects a later re-crossing instead of hiding the out-of-order number', () => {
		const path = [...solution.slice(0, 4), { x: 50, y: 65 }];
		expect(inspectPath(path).valid).toBe(false);
	});
	it('moves playback from the first point by distance across segment boundaries', () => {
		expect(pointAtDistance(solution, 0)).toEqual(solution[0]);
		expect(
			pointAtDistance(
				[
					{ x: 0, y: 0 },
					{ x: 10, y: 0 },
					{ x: 10, y: 10 }
				],
				15
			)
		).toEqual({ x: 10, y: 5 });
	});
});
