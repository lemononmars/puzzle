import type { Die, Direction, Kind, State } from './devilDice.js';

export type TutorialStep = Direction | { wait: number } | { direction: Direction; transfer: true };
export type Tutorial = {
	id: string;
	set: string;
	title: string;
	lesson: string;
	hint: string;
	maxMoves?: number;
	solution: TutorialStep[];
	state: Pick<
		State,
		'width' | 'height' | 'player' | 'dice' | 'sinkDuration' | 'removedTiles' | 'iceMatchStops'
	>;
};
export const tutorialSets = [
	{
		id: 'A',
		title: 'Basic pushing',
		description: 'Move without changing the top. Build groups and learn Happy One.'
	},
	{
		id: 'B',
		title: 'Dice riding',
		description: 'Read side faces, roll, and move between dice and ground.'
	},
	{ id: 'C', title: 'Wood', description: 'Every push turns a face. Plan the next roll.' },
	{ id: 'D', title: 'Ice', description: 'Use edges, stoppers, and momentum transfers.' },
	{ id: 'E', title: 'Stone & metal', description: 'Ride stone, cross metal, and clear fixed dice.' }
];
export function makeDie(
	id: number,
	x: number,
	y: number,
	top = 2,
	kind: Kind = 'normal',
	east = top === 3 || top === 4 ? 1 : 3,
	north?: number
): Die {
	return {
		id,
		x,
		y,
		top,
		kind,
		east,
		north: north ?? [1, 2, 3, 4, 5, 6].find((n) => ![top, 7 - top, east, 7 - east].includes(n))!
	};
}
const d = (x: number, y: number, top = 2, kind: Kind = 'normal', north?: number, east?: number) =>
	makeDie(0, x, y, top, kind, east, north);
const path = (text: string): TutorialStep[] =>
	[...text].map((c) => ({ U: 'up', D: 'down', L: 'left', R: 'right' })[c] as Direction);
const wait = { wait: 3000 };
const climb = { direction: 'right', transfer: true } as const;
const moveBudgets: Record<string, number> = {
	A1: 1,
	A2: 2,
	A3: 2,
	A4: 4,
	A5: 2,
	B1: 1,
	B2: 2,
	B3: 3,
	B4: 2,
	B5: 2,
	C1: 1,
	C2: 2,
	C3: 2,
	C4: 3,
	C5: 3,
	D1: 3,
	D2: 5,
	D3: 4,
	D4: 4,
	D5: 6,
	E1: 1,
	E2: 1,
	E3: 2,
	E4: 3,
	E5: 3
};
function level(
	id: string,
	title: string,
	lesson: string,
	hint: string,
	width: number,
	height: number,
	player: State['player'],
	dice: Die[],
	solution: TutorialStep[],
	maxMoves = moveBudgets[id],
	removedTiles?: State['removedTiles']
): Tutorial {
	return {
		id,
		set: id[0],
		title,
		lesson,
		hint,
		maxMoves,
		solution,
		state: {
			width,
			height,
			removedTiles,
			player,
			dice: dice.map((die, i) => ({ ...die, id: i + 1 })),
			sinkDuration: 6000
		}
	};
}
const ground = (x: number, y: number) => ({ x, y, riding: false });
const ride = (x: number, y: number) => ({ x, y, riding: true });

