// @ts-nocheck -- Legacy game rules retain their dynamic state during the UI refactor.
import { onMount, onDestroy } from 'svelte';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import {
	randomIndex as ran,
	shuffle,
	generateMarket as generateGoods,
	generateStartingFlowerCards,
	getBonus,
	getMyTimeTokens,
	checkAchievement,
	arrangementError,
	placePlanningToken
} from './rules';
import { selfInfo } from '../stores/self.js';
import socket from '../stores/socket.js';
import {
	botNames,
	playerColors,
	shopList,
	toolCost,
	toolAmount,
	toolString,
	achievementString,
	achievementRewards,
	startingMoney,
	handLimit
} from './constants';

/** @param {string} roomID @returns {import('./types').PakklongGame} */
export function createPakklongGame(roomID) {
	const listeners = [];
	const timers = new Set();
	const listen = (...args) => listeners.push(socket.on(...args));
	const schedule = (callback, delay) => {
		const timer = setTimeout(() => {
			timers.delete(timer);
			callback();
		}, delay);
		timers.add(timer);
	};
	onDestroy(() => {
		for (const unsubscribe of listeners) unsubscribe();
		for (const timer of timers) clearTimeout(timer);
		socket.emit('leave room', roomID);
		selfInfo.update((value) => ({ ...value, roomID: 'lobby' }));
	});
	// ── Game States ────────────────────────────────────────────────────────────
	let players = $state([]);
	let numPlayers = $state(0);
	let numBots = $state(1);
	let turn = $state(1);
	let phase = $state(0); // 0 = early bird, 1 = planning, 2 = buy, 3 = aftermarket, 4 = arranging
	let activeShop = $state(0);
	let activeTokenOrder = $state(-1);
	let tieBreak = $state([]);
	let myID = $state(-1);
	let achievements = $state([]);
	let shops = $state([[], [], [], [], [], []]);
	let isDone = $state(false);
	let autoplay = $state(false);
	let autoplaySpeed = $state(1);
	let automationRevision = 0;
	let buyFlowerToolToken = $state(false);
	let gameState = $state(0);
	let currentPlayer = $state(-1);

	// Arrange phase selection states
	let selectedFlowerCardIndex = $state(-1);
	let selectedVasesIndices = $state([]);
	let chosenRibbons = $state(0);

	// Time token planning states (Phase 1)
	let chosenTimeTokens = $state(new Array(6).fill(null)); // slots for shops 1-6

	let selectedTimeToken = $state(null);
	let notification = $state('');
	let joined = $state(false);
	let lobbyPlayers = $state([]);
	let gameLogs = $state([]);
	const nativeBotIds = new Set();
	const planningSubmitted = new Set();
	const arrangingFinished = new Set();
	const pendingAutomation = new Map();
	let interactionShop = null;
	let notice = $state(null);
	let noticeSequence = 0;

	// ── Helper functions ───────────────────────────────────────────────────────
	function addLog(msg, playerId = null) {
		const color = playerId !== null && players[playerId] ? players[playerId].color : 'transparent';
		const textColor = 'currentColor';
		const timestamp = new Date().toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
		gameLogs = [...gameLogs.slice(-99), { msg, color, textColor, timestamp }];
	}

	function addNoti(msg, severity = 'info') {
		const target =
			phase === 4 ? 'player' : (interactionShop ?? (phase === 2 ? activeShop : 'player'));
		const next = { message: msg, severity, target, id: ++noticeSequence };
		notice = next;
		notification = msg;
		schedule(() => {
			if (notice?.id === next.id) {
				notice = null;
				notification = '';
			}
		}, 5000);
	}
	function controlsAutomation(id) {
		return nativeBotIds.has(id) ? myID === 0 : id === myID && autoplay;
	}
	function automationKey(id) {
		return [
			turn,
			phase,
			activeShop,
			activeTokenOrder,
			currentPlayer,
			buyFlowerToolToken,
			id,
			automationRevision
		].join(':');
	}
	function queueAutomation() {
		if (gameState !== 1) return;
		for (const player of players) {
			const id = player.id;
			if (!controlsAutomation(id)) continue;
			if (
				phase === 1
					? planningSubmitted.has(id)
					: phase === 4
						? arrangingFinished.has(id)
						: currentPlayer !== id
			)
				continue;
			const key = automationKey(id);
			if (pendingAutomation.get(id) === key) continue;
			pendingAutomation.set(id, key);
			schedule(() => {
				if (pendingAutomation.get(id) !== key) return;
				pendingAutomation.delete(id);
				if (gameState !== 1 || !controlsAutomation(id) || automationKey(id) !== key) return;
				if (phase === 1) {
					if (!planningSubmitted.has(id)) botChooseTimeTokens(id);
				} else if (phase === 4) {
					if (arrangingFinished.has(id)) return;
					for (let attempt = 0; attempt < handLimit && botArrangeFlower(id); attempt++) {
						/* Finish legal orders before ending the phase. */
					}
					if (id === myID) isDone = true;
					socket.emit('finish arranging', { id });
				} else if (currentPlayer === id) handleBotTurn(id);
			}, 400 / autoplaySpeed);
		}
	}

	// ── Setup Logic ───────────────────────────────────────────────────────────
	// ── Svelte Game Loop Methods ────────────────────────────────────────────────
	function initializeBoard(data) {
		myID = data.players.indexOf(get(selfInfo).username);
		players = [];
		nativeBotIds.clear();
		planningSubmitted.clear();
		arrangingFinished.clear();
		pendingAutomation.clear();
		autoplay = false;

		data.players.forEach((username, i) => {
			players.push({
				id: i,
				username,
				color: playerColors[i],
				isBot: false,
				score: 0,
				money: 0,
				numVases: 3,
				vases: [],
				time: 0,
				stars: [0, 0, 0],
				bonus: [0, 1, 2],
				hand: [],
				numPlayedCards: 0,
				numRibbons: 0,
				actionCubes: 0,
				myPlayedTimeTokens: []
			});
		});

		for (let i = 0; i < data.numBots; i++) {
			nativeBotIds.add(players.length);
			const bname = botNames[ran(botNames.length)] + '#' + i;
			players.push({
				id: players.length,
				username: bname,
				color: playerColors[players.length],
				isBot: true,
				score: 0,
				money: 0,
				numVases: 3,
				vases: [],
				time: 0,
				stars: [0, 0, 0],
				bonus: [0, 1, 2],
				hand: [],
				numPlayedCards: 0,
				numRibbons: 0,
				actionCubes: 0,
				myPlayedTimeTokens: []
			});
		}

		numPlayers = players.length;
		numBots = data.numBots;
		gameState = 1; // playing
		turn = 1;
		phase = 0;

		if (myID === 0) {
			const bonuses = [0, 1, 2, 3, 4, 5];
			shuffle(bonuses);
			const tie = Array.from({ length: numPlayers }, (_, i) => i);
			shuffle(tie);
			const ach = Array.from({ length: 8 }, (_, i) => i);
			shuffle(ach);
			const selectedAch = ach.slice(0, numPlayers);

			socket.emit('give starting stuff', {
				flowerCards: generateStartingFlowerCards(),
				bonuses: bonuses,
				tieBreak: tie,
				achieve: selectedAch,
				playerColors: playerColors.slice(0, numPlayers)
			});

			socket.emit('generate market', generateGoods(numPlayers));
		}
	}

	// ── Gameplay Logic Mapped to Svelte State ─────────────────────────────────
	function checkEndGame() {
		if (turn >= 10) return true;
		let end = false;
		let maxScore = 0;
		players.forEach((p) => {
			let maxStars = Math.max(...p.stars);
			if (maxStars >= 7) {
				end = true;
				p.score += 2;
			}
			if (p.score > maxScore) maxScore = p.score;
		});
		if (maxScore >= 40) end = true;
		return end;
	}

	function getActiveTimeToken() {
		const list = timeTokensByShop[activeShop] || [];
		const token = list[activeTokenOrder];
		return token ? token.id : -1;
	}

	// Computed state for active time tokens in Phase 2
	let timeTokensByShop = $derived.by(() => {
		if (phase !== 2) return [[], [], [], [], [], []];
		const shopListTokens = Array.from({ length: 6 }, () => []);

		// Collect time tokens from all players
		const tempTokens = Array.from({ length: 6 }, () => []);
		players.forEach((p) => {
			for (let k = 0; k < 6; k++) {
				tempTokens[k].push({ id: p.id, value: p.myPlayedTimeTokens[k] });
			}
		});

		// Sort time tokens in each shop based on planning rules
		for (let k = 0; k < 6; k++) {
			const shopTokens = tempTokens[k];
			shopTokens.sort((a, b) => {
				if (a.value !== b.value) return a.value - b.value;
				return tieBreak.indexOf(a.id) - tieBreak.indexOf(b.id);
			});
			shopListTokens[k] = shopTokens;
		}
		return shopListTokens;
	});

	function goFirst(id) {
		const idx = tieBreak.indexOf(Number(id));
		if (idx >= 0) {
			tieBreak.splice(idx, 1);
			tieBreak.unshift(Number(id));
		}
	}

	function nextPlayer() {
		let nextP = -1;
		if (phase === 2) {
			activeTokenOrder++;
			if (activeTokenOrder >= numPlayers || getActiveTimeToken() === -1) {
				activeTokenOrder = 0;
				activeShop++;
				while (activeShop < 6 && getActiveTimeToken() === -1) {
					activeShop++;
				}
			}
			if (activeShop < 6) {
				nextP = getActiveTimeToken();
			} else {
				currentPlayer = -1;
				if (myID === 0) socket.emit('end phase', { phase });
				return;
			}
		} else if (phase === 0 || phase === 3) {
			const cubesNeeded = phase === 0 ? 3 : 2;
			let idx = currentPlayer === -1 ? 0 : tieBreak.indexOf(Number(currentPlayer)) + 1;
			while (idx < numPlayers && players[tieBreak[idx]].actionCubes < cubesNeeded) {
				idx++;
			}
			if (idx < numPlayers) {
				nextP = tieBreak[idx];
			} else if (myID === 0) {
				currentPlayer = -1;
				socket.emit('end phase', { phase });
				return;
			}
		}
		currentPlayer = nextP;

		queueAutomation();
	}

	// ── Card verification helper ────────────────────────────────────────────────
	function verifyArrangement(card, flowers, ribbons, bonus) {
		const error = arrangementError(card, flowers, ribbons, bonus);
		if (error) addNoti(error, 'error');
		return !error;
	}

	// ── Bot AI Coordination ───────────────────────────────────────────────────
	function handleBotTurn(botId) {
		if (buyFlowerToolToken) {
			if (players[botId].vases.length < players[botId].numVases) {
				for (const shop of [1, 2, 3])
					if (shops[shop].length && executePlayerAction(botId, shop, 0)) return;
			}
			executePlayerAction(botId, 0, -1);
			return;
		}
		if (phase === 0 || phase === 3) {
			const cubesNeeded = phase === 0 ? 3 : 2;
			if (players[botId].actionCubes >= cubesNeeded) {
				const bestIdx = findBestIndex(botId, 0);
				executePlayerAction(botId, 0, bestIdx);
			} else {
				executePlayerAction(botId, 0, -1); // pass
			}
		} else if (phase === 2) {
			const shopGoods = shops[activeShop] || [];
			if (shopGoods.length === 0) {
				executePlayerAction(botId, activeShop, -1); // pass
			} else {
				const bestIdx = findBestIndex(botId, activeShop);
				if (!executePlayerAction(botId, activeShop, bestIdx)) {
					executePlayerAction(botId, activeShop, -1);
				}
			}
		}
	}

	function botChooseTimeTokens(botId) {
		const wanted = [];
		const unwanted = [];
		if (turn <= 3) wanted.unshift(5);

		if (players[botId].hand.length >= 3 || shops[4].length === 0) {
			unwanted.push(4);
		} else if (players[botId].hand.length <= 1) {
			wanted.unshift(4);
		}

		if (players[botId].hand.length > 0) {
			if (shops[1].length === 0 || players[botId].vases.length === players[botId].numVases)
				unwanted.push(1);
			else if (needFlowerTokens(botId, 0)) wanted.unshift(1);

			if (shops[2].length === 0 || players[botId].vases.length === players[botId].numVases)
				unwanted.push(2);
			else if (needFlowerTokens(botId, 1)) wanted.unshift(2);

			if (shops[3].length === 0 || players[botId].vases.length === players[botId].numVases)
				unwanted.push(3);
			else if (needFlowerTokens(botId, 2)) wanted.unshift(3);
		}

		let totalMoneyInRestaurant = (shops[0] || []).reduce((sum, m) => sum + m, 0);
		if (players[botId].money <= 3 || totalMoneyInRestaurant >= 2 * numPlayers) {
			wanted.unshift(0);
		}

		const middle = [];
		for (let i = 0; i < 6; i++) {
			if (!wanted.includes(i) && !unwanted.includes(i)) middle.push(i);
		}
		shuffle(middle);
		shuffle(unwanted);
		const order = wanted.concat(middle, unwanted);

		const botTokens = getMyTimeTokens(players[botId]);
		players[botId].myPlayedTimeTokens = [];
		for (let i = 0; i < 6; i++) {
			players[botId].myPlayedTimeTokens.push(botTokens[order.indexOf(i)]);
		}

		socket.emit('submit time tokens', {
			id: botId,
			timeTokens: players[botId].myPlayedTimeTokens
		});
	}

	function botArrangeFlower(botId) {
		const player = players[botId];
		if (player.hand.length < 1) return false;

		for (let i = 0; i < player.hand.length; i++) {
			const card = player.hand[i];
			const required = card.flowers;
			const requiredTotal = card.quality;
			const vasesList = [[], [], []];

			player.vases.forEach((tok, index) => {
				vasesList[tok.type].push([index, tok.quality]);
			});

			if (
				vasesList[0].length >= required[0] &&
				vasesList[1].length >= required[1] &&
				vasesList[2].length >= required[2]
			) {
				for (let k = 0; k < 3; k++) {
					vasesList[k].sort((a, b) => a[1] - b[1]);
				}

				let totalQuality = getBonus(player, 0);
				const indexFTokens = [];
				for (let k = 0; k < 3; k++) {
					for (let l = 0; l < required[k]; l++) {
						totalQuality += vasesList[k][l][1];
						indexFTokens.push(vasesList[k][l][0]);
					}
				}

				if (totalQuality + 2 * player.numRibbons >= requiredTotal) {
					const numRibbonsUsed = Math.max(0, Math.ceil((requiredTotal - totalQuality) / 2));
					socket.emit('arrange flower', {
						id: botId,
						card: i,
						indices: indexFTokens,
						ribbons: numRibbonsUsed
					});
					return true;
				}
			}
		}
		return false;
	}

	function needFlowerTokens(botId, type) {
		const player = players[botId];
		if (player.hand.length > 0) {
			const want = player.hand[0].flowers[type];
			const have = player.vases.filter((v) => v.type === type).length;
			return want > have;
		}
		return true;
	}

	function findBestIndex(botId, shop) {
		const player = players[botId];
		const shopGoods = shops[shop] || [];
		if (shopGoods.length === 0) return -1;
		let indexBest = 0;

		switch (shop) {
			case 0: // restaurant
				for (let i = 0; i < shopGoods.length; i++) {
					if (shopGoods[i] > shopGoods[indexBest]) indexBest = i;
				}
				break;
			case 1:
			case 2:
			case 3: // flower shops
				if (!needFlowerTokens(botId, shop - 1)) {
					indexBest = -1;
				} else {
					for (let i = 0; i < shopGoods.length; i++) {
						if (shopGoods[i].quality > shopGoods[indexBest].quality) indexBest = i;
					}
				}
				break;
			case 4: // library cards
				for (let i = 0; i < shopGoods.length; i++) {
					if (shopGoods[i].quality < shopGoods[indexBest].quality) indexBest = i;
				}
				break;
			case 5: // tools
				if (tieBreak.indexOf(Number(botId)) >= numPlayers - 2) {
					// get tie break priority
					indexBest = 4;
				} else if (player.time <= 2 && player.money >= 5) {
					indexBest = 0;
				} else if (
					(player.numVases <= 4 || player.numVases === player.vases.length) &&
					player.money >= 4
				) {
					indexBest = 1;
				} else if (
					player.numRibbons <= 2 &&
					player.money >= (shopGoods[2] ? shopGoods[2].cost : 0) + 1
				) {
					indexBest = 2;
				} else {
					indexBest = -1;
				}
				break;
		}
		return indexBest;
	}

	function executePlayerAction(pId, location, index) {
		const res = takeAction(pId, location, index);
		if (res) {
			socket.emit('take action', { id: pId, location, index });
			if (!buyFlowerToolToken) nextPlayer();
			else queueAutomation();
		}
		return res;
	}

	function takeAction(pId, location, index) {
		const player = players[pId];
		const shopGoods = shops[location] || [];
		if (location > 0 && location < 6 && shopGoods.length === 0) index = -1;

		if (index === -1) {
			if (turn > 1 || (turn === 1 && phase > 0)) {
				addLog(`${player.username} passes`, pId);
			}
			if (phase === 2) {
				player.actionCubes++;
			}
			buyFlowerToolToken = false;
			return true;
		}

		if (buyFlowerToolToken && (location === 0 || location >= 4)) return false;

		switch (location) {
			case 0: // restaurant
				const coins = shopGoods[index];
				player.money += coins;
				addLog(`${player.username} gains ฿${coins}`, pId);
				if (phase === 2) {
					shops[0].splice(index, 1);
				}
				break;
			case 1:
			case 2:
			case 3: // flowers
				if (player.money < 1 && !buyFlowerToolToken) {
					if (pId === myID) addNoti('Not enough money', 'error');
					return false;
				}
				if (player.vases.length >= player.numVases) {
					if (pId === myID) addNoti('Vases are full!', 'error');
					return false;
				}
				const tok = shopGoods[index];
				player.vases.push({ type: tok.type, quality: tok.quality });
				addLog(`${player.username} buys a ${shopList[location]} flower`, pId);
				shops[location].splice(index, 1);
				if (buyFlowerToolToken) buyFlowerToolToken = false;
				else player.money -= 1;
				break;
			case 4: // library cards
				if (player.hand.length >= handLimit) {
					if (pId === myID) addNoti('Hand is full!', 'error');
					return false;
				}
				const card = shopGoods[index];
				player.hand.push({
					flowers: card.flowers,
					quality: card.quality,
					score: card.score,
					level: card.level
				});
				addLog(`${player.username} draws a flower card`, pId);
				shops[4].splice(index, 1);
				break;
			case 5: // tools
				const tool = shopGoods[index];
				if (!tool || tool.level <= 0) return false;
				if (player.money < tool.cost) {
					if (pId === myID) addNoti('Not enough money', 'error');
					return false;
				}
				addLog(`${player.username} buys ${tool.label} for ฿${tool.cost}`, pId);
				// Apply tool upgrades
				switch (tool.type) {
					case 0: // clock
						player.time += tool.amount;
						player.score += tool.amount;
						if (player.time > 6) player.time = 6;
						break;
					case 1: // vase
						if (player.numVases < 6) player.numVases++;
						if (tool.amount === 2 && player.numVases < 6) player.numVases++;
						player.score += tool.amount;
						break;
					case 2: // ribbon
						player.numRibbons += tool.amount;
						break;
					case 3: // buy flower
						buyFlowerToolToken = true;
						if (pId === myID) {
							addNoti('You may buy any leftover flower next!');
						}
						break;
					case 4: // tie break
						goFirst(pId);
						break;
					case 5: // action cubes
						player.actionCubes += tool.amount;
						break;
				}
				player.money -= tool.cost;
				// Level down tool
				tool.level = Math.max(0, tool.level - 1);
				tool.cost = toolCost[tool.type][tool.level];
				tool.amount = toolAmount[tool.type][tool.level];
				tool.label = toolString[tool.type][tool.level];
				break;
			case 6: // achievements
				const achievement = achievements[index];
				if (!checkAchievement(achievement.type, player) || achievement.claimedBy.includes(pId))
					return false;
				achievement.claimedBy.push(pId);
				addLog(
					`${player.username} claimed achievement: ${achievementString[achievement.type]}`,
					pId
				);
				const rewards = achievementRewards[achievement.type];
				player.stars[0] += rewards[0];
				player.stars[1] += rewards[1];
				player.stars[2] += rewards[2];
				player.score += rewards[3];
				player.money += rewards[4];
				break;
		}

		if (phase === 0 && location < 6 && !buyFlowerToolToken) player.actionCubes -= 3;
		if (phase === 3 && location < 6 && !buyFlowerToolToken) player.actionCubes -= 2;

		return true;
	}

	// ── Svelte Lifecycle & Sockets ─────────────────────────────────────────────
	onMount(() => {
		listen('add player', ({ userID, username }) => {
			lobbyPlayers = [...lobbyPlayers.filter((p) => p.userID !== userID), { userID, username }];
		});
		listen('remove player', ({ userID }) => {
			lobbyPlayers = lobbyPlayers.filter((p) => p.userID !== userID);
		});
		listen('new game', (data) => {
			initializeBoard(data);
		});

		listen('starting stuff recieved', (data) => {
			const bonuses = [
				[0, 1, 2],
				[0, 2, 1],
				[1, 0, 2],
				[1, 2, 0],
				[2, 0, 1],
				[2, 1, 0]
			];
			players.forEach((p, i) => {
				p.bonus = bonuses[data.bonuses[i]];
				p.color = playerColors[i];
			});
			tieBreak = data.tieBreak;

			achievements = data.achieve.map((type) => ({
				type,
				claimedBy: []
			}));

			players.forEach((p, i) => {
				// Distribute starting resources
				const orderIdx = tieBreak.indexOf(i);
				p.money = startingMoney + Math.floor(orderIdx / 2);
				p.numRibbons = orderIdx % 2;
				p.time = 0;

				// Draw starting card
				const card = data.flowerCards[i];
				p.hand.push({
					flowers: [card[0], card[1], card[2]],
					quality: card[3],
					score: card[4],
					level: card[5]
				});
			});

			gameLogs = [];
			addLog('***** Turn ' + turn + '******');
			currentPlayer = -1;
			nextPlayer();
		});

		listen('market generated', (data) => {
			// Goods 0: restaurant
			shops[0] = [...data[0]];
			// Goods 1-3: flowers
			for (let j = 1; j < 4; j++) {
				shops[j] = data[j].map((tok) => ({ type: tok[0], quality: tok[1] }));
			}
			// Goods 4: cards
			shops[4] = data[4].map((card) => ({
				flowers: [card[0], card[1], card[2]],
				quality: card[3],
				score: card[4],
				level: card[5]
			}));
			// Goods 5: tools
			shops[5] = data[5].map((lvl, idx) => ({
				type: idx,
				level: lvl,
				cost: toolCost[idx][lvl],
				amount: toolAmount[idx][lvl],
				label: toolString[idx][lvl]
			}));
		});

		listen('to next phase', (data) => {
			notice = null;
			notification = '';
			selectedFlowerCardIndex = -1;
			selectedVasesIndices = [];
			chosenRibbons = 0;
			isDone = false;

			switch (data.phase) {
				case 0: // early-bird to planning
					selectedTimeToken = null;
					chosenTimeTokens = new Array(6).fill(null);
					phase = 1;
					addLog('----- planning phase -----');
					planningSubmitted.clear();
					queueAutomation();
					break;
				case 1: // planning to buy
					phase = 2;
					activeShop = 0;
					activeTokenOrder = -1;
					addLog('------ buy phase ------');
					nextPlayer();
					break;
				case 2: // buy to after market
					phase = 3;
					currentPlayer = -1;
					addLog('------ after market phase ------');
					nextPlayer();
					break;
				case 3: // after market to arranging
					phase = 4;
					addLog('------ arranging phase ------');
					arrangingFinished.clear();
					queueAutomation();
					break;
				case 4: // arranging to early bird
					if (checkEndGame()) {
						gameState = 2; // game end
						let winnerId = 0;
						addLog('------------- Final Scores -------------');
						players.forEach((p, idx) => {
							addLog(`${p.username} : ${p.score}`, idx);
							if (
								p.score > players[winnerId].score ||
								(p.score === players[winnerId].score &&
									tieBreak.indexOf(idx) < tieBreak.indexOf(winnerId))
							) {
								winnerId = idx;
							}
						});
						addLog(`|| The winner is ::: ${players[winnerId].username} :::`, winnerId);
					} else {
						turn++;
						phase = 0;
						currentPlayer = -1;
						addLog('***** Turn ' + turn + '******');
						addLog('----- early-bird phase -----');
						if (myID === 0) {
							socket.emit('generate market', generateGoods(numPlayers));
						}
						nextPlayer();
					}
					break;
			}
		});

		listen('time tokens submitted', (data) => {
			if (phase !== 1 || !players[data.id] || planningSubmitted.has(data.id)) return;
			planningSubmitted.add(data.id);
			players[data.id].myPlayedTimeTokens = data.timeTokens;
			if (data.id === myID) {
				isDone = true;
				chosenTimeTokens = [...data.timeTokens];
				selectedTimeToken = null;
			}
			addLog(`${players[data.id].username} submitted time tokens`, data.id);
			if (myID === 0 && planningSubmitted.size >= numPlayers)
				socket.emit('end phase', { phase: 1 });
		});

		listen('action taken', (data) => {
			takeAction(data.id, data.location, data.index);
			if (!buyFlowerToolToken) nextPlayer();
			else queueAutomation();
		});

		listen('flower arranged', (data) => {
			const p = players[data.id];
			if (p) {
				const card = p.hand[data.card];
				p.score += getBonus(p, 2) + card.score;
				p.money += getBonus(p, 1);
				p.numPlayedCards += 1;

				card.flowers.forEach((qty, fType) => {
					p.stars[fType] += qty;
				});

				p.numRibbons -= data.ribbons;
				p.hand.splice(data.card, 1);
				data.indices.sort((a, b) => b - a).forEach((idx) => p.vases.splice(idx, 1));
				addLog(`${p.username} arranged a bouquet ~`, data.id);
			}
		});

		listen('player finished arranging', (data) => {
			if (phase !== 4 || !data || !players[data.id] || arrangingFinished.has(data.id)) return;
			arrangingFinished.add(data.id);
			if (data.id === myID) isDone = true;
			if (myID === 0 && arrangingFinished.size >= numPlayers)
				socket.emit('end phase', { phase: 4 });
		});
		listen('autoplay toggled', (data) => {
			if (players[data.id]) players[data.id].isBot = data.newStatus;
			if (data.id === myID) autoplay = data.newStatus;
			queueAutomation();
		});

		selfInfo.useLocalStorage();
		socket.emit('join room', { roomID, username: get(selfInfo).username }, (result) => {
			if (!result?.successful) {
				goto('/boardgame/pakklongboard?error=noroomID');
				return;
			}
			joined = true;
			lobbyPlayers = result.players || [];
			selfInfo.update((value) => ({ ...value, roomID }));
		});
	});

	// ── Svelte View Controller Functions ───────────────────────────────────────────
	function handleSelectTimeToken(tokenVal) {
		if (phase !== 1 || isDone) return;
		selectedTimeToken = selectedTimeToken === tokenVal ? null : tokenVal;
	}

	function assignTimeToken(shopIdx, token = selectedTimeToken) {
		if (phase !== 1 || isDone || token === null || !getMyTimeTokens(players[myID]).includes(token))
			return;
		chosenTimeTokens = placePlanningToken(chosenTimeTokens, shopIdx, token);
		selectedTimeToken = null;
		notice = null;
		notification = '';
	}

	function handleRemoveTimeToken(shopIdx) {
		if (phase !== 1 || isDone) return;
		chosenTimeTokens[shopIdx] = null;
		chosenTimeTokens = [...chosenTimeTokens];
	}

	function submitTimePlanning() {
		if (phase !== 1 || isDone) return;
		const filledCount = chosenTimeTokens.filter((t) => t !== null).length;
		if (filledCount < 4) {
			addNoti('Assign at least 4 time tokens!', 'error');
			return;
		}
		const finalTokens = chosenTimeTokens.map((t) => (t === null ? 5 : t));
		isDone = true;
		socket.emit('submit time tokens', {
			id: myID,
			timeTokens: finalTokens
		});
	}

	function clickGoods(location, index) {
		if (currentPlayer !== myID || gameState !== 1) return;
		interactionShop = location;
		notice = null;
		// Verify eligibility
		if (location === 0 && (activeShop === 0 || phase === 0 || phase === 3)) {
			executePlayerAction(myID, 0, index);
		} else if (
			location >= 1 &&
			location <= 3 &&
			(activeShop === location || buyFlowerToolToken || phase === 0 || phase === 3)
		) {
			executePlayerAction(myID, location, index);
		} else if (location === 4 && (activeShop === 4 || phase === 0 || phase === 3)) {
			executePlayerAction(myID, 4, index);
		} else if (location === 5 && (activeShop === 5 || phase === 0 || phase === 3)) {
			executePlayerAction(myID, 5, index);
		} else if (location === 6 && (phase === 0 || phase === 3)) {
			executePlayerAction(myID, 6, index);
		}
		interactionShop = null;
	}

	function selectVaseToken(index) {
		if (phase !== 4 || isDone) return;
		if (selectedVasesIndices.includes(index)) {
			selectedVasesIndices = selectedVasesIndices.filter((i) => i !== index);
		} else {
			selectedVasesIndices = [...selectedVasesIndices, index];
		}
	}

	function selectFlowerCard(index) {
		if (phase !== 4 || isDone) return;
		selectedFlowerCardIndex = selectedFlowerCardIndex === index ? -1 : index;
	}

	function arrangeFlower() {
		if (phase !== 4 || isDone) return;
		notice = null;
		if (selectedFlowerCardIndex === -1) {
			addNoti('Select a flower card from hand!', 'error');
			return;
		}
		const card = players[myID].hand[selectedFlowerCardIndex];
		const vasesList = selectedVasesIndices.map((idx) => players[myID].vases[idx]);
		if (verifyArrangement(card, vasesList, chosenRibbons, getBonus(players[myID], 0))) {
			socket.emit('arrange flower', {
				id: myID,
				card: selectedFlowerCardIndex,
				indices: selectedVasesIndices,
				ribbons: chosenRibbons
			});
			selectedFlowerCardIndex = -1;
			selectedVasesIndices = [];
			chosenRibbons = 0;
			addNoti('Bouquet arranged!');
		}
	}

	function passTurn() {
		if (phase <= 3 && currentPlayer === myID) {
			executePlayerAction(myID, 0, -1);
		} else if (phase === 4 && !isDone) {
			isDone = true;
			addNoti('Waiting for other players to finish...');
			socket.emit('finish arranging', { id: myID });
		}
	}

	function triggerAutoplay() {
		if (gameState !== 1 || !players[myID]) return;
		autoplay = !autoplay;
		players[myID].isBot = autoplay;
		socket.emit('toggle autoplay', { id: myID, newStatus: autoplay });
		queueAutomation();
	}

	return {
		start() {
			if (joined && gameState === 0)
				socket.emit('start game', {
					numBots: Math.max(0, Math.min(6 - lobbyPlayers.length, Number(numBots)))
				});
		},
		get players() {
			return players;
		},
		get numBots() {
			return numBots;
		},
		get turn() {
			return turn;
		},
		get phase() {
			return phase;
		},
		get activeShop() {
			return activeShop;
		},
		get myID() {
			return myID;
		},
		get achievements() {
			return achievements;
		},
		get shops() {
			return shops;
		},
		get isDone() {
			return isDone;
		},
		get autoplaySpeed() {
			return autoplaySpeed;
		},
		setAutoplaySpeed(value) {
			if (![0.5, 1, 2, 4].includes(value)) return;
			autoplaySpeed = value;
			automationRevision++;
			pendingAutomation.clear();
			queueAutomation();
		},
		get autoplay() {
			return autoplay;
		},
		get gameState() {
			return gameState;
		},
		get currentPlayer() {
			return currentPlayer;
		},
		get selectedFlowerCardIndex() {
			return selectedFlowerCardIndex;
		},
		get selectedVasesIndices() {
			return selectedVasesIndices;
		},
		get chosenRibbons() {
			return chosenRibbons;
		},
		get chosenTimeTokens() {
			return chosenTimeTokens;
		},
		get selectedTimeToken() {
			return selectedTimeToken;
		},
		get notice() {
			return notice;
		},
		get turnOrder() {
			const order =
				phase === 2 ? (timeTokensByShop[activeShop] || []).map((token) => token.id) : tieBreak;
			return order.map((id) => players[id]).filter(Boolean);
		},
		get notification() {
			return notification;
		},
		get joined() {
			return joined;
		},
		get lobbyPlayers() {
			return lobbyPlayers;
		},
		get gameLogs() {
			return gameLogs;
		},
		get timeTokensByShop() {
			return timeTokensByShop;
		},
		set numBots(value) {
			numBots = Number(value);
		},
		set chosenRibbons(value) {
			chosenRibbons = Number(value);
		},
		get me() {
			return players[myID];
		},
		get canPass() {
			return (
				!isDone &&
				gameState === 1 &&
				(phase === 4 || ([0, 2, 3].includes(phase) && currentPlayer === myID))
			);
		},
		canShop(index) {
			return (
				gameState === 1 &&
				currentPlayer === myID &&
				([0, 3].includes(phase) ||
					(phase === 2 &&
						(activeShop === index || (buyFlowerToolToken && index >= 1 && index <= 3))))
			);
		},
		getMyTimeTokens,
		checkAchievement,
		handleSelectTimeToken,
		handleRemoveTimeToken,
		assignTimeToken,
		submitTimePlanning,
		clickGoods,
		selectVaseToken,
		selectFlowerCard,
		arrangeFlower,
		passTurn,
		triggerAutoplay
	};
}
