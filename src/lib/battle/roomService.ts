import { supabaseClient } from '#lib/supabase.js';
import type { BattleGameConfig, BattlePlayer, BattleRoomMeta, SupabaseRoomRow } from './types';
import { isBattleRoundOpen } from './rules';
import { validateBattleConfig, validateBattleRoomMeta } from './validation';
import { recordDiagnostic } from '#lib/diagnostics.js';
import { claimBattleAction } from './actionReceipts';

export { subscribeToLobbyRealtime, subscribeToRoomRealtime } from './realtime';

const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateRoomCode(length = 4): string {
	let result = '';
	for (let i = 0; i < length; i++) {
		result += ROOM_CODE_CHARS.charAt(Math.floor(Math.random() * ROOM_CODE_CHARS.length));
	}
	return result;
}

export function parseRoomMeta(gameTitle: string): BattleRoomMeta | null {
	try {
		return validateBattleRoomMeta(JSON.parse(gameTitle));
	} catch {
		// Not json or older game_title string
	}
	return null;
}

async function generateRounds(config: BattleGameConfig) {
	const { generateBattleRounds } = await import('./generators');
	return generateBattleRounds(config.puzzleType, config.rounds);
}

async function compareAndSwapRoom(
	roomId: string,
	expectedGameTitle: string,
	updates: Record<string, unknown>
): Promise<{ updated: boolean; error?: string }> {
	const { data, error } = await supabaseClient
		.from('rooms')
		.update(updates)
		.eq('room_id', roomId)
		.eq('game_title', expectedGameTitle)
		.select('room_id')
		.maybeSingle();

	if (error) return { updated: false, error: error.message };
	if (!data) recordDiagnostic('battle.cas_conflict', { roomId }, 'warn');
	return { updated: !!data };
}

// Clean up stale, abandoned or expired rooms
export async function cleanupStaleRooms(): Promise<void> {
	try {
		const now = Date.now();
		const staleThreshold = 1000 * 60 * 20; // 20 minutes of no player activity

		const { data } = await supabaseClient
			.from('rooms')
			.select('room_id, created_at, status, players, game_title')
			.limit(50);

		if (!data || data.length === 0) return;

		const staleRoomIds: string[] = [];

		for (const r of data) {
			const players: BattlePlayer[] = r.players || [];
			const createdAt = new Date(r.created_at).getTime();

			// 1. Room created over 6 hours ago
			if (now - createdAt > 1000 * 60 * 60 * 6) {
				staleRoomIds.push(r.room_id);
				continue;
			}

			// 2. Empty room
			if (players.length === 0 && now - createdAt > 1000 * 60 * 5) {
				staleRoomIds.push(r.room_id);
				continue;
			}

			// 3. No player activity within threshold
			const mostRecentActivity = Math.max(
				createdAt,
				...players.map((p) => p.lastSeen || createdAt)
			);
			if (now - mostRecentActivity > staleThreshold) {
				staleRoomIds.push(r.room_id);
			}
		}

		if (staleRoomIds.length > 0) {
			await supabaseClient.from('rooms').delete().in('room_id', staleRoomIds);
		}
	} catch (e) {
		console.warn('Error during stale room cleanup:', e);
	}
}

// Fetch all active public rooms with automatic stale cleanup
export async function fetchPublicRooms(): Promise<SupabaseRoomRow[]> {
	try {
		cleanupStaleRooms(); // Fire-and-forget background cleanup

		const { data, error } = await supabaseClient
			.from('rooms')
			.select('*')
			.eq('is_public', true)
			.in('status', [0, 1])
			.order('created_at', { ascending: false })
			.limit(40);

		if (error) {
			console.error('Error fetching rooms:', error);
			return [];
		}

		const now = Date.now();
		// Filter out rooms with 0 players or older than 4 hours
		const activeRooms = (data as SupabaseRoomRow[]).filter((r) => {
			const players = r.players || [];
			const createdTime = new Date(r.created_at).getTime();
			if (players.length === 0 && now - createdTime > 1000 * 60 * 5) return false;
			return true;
		});

		return activeRooms;
	} catch (e) {
		console.error('Exception fetching rooms:', e);
		return [];
	}
}

