<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { PlayerInfo, GameState } from '#lib/interfaces/jeopardy.js';
	import { supabaseClient } from '#lib/supabase.js';
	import { username } from '#lib/store/index.js';

	const channel = supabaseClient.channel('button');

	let myInfo: PlayerInfo = {
		username: 'Player',
		color: 0,
		score: 0,
		wager: 0,
		answer: ''
	};

	let gameState: GameState = {
		round: 1,
		isLocked: false,
		isDouble: false,
		isWagering: false,
		isAnswering: false
	};

	let isLoggedIn: boolean = false;
	$: isConnected = !!channel;
	let isPushed: boolean = false;
	let pushable: boolean = true;
	let answerQueue: string[] = [];

	let statusText: string = 'READY';
	const MAX_ANSWER: number = 5000;
	const MAX_PENALTY: number = 250;
	let answerTime: number = 0;
	let answerTimer: any = '';
	let penaltyTime: number = 0;
	let penaltyTimer: any = '';

	function getPlayer(name: string) {
		for (var p of playerList) {
			if (p.username === name) return p;
		}
		return playerList[0];
	}

	function updateStatusText() {
		if (gameState.isLocked) statusText = 'LOCK';
		else if (answerQueue.length == 0) {
			if (!pushable) statusText = 'Wait...';
			else statusText = 'READY';
		} else if (answerQueue[0] === myInfo.username) statusText = 'Answer!';
		else statusText = answerQueue[0];
	}

	let playerList: PlayerInfo[] = [];
	let newUsername: string = $username !== 'code breaker' ? $username : '';

	onMount(async () => {
		channel.on('broadcast', { event: 'toggleLockButton' }, (payload) => {
			gameState.isLocked = payload.payload.isLocked;
			updateStatusText();
		});

		channel.on('broadcast', { event: 'resetButton' }, () => {
			resetQuestion();
		});

		channel.on('broadcast', { event: 'updateScore' }, (payload) => {
			const { score, username: userMsg } = payload.payload;
			const p = getPlayer(userMsg);
			if (p) p.score += parseInt(score);
			playerList = playerList;

			if (userMsg === myInfo.username) {
				clearInterval(penaltyTimer);
				clearInterval(answerTimer);
				penaltyTime = 0;
				answerTime = 0;
			}

			if (score > 0) {
				resetQuestion();
			} else {
				if (userMsg !== myInfo.username) pushable = true;
				answerQueue.shift();
				answerQueue = answerQueue;
				updateStatusText();
			}
		});

		channel.on('broadcast', { event: 'updateQueue' }, (payload) => {
			pushable = false;
			answerQueue = [...answerQueue, payload.payload.username];
			updateStatusText();
		});

		channel.on('broadcast', { event: 'updateGameState' }, (payload) => {
			gameState = payload.payload.gameState;
			updateStatusText();
		});

		channel.on('broadcast', { event: 'sharePlayerList' }, (payload) => {
			if (playerList.length > 1) return;
			playerList = payload.payload.playerList;
			for (var p of playerList) {
				if (p.username === myInfo.username) myInfo = p;
			}
		});

		channel.on('broadcast', { event: 'playerJoin' }, (payload) => {
			const joinedUsername = payload.payload.info.username;
			const dupe = playerList.some((p) => p.username == joinedUsername);
			if (dupe) return;

			playerList.push(payload.payload.info);
			playerList = playerList;
		});

		channel.on('broadcast', { event: 'playerLeave' }, (payload) => {
			const leftUsername = payload.payload.username;
			playerList = playerList.filter((p) => p.username !== leftUsername);
		});

		channel.on('broadcast', { event: 'hostReconnect' }, () => {
			channel.send({
				type: 'broadcast',
				event: 'resendPlayerList',
				payload: { playerList }
			});
		});

		document.addEventListener('visibilitychange', () => {
			if (!document.hidden && !channel) {
				login();
			}
		});
		window.addEventListener('focus', () => {
			if (!channel) {
				login();
			}
		});
	});

	function login() {
		if (!newUsername.trim()) return;
		myInfo = {
			username: newUsername,
			color: 0,
			score: 0,
			wager: 0,
			answer: ''
		};
		$username = newUsername;

		channel.subscribe((status) => {
			if (status !== 'SUBSCRIBED') return null;

			channel.send({
				type: 'broadcast',
				event: 'playerJoin',
				payload: { info: myInfo }
			});
		});

		isLoggedIn = true;
		playerList.push(myInfo);
		playerList = playerList;
	}

	function pushButton() {
		if (isPushed || !pushable) return;

		if (gameState.isLocked) {
			penaltyTime = MAX_PENALTY;
			penaltyTimer = setInterval(() => (penaltyTime -= 10), 10);
			setTimeout(() => {
				clearInterval(penaltyTimer);
				penaltyTime = 0;
			}, MAX_PENALTY);
			return;
		} else {
			isPushed = true;
			answerTime = MAX_ANSWER;
			answerTimer = setInterval(() => (answerTime -= 100), 100);
			setTimeout(() => {
				clearInterval(answerTimer);
				answerTime = 0;
			}, MAX_ANSWER);
		}

		channel.send({
			type: 'broadcast',
			event: 'pushButton',
			payload: { username: myInfo.username }
		});
	}

	function resetQuestion() {
		isPushed = false;
		pushable = true;
		gameState.isLocked = true;
		gameState.isDouble = false;
		answerQueue = [];
		clearInterval(answerTimer);
		updateStatusText();
	}

	onDestroy(() => {
		channel.send({
			type: 'broadcast',
			event: 'playerLeave',
			payload: { username: myInfo.username }
		});
		supabaseClient.removeChannel(channel);
		isLoggedIn = false;
	});
