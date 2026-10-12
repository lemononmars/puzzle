<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { PlayerInfo, GameState } from '#lib/interfaces/jeopardy.js';
	import { CheckCircleIcon, XCircleIcon } from 'svelte-feather-icons';
	import { supabaseClient } from '#lib/supabase.js';
	import { storePlayerList } from '#lib/store/index.js';

	const channel = supabaseClient.channel('button');

	let answerQueue: string[] = [];

	let gameState: GameState = {
		round: 1,
		isLocked: true,
		isDouble: false,
		isWagering: false,
		isAnswering: false
	};

	let playerList: PlayerInfo[] = [];
	let initializing: boolean = true;

	const MAX_ANSWER: number = 5000;
	let answerTime: number = 0;
	let answerTimer: any = '';

	function getPlayer(name: string) {
		for (var p of playerList) {
			if (p.username === name) return p;
		}
		return playerList[0];
	}

	onMount(async () => {
		channel.on('broadcast', { event: 'pushButton' }, (payload) => {
			updateQueue(payload.payload.username);
		});

		channel.on('broadcast', { event: 'playerJoin' }, (payload) => {
			const newUsername = payload.payload.info.username;
			const dupe = playerList.some((p) => p.username == newUsername);
			if (!dupe) {
				playerList = [...playerList, payload.payload.info];
				$storePlayerList = JSON.stringify(playerList);
			}

			channel.send({
				type: 'broadcast',
				event: 'sharePlayerList',
				payload: { playerList }
			});

			updateGameState();
		});

		channel.on('broadcast', { event: 'playerLeave' }, (payload) => {
			const leftPlayerUsername = payload.payload.username;
			const leftId = playerList.findIndex((p) => p.username == leftPlayerUsername);
			if (leftId > -1) playerList.splice(leftId, 1);
			playerList = playerList;
			$storePlayerList = JSON.stringify(playerList);
		});

		channel.on('broadcast', { event: 'resendPlayerList' }, (payload) => {
			if (playerList.length > 0) return;
			playerList = payload.payload.playerList;
			$storePlayerList = JSON.stringify(playerList);
		});

		subscribe();

		document.addEventListener('visibilitychange', () => {
			if (!document.hidden && !channel) {
				subscribe();
			}
		});
		window.addEventListener('focus', () => {
			if (!channel) {
				subscribe();
			}
		});
	});

	function subscribe() {
		channel.subscribe(() => {
			channel.send({
				type: 'broadcast',
				event: 'hostReconnect'
			});
			initializing = false;
		});
	}

	function toggleLockButton() {
		gameState.isLocked = !gameState.isLocked;
		channel.send({
			type: 'broadcast',
			event: 'toggleLockButton',
			payload: { isLocked: gameState.isLocked }
		});
	}

	function resetButton() {
		answerQueue = [];
		gameState.isLocked = true;
		channel.send({
			type: 'broadcast',
			event: 'resetButton',
			payload: {}
		});
	}

	function correctAnswer() {
		if (answerQueue.length == 0) return;
		const p = getPlayer(answerQueue[0]);
		gameState.isDouble = false;
		updateScore(1, p.username);
		resetButton();
	}

	function wrongAnswer() {
		if (answerQueue.length == 0) return;
		const q = answerQueue.shift() || '';
		const p = getPlayer(q);
		updateScore(-1, p.username);
		answerQueue = answerQueue;
	}

	function updateScore(s: number, name: string) {
		clearTimeout(answerTimer);

		channel.send({
			type: 'broadcast',
			event: 'updateScore',
			payload: { score: s, username: name }
		});
	}

	function updateQueue(u: string) {
		if (answerQueue.length > 0) return;

		answerTime = MAX_ANSWER;
		answerTimer = setInterval(() => (answerTime -= 100), 100);
		setTimeout(() => {
			clearInterval(answerTimer);
			answerTime = 0;
		}, MAX_ANSWER);

		answerQueue = [...answerQueue, u];

		channel.send({
			type: 'broadcast',
			event: 'updateQueue',
			payload: { username: u }
		});
	}

	function updateGameState() {
		channel.send({
			type: 'broadcast',
			event: 'updateGameState',
			payload: { gameState }
		});
	}

	onDestroy(() => {
		supabaseClient.removeChannel(channel);
	});
</script>

<svelte:head>
	<title>Quiz Button | Host</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-2xl flex flex-col items-center gap-y-4">
	<h1 class="text-2xl font-bold text-center">Quiz Button Control (Host)</h1>

	{#if gameState.isLocked}
		<button
			class="btn w-64 text-xl btn-error"
			class:btn-outline={!gameState.isLocked}
			on:click={toggleLockButton}
		>
			End of question
		</button>
	{:else}
		<button class="btn w-64 text-xl btn-outline btn-accent" on:click={resetButton}>
			Next question
		</button>
	{/if}

	<div class="flex flex-wrap gap-2 min-h-[5rem] p-4 justify-center items-center bg-base-300 rounded-box w-full">
		{#if initializing}
			<div class="text-warning-content">Searching for players...</div>
		{:else}
			{#each playerList as p}
				<div class="btn btn-sm md:btn-md btn-secondary">{p.username}</div>
			{:else}
				<div class="btn btn-error btn-sm">No players connected</div>
			{/each}
		{/if}
	</div>

	{#if answerQueue.length > 0}
		<div class="flex flex-col items-center gap-y-4 w-full mt-4">
			<div class="join gap-2">
				<button class="join-item btn btn-lg btn-outline btn-success" on:click={correctAnswer}>
					<CheckCircleIcon size="36" />
				</button>
				<button class="join-item btn btn-lg btn-outline btn-error" on:click={wrongAnswer}>
					<XCircleIcon size="36" />
				</button>
			</div>

			{#key playerList}
				{#each answerQueue as a}
					{@const p = getPlayer(a)}
					<div class="btn btn-lg btn-warning">
						{p.username}
						{answerTime > 0
							? Math.floor(answerTime / 1000) + '.' + ((answerTime / 100) % 10) + ' s'
							: "Time's up!"}
					</div>
				{/each}
			{/key}
		</div>
	{/if}
</div>