// Spectate / Watch an in-progress battle match
export async function spectateBattleRoom(
	roomId: string,
	spectator: BattlePlayer
): Promise<{ room: SupabaseRoomRow | null; error: string | null }> {
	try {
		const cleanCode = roomId.toUpperCase().trim();
		const currentRoom = await fetchRoomById(cleanCode);

		if (!currentRoom) {
			return { room: null, error: 'ไม่พบห้องที่ระบุ' };
		}

		const players = [...(currentRoom.players || [])];
		const existingIndex = players.findIndex((p) => p.id === spectator.id);

		if (existingIndex < 0) {
			players.push({
				...spectator,
				isHost: false,
				isReady: true,
				isSpectator: true,
				score: 0,
				currentRoundScore: 0,
				solvedCount: 0,
				progress: 0,
				lastSeen: Date.now()
			});
		} else {
			players[existingIndex] = { ...players[existingIndex], lastSeen: Date.now() };
		}

		const { data, error } = await supabaseClient
			.from('rooms')
			.update({ players })
			.eq('room_id', cleanCode)
			.select('*')
			.single();
		if (error || !data) return { room: null, error: error?.message || 'Failed to spectate' };

		return { room: data as SupabaseRoomRow, error: null };
	} catch (e: any) {
		return { room: null, error: e?.message || 'Failed to spectate' };
	}
}

// Fetch single room
export async function fetchRoomById(roomId: string): Promise<SupabaseRoomRow | null> {
	try {
		const { data, error } = await supabaseClient
			.from('rooms')
			.select('*')
			.eq('room_id', roomId.toUpperCase().trim())
			.single();

		if (error || !data) {
			return null;
		}

		return data as SupabaseRoomRow;
	} catch (e) {
		console.error('Exception fetching room by id:', e);
		return null;
	}
}

// Create new battle room
export async function createBattleRoom(
	hostPlayer: BattlePlayer,
	config: BattleGameConfig
): Promise<{ room: SupabaseRoomRow | null; error: string | null }> {
	try {
		const validConfig = validateBattleConfig(config);
		if (!validConfig) return { room: null, error: 'Invalid battle configuration' };
		const roomId = generateRoomCode(4);
		const rounds = await generateRounds(validConfig);

		const meta: BattleRoomMeta = {
			config: validConfig,
			rounds,
			currentRound: 0,
			roundStartTime: null,
			roundEndTime: null
		};

		const newRoom: Partial<SupabaseRoomRow> = {
			room_id: roomId,
			game_title: JSON.stringify(meta),
			host_user_id: hostPlayer.id,
			players: [hostPlayer],
			status: 0, // Lobby
			is_public: config.isPublic
		};

		const { data, error } = await supabaseClient
			.from('rooms')
			.insert([newRoom])
			.select('*')
			.single();

		if (error) {
			return { room: null, error: error.message };
		}

		return { room: data as SupabaseRoomRow, error: null };
	} catch (e: any) {
		return { room: null, error: e?.message || 'Failed to create room' };
	}
}

// Join existing room
export async function joinBattleRoom(
	roomId: string,
	player: BattlePlayer
): Promise<{ room: SupabaseRoomRow | null; error: string | null }> {
	try {
		const cleanCode = roomId.toUpperCase().trim();
		const currentRoom = await fetchRoomById(cleanCode);

		if (!currentRoom) {
			return { room: null, error: 'ไม่พบห้องที่ระบุ กรุณาตรวจสอบรหัสห้อง' };
		}

		let players = currentRoom.players || [];
		const existingIndex = players.findIndex((p) => p.id === player.id);

		if (existingIndex >= 0) {
			// Update player info & lastSeen
			players[existingIndex] = {
				...players[existingIndex],
				name: player.name,
				avatar: player.avatar,
				lastSeen: Date.now()
			};
		} else {
			// Check room status & max players
			const meta = parseRoomMeta(currentRoom.game_title);
			const max = meta?.config?.maxPlayers || 8;

			if (currentRoom.status !== 0) {
				return { room: null, error: 'ห้องนี้กำลังอยู่ในระหว่างการแข่งขัน' };
			}
			if (players.length >= max) {
				return { room: null, error: 'ห้องเต็มแล้ว ไม่สามารถเข้าร่วมได้' };
			}

			players.push({
				...player,
				isHost: false,
				isReady: false,
				score: 0,
				currentRoundScore: 0,
				solvedCount: 0,
				progress: 0,
				lastSeen: Date.now()
			});
		}

		const { data, error } = await supabaseClient
			.from('rooms')
			.update({ players })
			.eq('room_id', cleanCode)
			.select('*')
			.single();

		if (error) {
			return { room: null, error: error.message };
		}

		return { room: data as SupabaseRoomRow, error: null };
	} catch (e: any) {
		return { room: null, error: e?.message || 'Failed to join room' };
	}
}

