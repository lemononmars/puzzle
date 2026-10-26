export interface FlowerToken {
	type: number;
	quality: number;
}
export interface BouquetOrder {
	flowers: number[];
	quality: number;
	score: number;
	level: number;
}
export interface Tool {
	type: number;
	level: number;
	cost: number;
	amount: number;
	label: string;
}
export interface Player {
	id: number;
	username: string;
	color: string;
	isBot: boolean;
	score: number;
	money: number;
	numVases: number;
	vases: FlowerToken[];
	time: number;
	stars: number[];
	bonus: number[];
	hand: BouquetOrder[];
	numPlayedCards: number;
	numRibbons: number;
	actionCubes: number;
	myPlayedTimeTokens: number[];
}
export interface Achievement {
	type: number;
	claimedBy: number[];
}
export interface PakklongGame {
	readonly players: Player[];
	numBots: number;
	readonly turn: number;
	readonly phase: number;
	readonly activeShop: number;
	readonly myID: number;
	readonly achievements: Achievement[];
	readonly shops: [number[], FlowerToken[], FlowerToken[], FlowerToken[], BouquetOrder[], Tool[]];
	readonly isDone: boolean;
	readonly autoplay: boolean;
	readonly autoplaySpeed: number;
	setAutoplaySpeed(value: number): void;
	readonly gameState: number;
	readonly currentPlayer: number;
	readonly selectedFlowerCardIndex: number;
	readonly selectedVasesIndices: number[];
	chosenRibbons: number;
	readonly chosenTimeTokens: (number | null)[];
	readonly selectedTimeToken: number | null;
	readonly notification: string;
	readonly notice: {
		message: string;
		severity: 'info' | 'error';
		target: number | 'player';
	} | null;
	readonly turnOrder: Player[];
	readonly joined: boolean;
	readonly lobbyPlayers: { userID: string; username: string }[];
	readonly gameLogs: { msg: string; timestamp: string; color?: string }[];
	readonly timeTokensByShop: { id: number; value: number }[][];
	readonly me: Player | undefined;
	readonly canPass: boolean;
	start(): void;
	canShop(index: number): boolean;
	getMyTimeTokens(player: Player): number[];
	checkAchievement(type: number, player: Player | undefined): boolean;
	handleSelectTimeToken(value: number): void;
	handleRemoveTimeToken(shop: number): void;
	assignTimeToken(shop: number, token?: number | null): void;
	submitTimePlanning(): void;
	clickGoods(shop: number, index: number): void;
	selectVaseToken(index: number): void;
	selectFlowerCard(index: number): void;
	arrangeFlower(): void;
	passTurn(): void;
	triggerAutoplay(): void;
}

export type GameIconName =
	| 'flower'
	| 'star'
	| 'trophy'
	| 'coins'
	| 'ribbon'
	| 'box'
	| 'clock'
	| 'vase'
	| 'book'
	| 'send'
	| 'check'
	| 'arrow'
	| 'bot'
	| 'settings'
	| 'leave'
	| 'help';
