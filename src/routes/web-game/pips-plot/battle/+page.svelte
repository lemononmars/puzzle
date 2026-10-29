<script lang="ts">
	import { onMount, tick } from 'svelte';
	import DevilDiceBoard from '#lib/components/DevilDiceBoard.svelte';
	import PipMascot from '#lib/components/PipMascot.svelte';
	import PipAvatarPicker from '#lib/components/PipAvatarPicker.svelte';
	import DemonSoundIcon from '#lib/components/DemonSoundIcon.svelte';
	import {
		defaultAvatar,
		cleanAvatar,
		seedColors,
		leafColors,
		type Avatar
	} from '#lib/games/demonDiceAvatar.js';
	import {
		defaultBattleOptions,
		ownedPatterns,
		type BattleOptions
	} from '#lib/games/demonDiceBattle.js';
	import { shiftTime, canTransferAt, type Direction, type Die } from '#lib/games/devilDice.js';
	import { createMovementAudio } from '#lib/games/devilDiceAudio.js';
	import { createBackgroundMusic } from '#lib/games/demonDiceMusic.js';
	import type { DiceRoomView } from '#lib/server/demonDiceRooms.js';
	let room = $state<DiceRoomView | null>(null),
		token = '',
		code = $state(''),
		name = $state('Pip'),
		avatar = $state<Avatar>({ ...defaultAvatar }),
		options = $state<BattleOptions>({ ...defaultBattleOptions });
	let blocked = $state<{ direction: Direction; serial: number }>();
	let lastBlocked = 0;
	let battleArena = $state<HTMLElement>();
	let busy = $state(false),
		error = $state(''),
		notice = $state(''),
		ready = $state(false),
		muted = $state(false),
		reduced = $state(false),
		clock = $state(Date.now()),
		lastResponse = $state(0),
		clockOffset = $state(0);
	let held = $state<Direction | null>(null),
		sending = false,
		sequence = 0,
		alive = true;
	let audio: ReturnType<typeof createMovementAudio> | undefined,
		music = $state<ReturnType<typeof createBackgroundMusic>>();
	let match = $derived(room?.match ?? null),
		seat = $derived(room?.seat ?? 0),
		other = $derived(seat === 0 ? 1 : 0);
	let connected = $derived(!!room && clock - lastResponse < 3500),
		playing = $derived(match?.phase === 'playing');
	let board = $derived(
		match ? { ...shiftTime(match.board, clockOffset), player: match.players[seat].position } : null
	);
	let rival = $derived(
		match
			? {
					position: match.players[other].position,
					avatar: match.players[other].avatar,
					name: match.players[other].name
				}
			: undefined
	);
	let shareUrl = $derived(
		room && typeof window !== 'undefined'
			? `${window.location.origin}/web-game/pips-plot/battle?room=${room.code}`
			: ''
	);
	let seconds = $derived(
		match?.endsAt ? Math.max(0, Math.ceil((match.endsAt - (clock - clockOffset)) / 1000)) : null
	);
	const directions: Direction[] = ['up', 'left', 'down', 'right'];
	const keys: Record<string, Direction> = {
		ArrowUp: 'up',
		ArrowDown: 'down',
		ArrowLeft: 'left',
		ArrowRight: 'right',
		w: 'up',
		s: 'down',
		a: 'left',
		d: 'right'
	};
	$effect(() => {
		music?.setMuted(muted);
		music?.setActive(!!playing && connected);
	});
	function apply(view: DiceRoomView) {
		if (
			!alive ||
			!token ||
			view.code !== code.toUpperCase() ||
			(room && view.serverTime < room.serverTime)
		)
			return;
		if (
			room &&
			view.serverTime === room.serverTime &&
			(view.match?.revision ?? 0) < (room.match?.revision ?? 0)
		)
			return;
		const entering = view.match?.phase === 'playing' && room?.match?.phase !== 'playing';
		room = view;
		if (entering) void tick().then(() => battleArena?.focus({ preventScroll: true }));
		lastResponse = Date.now();
		clockOffset = Date.now() - view.serverTime;
		sequence = Math.max(sequence, view.nextSeq);
		error = '';
		if (view.match?.phase !== 'playing') held = null;
	}
	async function request(action?: Record<string, unknown>, creating = false) {
		const url = creating
			? '/api/demon-dice/battle'
			: `/api/demon-dice/battle/${code.trim().toUpperCase()}`;
		const response = await fetch(url, {
			method: action ? 'POST' : 'GET',
			headers: {
				'Content-Type': 'application/json',
				...(token ? { Authorization: `Bearer ${token}` } : {})
			},
			...(action ? { body: JSON.stringify(action) } : {}),
			cache: 'no-store'
		});
		const view = await response.json();
		if (!response.ok) throw Error(view.error ?? 'The room could not be reached.');
		return view;
	}
	async function enter(create: boolean, bot = false) {
		busy = true;
		error = '';
		try {
			const view = await request(
				{
					action: create ? 'create' : 'join',
					name,
					avatar,
					options,
					opponent: bot ? 'bot' : 'human'
				},
				create
			);
			token = view.token;
			code = view.code;
			try {
				sessionStorage.setItem(`demon-dice.room.${code}`, token);
				localStorage.setItem('demon-dice.avatar.v1', JSON.stringify({ name, avatar }));
			} catch {
				/* A room also works for this visit without browser storage. */
			}
			apply(view);
			history.replaceState(null, '', `?room=${code}`);
		} catch (e) {
			error = (e as Error).message;
		} finally {
			busy = false;
		}
	}
	async function action(value: Record<string, unknown>) {
		try {
			apply(await request(value));
		} catch (e) {
			error = (e as Error).message;
		}
	}
	async function sendMove(direction: Direction) {
		if (sending || !playing || !connected) return;
		sending = true;
		audio?.unlock();
		music?.unlock();
		try {
			const previous = room?.match?.board.moves ?? 0;
			const before = room!.match!.players[seat];
			const wasBoard = { ...room!.match!.board, player: before.position };
			const view = await request({ action: 'move', direction, holding: true, seq: ++sequence });
			apply(view);
			const position = view.match.players[seat].position;
			if (
				position.x !== before.position.x ||
				position.y !== before.position.y ||
				position.riding !== before.position.riding
			)
				audio?.play(
					(view.match.board.moves ?? 0) > previous
						? before.position.riding ||
							view.match.board.dice.some(
								(d: Die) =>
									d.kind === 'wood' &&
									wasBoard.dice.some((old) => old.id === d.id && (old.x !== d.x || old.y !== d.y))
							)
							? 'roll'
							: 'slide'
						: 'walk',
					atKind()
				);
			else if (
				view.serverTime >= before.cooldown &&
				!canTransferAt(wasBoard, direction, view.serverTime) &&
				Date.now() - lastBlocked >= 300
			) {
				lastBlocked = Date.now();
				blocked = { direction, serial: lastBlocked };
				audio?.play('blocked');
			}
		} catch (e) {
			error = (e as Error).message;
		} finally {
			sending = false;
		}
	}
	function atKind() {
		return (
			match?.board.dice.find(
				(d) => d.x === match.players[seat].position.x && d.y === match.players[seat].position.y
			)?.kind ?? 'normal'
		);
	}
	function release() {
		held = null;
		if (room) void action({ action: 'release' });
	}
	function movePointer(event: PointerEvent, direction: Direction) {
		event.preventDefault();
		(event.currentTarget as HTMLButtonElement).setPointerCapture(event.pointerId);
		held = direction;
		void sendMove(direction);
	}
	function keydown(event: KeyboardEvent) {
		event.stopPropagation();
		if (event.ctrlKey || event.metaKey || event.altKey) return;
		if (event.target instanceof HTMLElement && event.target.closest('input,select,textarea,dialog'))
			return;
		if (
			event.target instanceof HTMLElement &&
			event.target.closest('button') &&
			!event.target.closest('.dpad') &&
			event.code === 'Space' &&
			match?.phase !== 'finished'
		) {
			event.stopPropagation();
			return;
		}
		if (event.code === 'Space' || keys[event.key]) {
			event.preventDefault();
			event.stopPropagation();
		}
		if (event.code === 'Space' && match?.phase === 'finished' && seat === 0) {
			event.preventDefault();
			if (!event.repeat) void action({ action: room?.opponent === 'bot' ? 'start' : 'lobby' });
			return;
		}
		const direction = keys[event.key];
		if (direction && playing) {
			event.preventDefault();
			if (held !== direction) {
				held = direction;
				void sendMove(direction);
			}
		}
	}
	function keyup(event: KeyboardEvent) {
		event.stopPropagation();
		if (
			event.target instanceof HTMLElement &&
			event.target.closest('button,input,select,textarea')
		) {
			event.stopPropagation();
			return;
		}
		if (event.code === 'Space' || keys[event.key]) {
			event.preventDefault();
			event.stopPropagation();
		}
		if (keys[event.key] === held) release();
	}
	async function leave() {
		held = null;
		await action({ action: 'leave' });
		try {
			sessionStorage.removeItem(`demon-dice.room.${code}`);
		} catch {
			/* Optional browser storage. */
		}
		room = null;
		token = '';
		history.replaceState(null, '', window.location.pathname);
	}
	async function saveAvatar() {
		try {
			localStorage.setItem('demon-dice.avatar.v1', JSON.stringify({ name, avatar }));
		} catch {
			/* Optional browser storage. */
		}
		if (room) await action({ action: 'avatar', name, avatar });
		notice = 'Avatar saved.';
	}
	async function copyLink() {
		try {
			await navigator.clipboard.writeText(shareUrl);
			notice = 'Invite link copied.';
		} catch {
			notice = shareUrl;
		}
	}
	onMount(() => {
		alive = true;
		ready = true;
		audio = createMovementAudio();
		music = createBackgroundMusic('endless');
		const preference = matchMedia('(prefers-reduced-motion: reduce)');
		reduced = preference.matches;
		const change = () => (reduced = preference.matches);
		preference.addEventListener('change', change);
		try {
			const saved = JSON.parse(localStorage.getItem('demon-dice.avatar.v1') ?? 'null');
			if (saved) {
				name = String(saved.name ?? 'Pip').slice(0, 18);
				avatar = cleanAvatar(saved.avatar);
			}
			code = (new URLSearchParams(location.search).get('room') ?? '').toUpperCase();
			token = sessionStorage.getItem(`demon-dice.room.${code}`) ?? '';
			if (token && code)
				void request()
					.then(apply)
					.catch((e) => {
						error = e.message;
						token = '';
					});
		} catch {
			/* Optional browser storage. */
		}
		let polling = false;
		const poll = setInterval(async () => {
			if (!token || !code || polling) return;
			polling = true;
			try {
				apply(await request());
			} catch (e) {
				error = (e as Error).message;
			} finally {
				polling = false;
			}
		}, 220);
		const timer = setInterval(() => {
			clock = Date.now();
			if (held) void sendMove(held);
		}, 100);
		const gesture = () => music?.unlock();
		document.addEventListener('pointerdown', gesture);
		return () => {
			alive = false;
			clearInterval(poll);
			clearInterval(timer);
			preference.removeEventListener('change', change);
			document.removeEventListener('pointerdown', gesture);
			audio?.dispose();
			music?.dispose();
		};
	});