// Reconnect to existing active room (preserves match state & scores)
export async function reconnectBattleRoom(
	roomId: string,
	playerId: string
): Promise<{ room: SupabaseRoomRow | null; error: string | null }> {
	try {
		const cleanCode = roomId.toUpperCase().trim();
		const currentRoom = await fetchRoomById(cleanCode);

		if (!currentRoom) {
			return { room: null, error: 'ไม่พบห้องเดิมหรือห้องถูกปิดแล้ว' };
		}

		const players = currentRoom.players || [];
		const existingIndex = players.findIndex((p) => p.id === playerId);

		if (existingIndex < 0) {
			return { room: null, error: 'ผู้เล่นไม่ได้อยู่ในห้องนี้' };
		}

		players[existingIndex] = {
			...players[existingIndex],
			lastSeen: Date.now()
		};

		const { data, error } = await supabaseClient
			.from('rooms')
			.update({ players })
			.eq('room_id', cleanCode)
			.select('*')
			.single();

		if (error) {
			return { room: currentRoom, error: null };
		}

		return { room: data as SupabaseRoomRow, error: null };
	} catch (e: any) {
		return { room: null, error: e?.message || 'Failed to reconnect' };
	}
}

// Leave room
export async function leaveBattleRoom(roomId: string, playerId: string): Promise<boolean> {
	try {
		const currentRoom = await fetchRoomById(roomId);
		if (!currentRoom) return true;

		let players = (currentRoom.players || []).filter((p) => p.id !== playerId);

		if (players.length === 0) {
			// Delete empty room
			await supabaseClient.from('rooms').delete().eq('room_id', roomId);
			return true;
		}

		// If host left, appoint next player as host
		let hostId = currentRoom.host_user_id;
		if (hostId === playerId && players.length > 0) {
			players[0].isHost = true;
			hostId = players[0].id;
		}

		await supabaseClient
			.from('rooms')
			.update({
				players,
				host_user_id: hostId
			})
			.eq('room_id', roomId);

		return true;
	} catch (e) {
		console.error('Error leaving room:', e);
		return false;
	}
}

// Toggle Ready status
export async function togglePlayerReady(
	roomId: string,
	playerId: string,
	isReady: boolean
): Promise<SupabaseRoomRow | null> {
	try {
		const currentRoom = await fetchRoomById(roomId);
		if (!currentRoom) return null;

		const players = (currentRoom.players || []).map((p) =>
			p.id === playerId ? { ...p, isReady, lastSeen: Date.now() } : p
		);

		const { data, error } = await supabaseClient
			.from('rooms')
			.update({ players })
			.eq('room_id', roomId)
			.select('*')
			.single();

		if (error) return null;
		return data as SupabaseRoomRow;
	} catch {
		return null;
	}
}

// Update Room Configuration (Host only)
export async function updateBattleRoomConfig(
	roomId: string,
	actorId: string,
	newConfig: BattleGameConfig
): Promise<SupabaseRoomRow | null> {
	try {
		const validConfig = validateBattleConfig(newConfig);
		if (!validConfig) return null;
		const currentRoom = await fetchRoomById(roomId);
		if (!currentRoom || currentRoom.host_user_id !== actorId || currentRoom.status !== 0)
			return null;

		const rounds = await generateRounds(validConfig);
		const meta: BattleRoomMeta = {
			config: validConfig,
			rounds,
			currentRound: 0,
			roundStartTime: null,
			roundEndTime: null
		};

		const { data, error } = await supabaseClient
			.from('rooms')
			.update({
				game_title: JSON.stringify(meta),
				is_public: validConfig.isPublic
			})
			.eq('room_id', roomId)
			.select('*')
			.single();

		if (error) return null;
		return data as SupabaseRoomRow;
	} catch {
		return null;
	}
}

