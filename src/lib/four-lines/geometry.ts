export type Point = { x: number; y: number };
type Target = {
	id: string;
	value: number;
	box: [number, number, number, number];
	alternativeOf?: string;
};

// Coordinates are in the original 960 × 960 artwork. Keep small Thai marks
// separate from their surrounding letters; the instruction text is puzzle material.
export const ARTWORK_OFFSET_Y = 110;
export const progressMarkers = Array.from({ length: 10 }, (_, index) => ({
	value: index + 1,
	x: 47 + index * 96,
	y: 40
}));

const artworkTargets: Target[] = [
	{ id: 'one', value: 1, box: [278, 190, 322, 271] },
	{ id: 'two', value: 2, box: [57, 258, 112, 337] },
	{ id: 'three', value: 3, box: [94, 465, 149, 546] },
	{ id: 'four', value: 4, box: [470, 84, 532, 164] },
	{ id: 'five', value: 5, box: [488, 289, 543, 368] },
	{ id: 'six', value: 6, box: [676, 41, 733, 123] },
	{ id: 'seven', value: 7, box: [746, 255, 798, 335] },
	{ id: 'eight', value: 8, box: [804, 452, 859, 533] },
	{ id: 'nine', value: 9, box: [266, 450, 320, 531] },
	{ id: 'ten', value: 10, box: [560, 468, 686, 548] },
	{ id: 'ten-one', value: 1, box: [560, 468, 602, 548], alternativeOf: 'ten' },
	{ id: 'text-one', value: 1, box: [724, 615, 737, 649] },
	{ id: 'text-ten', value: 10, box: [851, 615, 902, 649] },
	{ id: 'text-ten-one', value: 1, box: [851, 615, 866, 649], alternativeOf: 'text-ten' },
	{ id: 'text-four', value: 4, box: [168, 793, 193, 826] },
	{ id: 'thai-five', value: 5, box: [399, 778, 460, 826] },
	// Only the base หก in หัก is six; the upper vowel is not part of it.
	{ id: 'thai-six', value: 6, box: [500, 793, 560, 827] },
	{ id: 'thai-seven', value: 7, box: [698, 680, 722, 699] },
	{ id: 'thai-eight', value: 8, box: [502, 594, 524, 611] }
];

export const targets: Target[] = [
	// Progress has a 24px top margin, matching the artwork's bottom margin.
	{ id: 'progress-one', value: 1, box: [40, 28, 54, 52] },
	...artworkTargets.map((target) => ({
		...target,
		box: [
			target.box[0],
			target.box[1] + ARTWORK_OFFSET_Y,
			target.box[2],
			target.box[3] + ARTWORK_OFFSET_Y
		] as Target['box']
	}))
];

function intersection(a: Point, b: Point, box: Target['box']): [number, number] | null {
	let enter = 0,
		exit = 1;
	for (const [origin, delta, low, high] of [
		[a.x, b.x - a.x, box[0], box[2]],
		[a.y, b.y - a.y, box[1], box[3]]
	]) {
		if (Math.abs(delta) < 1e-9) {
			if (origin < low || origin > high) return null;
		} else {
			const t1 = (low - origin) / delta,
				t2 = (high - origin) / delta;
			enter = Math.max(enter, Math.min(t1, t2));
			exit = Math.min(exit, Math.max(t1, t2));
			if (enter > exit) return null;
		}
	}
	return [enter, exit];
}

export function inspectPath(points: Point[]) {
	const crossings: { id: string; value: number; distance: number; end: number; point: Point }[] =
		[];
	let total = 0;
	for (let i = 1; i < points.length; i++) {
		const a = points[i - 1],
			b = points[i];
		const length = Math.hypot(b.x - a.x, b.y - a.y);
		if (length < 1e-6) continue;
		for (const target of targets) {
			const range = intersection(a, b, target.box);
			if (!range) continue;
			const [t, end] = range;
			const distance = total + t * length;
			const previous = crossings.findLast((hit) => hit.id === target.id);
			// A turn inside a glyph is still one crossing, not two numbers.
			if (previous && Math.abs(previous.end - distance) < 1e-5) {
				previous.end = total + end * length;
				continue;
			}
			crossings.push({
				id: target.id,
				value: target.value,
				distance,
				end: total + end * length,
				point: { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
			});
		}
		total += length;
	}
	crossings.sort((a, b) => a.distance - b.distance);
	const hits: typeof crossings = [];
	const orderedHits: typeof crossings = [];
	const consumed = new Set<(typeof crossings)[number]>();
	for (const crossing of crossings) {
		if (consumed.has(crossing)) continue;
		const definition = targets.find((target) => target.id === crossing.id)!;
		const parentId = definition.alternativeOf ?? definition.id;
		const alternatives = crossings.filter((other) => {
			const target = targets.find((target) => target.id === other.id)!;
			return (
				(target.alternativeOf ?? target.id) === parentId &&
				other.distance <= crossing.end + 1e-5 &&
				other.end >= crossing.distance - 1e-5
			);
		});
		// A crossing of “10” can mean either the whole 10 or its 1, never both.
		// Choose the reading matching the next required number. Keep all crossings
		// for inspection, but only reveal the next expected value during playback.
		const chosen = alternatives.find((hit) => hit.value === orderedHits.length + 1) ?? crossing;
		for (const alternative of alternatives) consumed.add(alternative);
		hits.push(chosen);
		if (chosen.value === orderedHits.length + 1) orderedHits.push(chosen);
	}
	return {
		hits,
		orderedHits,
		total,
		valid: points.length === 5 && orderedHits.length === 10
	};
}

export function pointAtDistance(points: Point[], distance: number): Point {
	for (let i = 1; i < points.length; i++) {
		const a = points[i - 1],
			b = points[i];
		const length = Math.hypot(b.x - a.x, b.y - a.y);
		if (length > 0 && distance <= length) {
			const t = Math.max(0, distance / length);
			return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
		}
		distance -= length;
	}
	return points.at(-1) ?? { x: 0, y: 0 };
}