export const puzzles: Tutorial[] = [
	level(
		'A1',
		'A gentle push',
		'Push a 2 beside another 2. Ground pushes preserve the face.',
		'Walk right twice.',
		5,
		4,
		ground(0, 2),
		[d(2, 2), d(4, 2)],
		path('RR')
	),
	level(
		'A2',
		'One more for the chain',
		'Three 2s, two pushes. Add the third while the first pair sinks.',
		'Push the upper 2 down. Walk around the outside, then push the right-hand 2 left into the sinking pair.',
		5,
		5,
		ground(1, 0),
		[d(1, 1), d(1, 3), d(3, 3)],
		path('DURRRDDDL'),
		2
	),
	level(
		'A3',
		'Cross the sinking bridge',
		'Cross the first pair before it disappears, then push the last 2 back into the chain.',
		'Push right. Wait briefly, hold right to climb, cross right, then hold right to drop. Down, right, right, up, left joins the final 2.',
		7,
		2,
		ground(0, 0),
		[d(1, 0), d(3, 0), d(5, 0)],
		[...path('R'), { wait: 1500 }, climb, ...path('R'), climb, ...path('DRRUL')],
		2,
		[0, 1, 2, 3].map((x) => ({ x, y: 1 }))
	),
	level(
		'A4',
		'Make room for the second pair',
		'Clear one pair, wait for the space, then bring the second pair together.',
		'Up, right matches the first pair. Wait for it to disappear, then left, down, down, right, right, right pushes the lower 2 beside the far 2.',
		5,
		3,
		ground(0, 1),
		[d(1, 0), d(2, 1), d(4, 1), d(1, 2)],
		[...path('UR'), { wait: 6500 }, ...path('LDDRRR')],
		4
	),
	level(
		'A5',
		'Happy One',
		'First make a pair. Then push a 1 beside the sinking dice to clear every 1.',
		'Right twice makes the pair. Up three times, right, down pushes the 1 into it.',
		5,
		5,
		ground(0, 3),
		[d(2, 3), d(4, 3), d(3, 1, 1), d(4, 0, 1), d(0, 0, 1)],
		path('RRUUURD')
	),

	level(
		'B1',
		'A different face',
		'Ride a die to roll it. Bring a 2 beside the waiting 2.',
		'Roll right. Your west face (2) becomes the top.',
		5,
		4,
		ride(1, 2),
		[d(1, 2, 3, 'normal', 1, 5), d(3, 2)],
		path('R')
	),
	level(
		'B2',
		'A step closer',
		'The dice start side by side. Walk across, then roll your neighbor into a match.',
		'Right walks onto the adjacent die. Up, left rolls it back beside the first as a 2.',
		5,
		4,
		ride(1, 2),
		[d(1, 2), d(2, 2, 3, 'normal', 1, 2)],
		path('RUL')
	),
	level(
		'B3',
		'A little maneuver',
		'Three 3s need a plan. Turn around the corner to reveal a 3.',
		'Up, right, up. Read the side faces before each turn.',
		5,
		5,
		ride(1, 3),
		[d(1, 3, 4, 'normal', 1, 2), d(3, 1, 3), d(3, 0, 3)],
		path('URU')
	),
	level(
		'B4',
		'Ride, drop, push',
		'Roll to match two 2s. Drop to the ground, then push the third into the chain.',
		'Right; wait until half-sunk. Hold down to drop, release, then down, down, right, up.',
		5,
		6,
		ride(1, 2),
		[d(1, 2, 3, 'normal', 1, 5), d(3, 2), d(3, 4)],
		[...path('R'), wait, { direction: 'down', transfer: true }, ...path('DDRU')]
	),
	level(
		'B5',
		'Push, climb, roll',
		'Push to make a pair, climb onto it, then ride the third die into the chain.',
		'Right twice; wait until half-sunk. Hold right to climb, release, then right, up, left.',
		6,
		4,
		ground(0, 2),
		[d(2, 2), d(4, 2), d(4, 1, 3, 'normal', 1, 2)],
		[...path('RR'), wait, climb, ...path('RUL')]
	),

	level(
		'C1',
		'Wood turns',
		'A wood die rolls when pushed from the ground, too.',
		'Push right. The side marked 2 becomes the top.',
		5,
		4,
		ground(0, 2),
		[d(1, 2, 3, 'wood', 1, 5), d(3, 2, 2, 'wood')],
		path('R')
	),
	level(
		'C2',
		'Two quarter-turns',
		'Two pushes turn a wood die over. Plan for the bottom face.',
		'Push right twice: 5 becomes 4, then 2.',
		6,
		4,
		ground(0, 2),
		[d(1, 2, 5, 'wood', 1, 3), d(4, 2, 2, 'wood')],
		path('RR')
	),
	level(
		'C3',
		'Turn the grain',
		'Change your pushing direction to reveal a different face.',
		'Right, down, right, up. The last push brings the south face (2) on top.',
		5,
		4,
		ground(1, 2),
		[d(2, 2, 3, 'wood', 5, 1), d(4, 1, 2, 'wood')],
		path('RDRU')
	),
	level(
		'C4',
		'A wooden trio',
		'Maneuver one wood die into a group of three 3s.',
		'Right, down, right, up, up. The final top is 3.',
		5,
		5,
		ground(1, 3),
		[d(2, 3, 2, 'wood', 1, 3), d(4, 0, 3, 'wood'), d(4, 1, 3, 'wood')],
		path('RDRUU')
	),
	level(
		'C5',
		'A wooden chain',
		'Make the pair, then walk around and roll the last wood die into its sinking group.',
		'Right; down, left, left, up, up; then right twice.',
		5,
		5,
		ground(1, 2),
		[d(2, 2, 3, 'wood', 1, 5), d(4, 2, 2, 'wood'), d(1, 1, 5, 'wood', 1, 3)],
		path('RDLLUURR')
	),

	level(
		'D1',
		'Across the ice',
		'Ice keeps sliding until the edge or another die stops it.',
		'Push right once. The far 2 stops the slide.',
		6,
		4,
		ground(0, 2),
		[d(1, 2, 2, 'ice'), d(5, 2)],
		path('R')
	),
	level(
		'D2',
		'Use the edge',
		'An edge can park an ice die so you can push it from a new side.',
		'Right, up, right four times, down. The last slide stops beside the other 2.',
		6,
		5,
		ground(0, 1),
		[d(1, 1, 2, 'ice'), d(5, 3)],
		path('RURRRRD')
	),
	level(
		'D3',
		'Pass the motion',
		'When ice hits ice, the next ice die slides instead. Clear the 3s, then the 2s.',
		'Right transfers motion. Then down, right, up pushes the parked 2.',
		6,
		5,
		ground(0, 2),
		[d(1, 2, 2, 'ice'), d(3, 2, 3, 'ice'), d(5, 1, 3), d(5, 0, 3), d(2, 0)],
		path('RDRU')
	),
	level(
		'D4',
		'A sliding chain',
		'Use two long slides to add a third 2 to a sinking pair.',
		'Right, up, right. Ice preserves the number throughout each slide.',
		6,
		4,
		ground(1, 2),
		[d(2, 2, 2, 'ice'), d(5, 2), d(3, 1, 2, 'ice')],
		path('RUR')
	),
	level(
		'D5',
		'Relay around a corner',
		'Transfer motion, then route the parked die around the far corner.',
		'Right, down, right, up; right, up, up, left.',
		6,
		5,
		ground(0, 2),
		[d(1, 2, 2, 'ice'), d(3, 2, 3, 'ice'), d(5, 1, 3), d(5, 0, 3), d(0, 0)],
		path('RDRURUUL')
	),

	level(
		'E1',
		'Fixed partners',
		'Stone cannot be pushed; metal cannot move at all. Both can still match.',
		'Push right twice to join the stone and metal 3s.',
		5,
		4,
		ground(0, 2),
		[d(2, 2, 3), d(4, 2, 3, 'stone'), d(4, 1, 3, 'metal')],
		path('RR')
	),
	level(
		'E2',
		'Stone can roll',
		'A stone die will roll when you ride it, even though ground pushes fail.',
		'Ride right to turn the stone 2 face upward.',
		5,
		4,
		ride(1, 2),
		[d(1, 2, 3, 'stone', 1, 5), d(3, 2, 2, 'stone')],
		path('R')
	),
	level(
		'E3',
		'A metal bridge',
		'Cross metal, roll stone into a match, then drop and push a 1 to clear the metal ones.',
		'Right, right, down. Wait halfway; hold up to drop, release, then up, left, left, down.',
		5,
		5,
		ride(1, 2),
		[d(1, 2, 1), d(2, 2, 1, 'metal'), d(3, 2, 3, 'stone', 2, 1), d(2, 3)],
		[...path('RRD'), wait, { direction: 'up', transfer: true }, ...path('ULLD')]
	),
	level(
		'E4',
		'Stone on the move',
		'Roll a stone 3 around a corner to meet stone and metal partners.',
		'Up, right, up. The stationary metal die is part of the final group.',
		5,
		5,
		ride(1, 3),
		[d(1, 3, 4, 'stone', 1, 2), d(3, 1, 3, 'stone'), d(3, 0, 3, 'metal')],
		path('URU')
	),
	level(
		'E5',
		'The final stepping stone',
		'Push, climb and ride stone. Then drop and push a 1 beside the sinking group.',
		'Right twice; wait halfway and hold right to climb. Release; right, up, left. Wait halfway again; hold left to drop. Release; left, up, right pushes the 1.',
		6,
		4,
		ground(0, 2),
		[d(2, 2), d(4, 2, 2, 'stone'), d(4, 1, 3, 'stone', 1, 2), d(2, 0, 1), d(0, 0, 1, 'metal')],
		[
			...path('RR'),
			wait,
			climb,
			...path('RUL'),
			wait,
			{ direction: 'left', transfer: true },
			...path('LUR')
		]
	)
];