// Start Game (Host only)
export async function startBattleMatch(
	roomId: string,
	actorId: string
): Promise<SupabaseRoomRow | null> {
	try {
		const currentRoom = await fetchRoomById(roomId);
		if (!currentRoom || currentRoom.status !== 0 || currentRoom.host_user_id !== actorId)
			return null;
		const activePlayers = (currentRoom.players || []).filter((player) => !player.isSpectator);
		if (activePlayers.length === 0 || activePlayers.some((player) => !player.isReady)) return null;

		const meta = parseRoomMeta(currentRoom.game_title);
		if (!meta) return null;

		const now = Date.now();
		meta.roundStartTime = now + 3500; // 3.5s countdown
		meta.roundEndTime = meta.roundStartTime + meta.config.timePerRound * 1000;
		meta.currentRound = 0;
		meta.currentQuestionIndex = 0;
		meta.quizClaims = {};
		meta.sharedFoundWords = {};

		// Reset player round scores and progress
		const players = (currentRoom.players || []).map((p) => ({
			...p,
			score: 0,
			currentRoundScore: 0,
			solvedCount: 0,
			progress: 0
		}));

		const { data, error } = await supabaseClient
			.from('rooms')
			.update({
				status: 1, // Battle in progress
				game_title: JSON.stringify(meta),
				players
			})
			.eq('room_id', roomId)
			.eq('game_title', currentRoom.game_title)
			.select('*')
			.maybeSingle();

		if (error) return null;
		return data as SupabaseRoomRow;
	} catch {
		return null;
	}
}

// Update Player Progress & Score during Battle
export async function submitPlayerProgress(
	roomId: string,
	playerId: string,
	scoreDelta: number,
	progress: number,
	solvedIncrement = 1,
	actionDetail: string | undefined,
	actionId: string
): Promise<void> {
	try {
		for (let attempt = 0; attempt < 3; attempt++) {
			const currentRoom = await fetchRoomById(roomId);
			if (!currentRoom || currentRoom.status !== 1) return;

			const meta = parseRoomMeta(currentRoom.game_title);
			const player = (currentRoom.players || []).find((candidate) => candidate.id === playerId);
			if (
				!meta ||
				!player ||
				player.isSpectator ||
				!isBattleRoundOpen(meta.roundStartTime, meta.roundEndTime)
			)
				return;
			if (!claimBattleAction(meta, actionId, playerId)) return;

			const players = currentRoom.players.map((candidate) =>
				candidate.id === playerId
					? {
							...candidate,
							score: Math.max(0, candidate.score + scoreDelta),
							currentRoundScore: candidate.currentRoundScore + scoreDelta,
							solvedCount: candidate.solvedCount + solvedIncrement,
							progress: Math.min(100, Math.max(0, progress)),
							lastSeen: Date.now()
						}
					: candidate
			);

			meta.revision = (meta.revision || 0) + 1;
			if (actionDetail) {
				meta.lastAction = {
					type: 'score',
					playerId,
					playerName: player.name,
					detail: actionDetail,
					timestamp: Date.now()
				};
			}

			const result = await compareAndSwapRoom(roomId, currentRoom.game_title, {
				players,
				game_title: JSON.stringify(meta)
			});
			if (result.updated || result.error) return;
		}
	} catch (e) {
		console.error('Error submitting player progress:', e);
	}
}

