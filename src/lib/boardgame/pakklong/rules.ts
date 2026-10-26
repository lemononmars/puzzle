import { toolCost } from './constants';
import type { BouquetOrder, FlowerToken, Player } from './types';

type Random = () => number;
export const randomIndex = (size: number, random: Random = Math.random) =>
	Math.floor(random() * size);
export function shuffle<T>(items: T[], random: Random = Math.random): void {
	for (let index = items.length - 1; index > 0; index--) {
		const other = randomIndex(index + 1, random);
		[items[index], items[other]] = [items[other], items[index]];
	}
}
function weightedIndex(weights: number[], random: Random): number {
	let value =
		randomIndex(
			weights.reduce((total, weight) => total + weight, 0),
			random
		) + 1;
	let index = 0;
	while (index < weights.length - 1 && value > weights[index]) {
		value -= weights[index++];
	}
	return index;
}
export function generateStartingFlowerCards(random: Random = Math.random): number[][] {
	const cards = [
		[0, 1, 1, 3, 1, 0],
		[0, 1, 1, 3, 1, 0],
		[1, 0, 1, 3, 1, 0],
		[1, 0, 1, 3, 1, 0],
		[1, 1, 0, 3, 1, 0],
		[1, 1, 0, 3, 1, 0]
	];
	shuffle(cards, random);
	return cards;
}
function flowerToken(random: Random): number[] {
	const types = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2];
	const qualities = [1, 3, 3, 3, 2, 2, 3, 3, 2, 2, 2, 4];
	const index = randomIndex(types.length, random);
	return [types[index], qualities[index]];
}
function flowerCard(random: Random): number[] {
	const cards = [
		[
			[1, 0, 0],
			[0, 1, 0],
			[0, 0, 1]
		],
		[
			[2, 0, 0],
			[0, 2, 0],
			[0, 0, 2],
			[1, 1, 0],
			[1, 0, 1],
			[0, 1, 1]
		],
		[
			[2, 1, 0],
			[2, 0, 1],
			[1, 2, 0],
			[1, 0, 2],
			[0, 2, 1],
			[0, 1, 2],
			[1, 1, 1]
		],
		[
			[2, 2, 0],
			[2, 0, 2],
			[0, 2, 2],
			[2, 1, 1],
			[1, 2, 1],
			[1, 1, 2]
		],
		[
			[2, 2, 1],
			[2, 1, 2],
			[1, 2, 2]
		]
	];
	const choices = cards[weightedIndex([2, 6, 6, 3, 0], random)];
	const card = choices[randomIndex(choices.length, random)];
	const level = weightedIndex([3, 2, 1], random);
	const total = card.reduce((sum, amount) => sum + amount, 0);
	return [...card, Math.ceil(total * 2.5) + level * 3, (total - 1) * 2 + level * 2, level];
}
/** Serialized market payload shared by every player; tool indices always use valid tiers. */
export function generateMarket(
	numPlayers: number,
	random: Random = Math.random
): [number[], number[][], number[][], number[][], number[][], number[]] {
	const coins: number[] = [];
	for (let i = 0; i < numPlayers; i++) {
		const value = randomIndex(6, random);
		if (value < 5) coins.push(Math.floor((value + 1) / 2) + 1);
	}
	coins.sort((a, b) => a - b);
	const tokens = Array.from({ length: numPlayers * 2 }, () => flowerToken(random)).sort(
		(a, b) => a[1] - b[1]
	);
	const flowers = [0, 1, 2].map((type) => tokens.filter((token) => token[0] === type));
	const orders = Array.from({ length: numPlayers }, () => flowerCard(random)).sort(
		(a, b) => a[5] - b[5]
	);
	const tools = toolCost.map((tiers) => randomIndex(tiers.length, random));
	return [coins, flowers[0], flowers[1], flowers[2], orders, tools];
}
export function getBonus(player: Player, bonusIndex: number): number {
	return player.stars[player.bonus[bonusIndex]];
}
export function getMyTimeTokens(player: Player): number[] {
	return [0, 1, 2, 3, 4, 5, 6].filter((value) => value !== player.time);
}
export function checkAchievement(type: number, player: Player | undefined): boolean {
	if (!player) return false;
	const stars = player.stars;
	switch (type) {
		case 0:
		case 1:
		case 2:
			return stars[type] >= 6;
		case 3:
			return stars[0] >= 4 && stars[1] >= 4;
		case 4:
			return stars[0] >= 4 && stars[2] >= 4;
		case 5:
			return stars[1] >= 4 && stars[2] >= 4;
		case 6:
			return stars.every((amount) => amount >= 3);
		case 7:
			return player.numPlayedCards >= 5;
		default:
			return false;
	}
}
export function arrangementError(
	card: BouquetOrder,
	flowers: FlowerToken[],
	ribbons: number,
	bonus: number
): string | undefined {
	const counts = [0, 0, 0];
	const quality = flowers.reduce(
		(total, token) => {
			counts[token.type]++;
			return total + token.quality;
		},
		bonus + ribbons * 2
	);
	if (quality < card.quality) return 'Quality not satisfied';
	if (counts.some((count, type) => count < card.flowers[type]))
		return 'Not enough flowers of some type';
	if (counts.some((count, type) => count > card.flowers[type]))
		return 'Too many flowers of some type';
	if (ribbons > 0 && quality - 2 >= card.quality) return 'Too many ribbons';
}

/** Place a token at a shop, exchanging the displaced token with its previous shop. */
export function placePlanningToken(
	plan: (number | null)[],
	shop: number,
	token: number
): (number | null)[] {
	const next = [...plan];
	const previousShop = next.indexOf(token);
	if (previousShop === shop) return next;
	if (previousShop !== -1) next[previousShop] = next[shop];
	next[shop] = token;
	return next;
}