</script>

{#snippet roomActions()}<button class="btn btn-sm btn-ghost" onclick={leave}
		>{room?.opponent === 'bot' ? 'End battle' : 'Leave room'}</button
	><button
		class="btn btn-sm btn-ghost"
		aria-label={muted ? 'Sound off' : 'Sound on'}
		onclick={() => {
			muted = !muted;
			audio?.setMuted(muted);
		}}><DemonSoundIcon {muted} /></button
	>{/snippet}
<svelte:head><title>Pip's Plot · Battle</title></svelte:head>
<svelte:window onblur={release} />
<div class="battle-root">
	<a class="back botanical-muted" href="/web-game/pips-plot">← All modes</a>
	<h1>Garden battle</h1>
	{#if !room}<section class="botanical-surface battle-setup">
			<div class="customize">
				<div class="avatar-preview">
					<PipMascot
						seedColor={seedColors[avatar.seed]}
						leafColor={leafColors[avatar.leaves]}
						accessory={avatar.accessory}
					/>
				</div>
				<h2>Your Pip</h2>
				<label
					>Name<input
						disabled={!ready}
						class="input w-full"
						maxlength="18"
						bind:value={name}
					/></label
				>
				<PipAvatarPicker bind:avatar disabled={!ready} />
			</div>
			<div class="room-form">
				<h2>Choose your opponent</h2>
				<p>
					Share one field. Claim different face patterns, steal them with a new match or chain, and
					fill your premium gauge first.
				</p>
				<div class="settings">
					<label
						>Patterns to win<select disabled={!ready} class="select" bind:value={options.goal}
							><option value={3}>3</option><option value={4}>4</option><option value={5}>5</option
							></select
						></label
					><label
						>Time limit<select disabled={!ready} class="select" bind:value={options.minutes}
							><option value={3}>3 minutes</option><option value={5}>5 minutes</option><option
								value={0}>Unlimited</option
							></select
						></label
					><label
						>Field<select disabled={!ready} class="select" bind:value={options.size}
							><option value={7}>Regular · 7 × 7</option><option value={6}>Small · 6 × 6</option
							></select
						></label
					><label
						>Dice<select disabled={!ready} class="select" bind:value={options.kind}
							><option value="normal">Regular</option><option value="wood">Wood</option><option
								value="ice">Ice</option
							><option value="stone">Stone</option><option value="mixed">Mixed</option></select
						></label
					>
				</div>
				<button class="btn btn-primary" disabled={!ready || busy} onclick={() => enter(true, true)}
					>Play against bot</button
				><button class="btn" disabled={!ready || busy} onclick={() => enter(true)}
					>Create room</button
				>
				<div class="join">
					<input
						class="input"
						disabled={!ready}
						aria-label="Room code"
						placeholder="8-character room code"
						maxlength="8"
						bind:value={code}
					/><button
						class="btn"
						disabled={!ready || busy || code.length !== 8}
						onclick={() => enter(false)}>Join room</button
					>
				</div>
			</div>
		</section>
	{:else}<div class="room-bar">
			{#if room.opponent === 'bot'}<span>Playing against Fern · bot</span>{:else}<span
					>Room <strong data-testid="battle-room-code">{room.code}</strong></span
				><button class="btn btn-sm" onclick={copyLink}>Copy invite link</button
				>{/if}{#if !match}{@render roomActions()}{/if}
		</div>
		{#if !match}<section class="botanical-surface lobby">
				<h2>Meet in the garden</h2>
				<div class="players">
					{#each room.players as player, i}<div class="player-card">
							{#if player}<div class="small-avatar">
									<PipMascot
										seedColor={seedColors[player.avatar.seed]}
										leafColor={leafColors[player.avatar.leaves]}
										accessory={player.avatar.accessory}
									/>
								</div>
								<strong>{player.name}{i === seat ? ' · you' : ''}</strong><small
									>{player.connected
										? player.ready
											? 'Ready'
											: 'Not ready'
										: 'Disconnected'}</small
								>{:else}<strong>Waiting for a friend…</strong><small
									>Send them the invite link.</small
								>{/if}
						</div>{/each}
				</div>
				<p>
					First to own {room.options.goal} different face values wins. Each number counts once. Opponents
					can steal your premiums. Stone crushing wins immediately.
				</p>
				<button
					class="btn btn-primary"
					onclick={() => action({ action: 'ready', ready: !room!.players[seat]!.ready })}
					>{room.players[seat]?.ready ? 'Not ready' : 'Ready'}</button
				>{#if seat === 0}<button
						class="btn"
						disabled={!room.players.every((player) => player?.ready && player.connected)}
						onclick={() => action({ action: 'start' })}>Start battle</button
					>{/if}
				<details>
					<summary>Customize your avatar</summary>
					<div class="avatar-fields">
						<label>Name<input class="input" maxlength="18" bind:value={name} /></label
						><PipAvatarPicker bind:avatar disabled={!ready} /><button
							class="btn"
							onclick={saveAvatar}>Save avatar</button
						>
					</div>
				</details>
			</section>
		{:else}<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
			<section
				bind:this={battleArena}
				class="botanical-surface battle-arena"
				role="application"
				aria-label="Battle game"
				tabindex="0"
				onkeydown={keydown}
				onkeyup={keyup}
				onfocusout={(event) => {
					if (!battleArena?.contains(event.relatedTarget as Node | null)) release();
				}}
				onpointerdown={() => battleArena?.focus({ preventScroll: true })}
			>
				<div class="scoreboard">
					{#each match.players as player, i}<div class:you={i === seat}>
							<strong>{player.name}{i === seat ? ' · you' : ''}</strong>
							<div
								class="premiums"
								aria-label={`${player.name}: ${ownedPatterns(match, i as 0 | 1)} of ${match.options.goal} patterns`}
							>
								{#each [1, 2, 3, 4, 5, 6] as face}<span class:owned={match.premiums[face - 1] === i}
										>{face}</span
									>{/each}
							</div>
							<small
								>{ownedPatterns(match, i as 0 | 1)} / {match.options.goal}{ownedPatterns(
									match,
									i as 0 | 1
								) ===
								match.options.goal - 1
									? ' · Check!'
									: ''} · {player.points} points</small
							>
						</div>{/each}
				</div>
				<p class="match-clock">
					{seconds === null
						? 'No time limit'
						: `${Math.floor(seconds / 60)
								.toString()
								.padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`}
				</p>
				{#if board}<div class="battle-field">
						<DevilDiceBoard
							game={board}
							reducedMotion={reduced}
							avatar={match.players[seat].avatar}
							opponent={rival}
							{blocked}
							controlsInset={156}
							won={match.phase === 'finished' && match.winner === seat}
						/>{#if match.phase === 'finished'}<div
								class="result bg-base-100 text-base-content"
								role="status"
							>
								<strong
									>{match.winner === null
										? 'A garden draw'
										: `${match.players[match.winner].name} wins!`}</strong
								><span>{match.reason}</span>{#if seat === 0}<button
										class="btn btn-primary"
										onclick={() => action({ action: room?.opponent === 'bot' ? 'start' : 'lobby' })}
										>{room?.opponent === 'bot' ? 'Play again' : 'Back to lobby'} · Space</button
									>{:else}<span>Waiting for the host to return to the lobby.</span>{/if}
							</div>{/if}
						<div class="field-controller">
							<div class="dpad" aria-label="Battle movement controls">
								{#each directions as direction}<button
										class="btn {direction}"
										aria-label={`Move ${direction}`}
										disabled={!playing || !connected}
										onpointerdown={(event) => movePointer(event, direction)}
										onpointerup={release}
										onpointercancel={release}
										onclick={(event) => {
											if (event.detail === 0) void sendMove(direction);
										}}
										><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"
											><path d="M12 4 3.5 12.5H9V20h6v-7.5h5.5Z" fill="currentColor" /></svg
										></button
									>{/each}<span class="center" aria-hidden="true">•</span>
							</div>
							<div class="battle-actions">{@render roomActions()}</div>
						</div>
					</div>{/if}
			</section>{/if}
		{#if !connected}<p role="status">
				Reconnecting to the room…
			</p>{/if}{#if room.players[other] && !room.players[other]?.connected}<p role="status">
				Your friend is disconnected. They can reconnect within 30 seconds.
			</p>{/if}{/if}
	{#if error}<p class="alert alert-error" role="alert">{error}</p>{/if}{#if notice}<p role="status">
			{notice}
		</p>{/if}
	{#if !match}<p class="rule-note botanical-muted">
			Battle premiums follow <a
				class="link"
				href="https://wiki-origin.giantbomb.com/wiki/Games/Devil_Dice"
				target="_blank"
				rel="noreferrer">Devil Dice's Battle rules</a
			>. At a time limit or full field, more owned patterns wins; equal ownership is a draw.
		</p>{/if}
</div>

<style>
	.battle-root {
		max-width: 1050px;
		margin: auto;
		text-align: left;
	}
	.back {
		font-size: 12px;
	}
	.battle-root h1 {
		margin: 18px 0 24px;
	}
	.battle-setup {
		display: grid;
		grid-template-columns: 1fr 1.5fr;
		gap: 36px;
		padding: 30px;
	}
	.avatar-preview {
		width: 140px;
		height: 155px;
		margin: auto;
	}
	.avatar-fields,
	.settings {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
		margin: 18px 0;
	}
	label {
		display: grid;
		gap: 6px;
		font-size: 12px;
	}
	.select,
	.input {
		width: 100%;
		min-width: 0;
	}
	.room-form p,
	.lobby p {
		font-size: 14px;
		line-height: 1.8;
		margin: 14px 0;
	}
	.join {
		display: flex;
		gap: 8px;
		margin-top: 24px;
	}
	.room-bar {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 10px;
		margin-bottom: 16px;
	}
	.lobby,
	.battle-arena {
		padding: 24px;
	}
	.players {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		margin: 20px 0;
	}
	.player-card {
		display: grid;
		justify-items: center;
		align-content: center;
		gap: 10px;
		padding: 20px;
		border: 1px solid var(--color-base-300);
		border-radius: 20px;
	}
	.small-avatar {
		width: 80px;
		height: 90px;
	}
	.lobby details {
		margin-top: 20px;
	}
	.scoreboard {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		text-align: center;
	}
	.scoreboard > div {
		border: 1px solid var(--color-base-300);
		border-radius: 16px;
		padding: 12px;
	}
	.scoreboard .you {
		border-color: var(--color-primary);
		background: var(--color-base-200);
		color: var(--color-base-content);
	}
	.premiums {
		display: flex;
		gap: 6px;
		justify-content: center;
		margin: 10px 0;
	}
	.premiums span {
		width: 30px;
		height: 30px;
		display: grid;
		place-items: center;
		border: 1px solid var(--color-base-300);
		border-radius: 8px;
		opacity: 0.5;
	}
	.premiums .owned {
		background: var(--color-primary);
		color: var(--color-primary-content);
		opacity: 1;
	}
	small {
		font-size: 11px;
	}
	.match-clock {
		text-align: center;
		font-variant-numeric: tabular-nums;
		margin: 12px 0;
	}
	.battle-field {
		position: relative;
	}
	.result {
		position: absolute;
		inset: 10% 12%;
		display: grid;
		justify-items: center;
		align-content: center;
		gap: 18px;
		border: 1px solid var(--color-base-300);
		border-radius: 24px;
	}
	.result strong {
		font-size: 26px;
	}
	.result span {
		font-size: 13px;
	}
	.dpad {
		display: grid;
		grid-template-columns: repeat(3, 44px);
		grid-template-rows: repeat(3, 44px);
		gap: 5px;
		justify-content: center;
		margin-top: 14px;
	}
	.dpad .btn {
		width: 44px;
		height: 44px;
		padding: 0;
	}
	.up {
		grid-column: 2;
		grid-row: 1;
	}
	.left {
		grid-column: 1;
		grid-row: 2;
	}
	.right {
		grid-column: 3;
		grid-row: 2;
	}
	.down {
		grid-column: 2;
		grid-row: 3;
	}
	.right svg {
		rotate: 90deg;
	}
	.down svg {
		rotate: 180deg;
	}
	.left svg {
		rotate: -90deg;
	}
	.center {
		grid-row: 2;
		grid-column: 2;
		display: grid;
		place-items: center;
		background: var(--color-base-200);
		color: var(--color-base-content);
		border-radius: 12px;
	}
	.control-tip,
	.rule-note {
		font-size: 11px;
		text-align: center;
		margin: 16px 0;
		line-height: 1.8;
	}
	.alert {
		margin-top: 18px;
	}
	@media (max-width: 650px) {
		.battle-setup {
			grid-template-columns: 1fr;
			padding: 20px;
			gap: 20px;
		}
		.players {
			gap: 10px;
		}
		.player-card {
			padding: 12px;
		}
		.battle-arena {
			padding: 12px;
		}
		.premiums {
			gap: 3px;
		}
		.premiums span {
			width: 23px;
			height: 26px;
			font-size: 12px;
		}
		.scoreboard {
			gap: 8px;
		}
		.scoreboard > div {
			padding: 8px;
		}
		.scoreboard strong {
			font-size: 13px;
		}
		.room-bar strong {
			letter-spacing: 0.08em;
		}
		.result {
			inset: 10% 3%;
		}
		.avatar-fields {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.field-controller {
		position: absolute;
		left: 8px;
		right: 8px;
		bottom: 8px;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 8px;
	}
	.field-controller .dpad {
		margin: 0;
	}
	.battle-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		max-width: 145px;
		gap: 4px;
	}
	.battle-actions .btn {
		font-size: 11px;
	}
	.result {
		bottom: 166px;
	}
	@media (max-width: 540px) {
		.battle-field :global(.scene) {
			height: 420px;
		}
		.dpad {
			grid-template-columns: repeat(3, 38px);
			grid-template-rows: repeat(3, 38px);
			gap: 3px;
		}
		.dpad .btn {
			width: 38px;
			height: 38px;
		}
	}
</style>