// Submit Shared Word in Quiz Mode (Spelling Bee / Boggle)
export async function submitSharedWord(
	roomId: string,
	playerId: string,
	word: string,
	scoreDelta: number,
	progress: number,
	actionDetail: string | undefined,
	actionId: string
): Promise<{ success: boolean; reason?: string }> {
	try {
		for (let attempt = 0; attempt < 3; attempt++) {
			const currentRoom = await fetchRoomById(roomId);
			if (!currentRoom || currentRoom.status !== 1)
				return { success: false, reason: 'Room not active' };

			const meta = parseRoomMeta(currentRoom.game_title);
			const playerObj = currentRoom.players.find((player) => player.id === playerId);
			if (!meta || !playerObj || playerObj.isSpectator)
				return { success: false, reason: 'Player not active' };
			if (!isBattleRoundOpen(meta.roundStartTime, meta.roundEndTime))
				return { success: false, reason: 'Round not active' };
			if (meta.actionReceipts?.[actionId]) return { success: true };
			if (!claimBattleAction(meta, actionId, playerId))
				return { success: false, reason: 'Invalid action' };

			const shared = { ...(meta.sharedFoundWords || {}) };
			if (shared[word]) {
				return { success: false, reason: `คำนี้ถูก ${shared[word].playerName} ตอบไปแล้ว!` };
			}

			shared[word] = { playerId, playerName: playerObj.name, avatar: playerObj.avatar };
			meta.sharedFoundWords = shared;
			meta.revision = (meta.revision || 0) + 1;
			const players = currentRoom.players.map((player) =>
				player.id === playerId
					? {
							...player,
							score: Math.max(0, player.score + scoreDelta),
							currentRoundScore: player.currentRoundScore + scoreDelta,
							solvedCount: player.solvedCount + 1,
							progress: Math.min(100, Math.max(0, progress)),
							lastSeen: Date.now()
						}
					: player
			);

			if (actionDetail) {
				meta.lastAction = {
					type: 'score',
					playerId,
					playerName: playerObj.name,
					detail: actionDetail,
					timestamp: Date.now()
				};
			}

			const result = await compareAndSwapRoom(roomId, currentRoom.game_title, {
				players,
				game_title: JSON.stringify(meta)
			});
			if (result.updated) return { success: true };
			if (result.error) return { success: false, reason: result.error };
		}
		return { success: false, reason: 'ห้องมีการเปลี่ยนแปลง กรุณาลองอีกครั้ง' };
	} catch (e: any) {
		return { success: false, reason: e?.message };
	}
}

// Submit Quiz Single Question Claim (Crossroad, Blanks, Spelling Quiz)
export async function submitQuizClaim(
	roomId: string,
	playerId: string,
	claimKey: string,
	scoreDelta: number,
	progress: number,
	actionDetail: string | undefined,
	actionId: string
): Promise<{ success: boolean; reason?: string }> {
	try {
		for (let attempt = 0; attempt < 3; attempt++) {
			const currentRoom = await fetchRoomById(roomId);
			if (!currentRoom || currentRoom.status !== 1)
				return { success: false, reason: 'Room not active' };

			const meta = parseRoomMeta(currentRoom.game_title);
			const playerObj = currentRoom.players.find((player) => player.id === playerId);
			if (!meta || !playerObj || playerObj.isSpectator)
				return { success: false, reason: 'Player not active' };
			if (!isBattleRoundOpen(meta.roundStartTime, meta.roundEndTime))
				return { success: false, reason: 'Round not active' };
			if (meta.actionReceipts?.[actionId]) return { success: true };
			if (!claimBattleAction(meta, actionId, playerId))
				return { success: false, reason: 'Invalid action' };

			const claims = { ...(meta.quizClaims || {}) };
			if (claims[claimKey]) {
				return { success: false, reason: `ข้อนี้ถูก ${claims[claimKey].playerName} ชิงตอบไปแล้ว!` };
			}

			claims[claimKey] = {
				playerId,
				playerName: playerObj.name,
				avatar: playerObj.avatar,
				score: scoreDelta
			};
			meta.quizClaims = claims;
			meta.currentQuestionIndex = (meta.currentQuestionIndex || 0) + 1;
			meta.revision = (meta.revision || 0) + 1;
			const players = currentRoom.players.map((player) =>
				player.id === playerId
					? {
							...player,
							score: Math.max(0, player.score + scoreDelta),
							currentRoundScore: player.currentRoundScore + scoreDelta,
							solvedCount: player.solvedCount + 1,
							progress: Math.min(100, Math.max(0, progress)),
							lastSeen: Date.now()
						}
					: player
			);

			if (actionDetail) {
				meta.lastAction = {
					type: 'claim',
					playerId,
					playerName: playerObj.name,
					detail: actionDetail,
					timestamp: Date.now()
				};
			}

			const result = await compareAndSwapRoom(roomId, currentRoom.game_title, {
				players,
				game_title: JSON.stringify(meta)
			});
			if (result.updated) return { success: true };
			if (result.error) return { success: false, reason: result.error };
		}
		return { success: false, reason: 'ห้องมีการเปลี่ยนแปลง กรุณาลองอีกครั้ง' };
	} catch (e: any) {
		return { success: false, reason: e?.message };
	}
}