</script>

<svelte:head>
	<title>Quiz Button | Player</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-xl flex flex-col items-center gap-y-6">
	{#if isLoggedIn}
		{#if !isConnected}
			<div class="alert alert-warning">Reconnecting...</div>
		{/if}

		<div class="flex flex-row w-full justify-center items-center gap-3">
			<div class="btn btn-lg btn-outline btn-accent">{myInfo.username}</div>
		</div>

		<div class="flex flex-col w-full justify-center items-center gap-2 my-4">
			{#if !gameState.isAnswering && !gameState.isWagering && (!gameState.isDouble || answerQueue[0] !== myInfo.username)}
				{#if penaltyTime > 0}
					<div
						class="radial-progress bg-error text-error-content border-4 border-error w-56 h-56 text-3xl font-bold flex items-center justify-center"
						style="--value:{(penaltyTime * 100) / MAX_PENALTY};"
					>
						PENALTY
					</div>
				{:else if answerTime > 0}
					<div
						class="radial-progress bg-success text-success-content border-4 border-success w-56 h-56 text-3xl font-bold flex items-center justify-center"
						style="--value:{(answerTime * 100) / MAX_ANSWER};"
					>
						{Math.floor(answerTime / 1000)}.{((answerTime / 100) % 10)} s
					</div>
				{:else}
					<button
						class="btn btn-circle w-56 h-56 text-3xl font-bold shadow-2xl transition-all active:scale-95"
						class:btn-ghost={gameState.isLocked || (isPushed && !pushable)}
						class:btn-outline={gameState.isLocked || !pushable}
						class:btn-warning={isPushed}
						class:btn-success={pushable && !isPushed && !gameState.isLocked}
						on:click={pushButton}
					>
						{statusText}
					</button>
				{/if}
			{/if}
		</div>

		<div class="flex flex-wrap gap-2 p-4 justify-center items-center bg-base-300 rounded-box w-full">
			{#each playerList as p}
				<div class="btn btn-sm">{p.username}</div>
			{/each}
		</div>
	{:else}
		<!-- Login form -->
		<div class="card bg-base-200 shadow-xl border border-base-content/10 w-full max-w-sm">
			<div class="card-body items-center text-center p-8">
				<h2 class="card-title text-2xl font-bold mb-4">Enter Username</h2>
				<input
					class="input  text-2xl w-full text-center mb-6"
					type="text"
					placeholder="Username"
					bind:value={newUsername}
					on:keydown={(e) => e.key === 'Enter' && login()}
				/>
				<button class="btn btn-success btn-block text-lg" on:click={login}>Join Game</button>
			</div>
		</div>
	{/if}
</div>
