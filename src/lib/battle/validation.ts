import type {
	BattleGameConfig,
	BattleGameMode,
	BattlePuzzleType,
	BattleRoomMeta,
	BattleThemeId
} from './types';

const PUZZLE_TYPES = new Set<BattlePuzzleType>([
	'crossroad',
	'spellingbee',
	'blanks',
	'spellingquiz',
	'boggle',
	'wordladder',
	'thaiquiz'
]);
const MODES = new Set<BattleGameMode>(['race', 'quiz']);
const THEMES = new Set<BattleThemeId>([
	'general',
	'animals',
	'food',
	'culture',
	'plants',
	'places',
	'science'
]);
const DIFFICULTIES = new Set(['easy', 'normal', 'hard']);

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validateBattleConfig(value: unknown): BattleGameConfig | null {
	if (!isRecord(value)) return null;
	if (!PUZZLE_TYPES.has(value.puzzleType as BattlePuzzleType)) return null;
	if (!MODES.has(value.mode as BattleGameMode)) return null;
	if (!THEMES.has(value.theme as BattleThemeId)) return null;
	if (!DIFFICULTIES.has(value.difficulty as string)) return null;
	if (
		!Number.isInteger(value.rounds) ||
		(value.rounds as number) < 1 ||
		(value.rounds as number) > 10
	)
		return null;
	if (
		!Number.isInteger(value.timePerRound) ||
		(value.timePerRound as number) < 10 ||
		(value.timePerRound as number) > 600
	)
		return null;
	if (
		!Number.isInteger(value.maxPlayers) ||
		(value.maxPlayers as number) < 1 ||
		(value.maxPlayers as number) > 16
	)
		return null;
	if (
		typeof value.roomName !== 'string' ||
		value.roomName.trim().length < 1 ||
		value.roomName.length > 60
	)
		return null;
	if (typeof value.isPublic !== 'boolean') return null;
	return { ...value, roomName: value.roomName.trim() } as BattleGameConfig;
}

export function validateBattleRoomMeta(value: unknown): BattleRoomMeta | null {
	if (!isRecord(value)) return null;
	const config = validateBattleConfig(value.config);
	if (!config || !Array.isArray(value.rounds) || !Number.isInteger(value.currentRound)) return null;
	const currentRound = value.currentRound as number;
	if (currentRound < 0 || currentRound >= value.rounds.length) return null;
	if (!(value.roundStartTime === null || typeof value.roundStartTime === 'number')) return null;
	if (!(value.roundEndTime === null || typeof value.roundEndTime === 'number')) return null;
	return { ...value, config } as unknown as BattleRoomMeta;
}