// Advance to next round or finish match
export async function finishOrNextRound(
	roomId: string,
	actorId: string
): Promise<SupabaseRoomRow | null> {
	try {
		const currentRoom = await fetchRoomById(roomId);
		if (!currentRoom || currentRoom.status !== 1 || currentRoom.host_user_id !== actorId)
			return null;

		const meta = parseRoomMeta(currentRoom.game_title);
		if (!meta) return null;

		const nextRound = meta.currentRound + 1;

		if (nextRound < meta.rounds.length) {
			// Advance round
			meta.currentRound = nextRound;
			meta.currentQuestionIndex = 0;
			meta.sharedFoundWords = {};
			meta.quizClaims = {};
			const now = Date.now();
			meta.roundStartTime = now + 3500;
			meta.roundEndTime = meta.roundStartTime + meta.config.timePerRound * 1000;

			// Reset per-round player progress
			const players = (currentRoom.players || []).map((p) => ({
				...p,
				progress: 0,
				currentRoundScore: 0
			}));

			const { data } = await supabaseClient
				.from('rooms')
				.update({
					game_title: JSON.stringify(meta),
					players
				})
				.eq('room_id', roomId)
				.eq('game_title', currentRoom.game_title)
				.select('*')
				.maybeSingle();

			return data as SupabaseRoomRow;
		} else {
			// Finish Match -> Podium
			const { data } = await supabaseClient
				.from('rooms')
				.update({
					status: 2 // Finished
				})
				.eq('room_id', roomId)
				.eq('status', 1)
				.select('*')
				.maybeSingle();

			return data as SupabaseRoomRow;
		}
	} catch {
		return null;
	}
}

// End Match Early (Host only)
export async function endBattleMatchEarly(
	roomId: string,
	actorId: string
): Promise<SupabaseRoomRow | null> {
	try {
		const currentRoom = await fetchRoomById(roomId);
		if (!currentRoom || currentRoom.host_user_id !== actorId || currentRoom.status !== 1)
			return null;
		const { data, error } = await supabaseClient
			.from('rooms')
			.update({
				status: 2 // Finished -> Podium
			})
			.eq('room_id', roomId)
			.eq('host_user_id', actorId)
			.eq('status', 1)
			.select('*')
			.single();

		if (error) return null;
		return data as SupabaseRoomRow;
	} catch {
		return null;
	}
}

// Reset Room to Lobby for Rematch
export async function resetRoomToLobby(
	roomId: string,
	actorId: string
): Promise<SupabaseRoomRow | null> {
	try {
		const currentRoom = await fetchRoomById(roomId);
		if (!currentRoom || currentRoom.host_user_id !== actorId || currentRoom.status !== 2)
			return null;

		const meta = parseRoomMeta(currentRoom.game_title);
		if (meta) {
			// Generate fresh rounds
			meta.rounds = await generateRounds(meta.config);
			meta.currentRound = 0;
			meta.roundStartTime = null;
			meta.roundEndTime = null;
			meta.lastAction = undefined;
		}

		const players = (currentRoom.players || []).map((p) => ({
			...p,
			isReady: false,
			score: 0,
			currentRoundScore: 0,
			solvedCount: 0,
			progress: 0
		}));

		const { data, error } = await supabaseClient
			.from('rooms')
			.update({
				status: 0, // Lobby
				game_title: meta ? JSON.stringify(meta) : currentRoom.game_title,
				players
			})
			.eq('room_id', roomId)
			.eq('host_user_id', actorId)
			.eq('status', 2)
			.select('*')
			.single();

		if (error) return null;
		return data as SupabaseRoomRow;
	} catch {
		return null;
	}
}
