<script lang="ts">
	import { onMount, untrack, tick } from 'svelte';
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import DevilDiceBoard from '#lib/components/DevilDiceBoard.svelte';
	import DemonDieIcon from '#lib/components/DemonDieIcon.svelte';
	import DemonSoundIcon from '#lib/components/DemonSoundIcon.svelte';
	import PipMascot from '#lib/components/PipMascot.svelte';
	import PipLevelPicker from '#lib/components/PipLevelPicker.svelte';
	import type { Tutorial } from '#lib/games/devilDiceTutorials.js';
	import {
		loadCompleted,
		saveCompleted,
		loadTutorialBest,
		saveTutorialBest,
		loadRetroBest,
		saveRetroBest
	} from '#lib/games/demonDiceProgress.js';
	import { challengePuzzles, startChallenge } from '#lib/games/demonDiceChallenges.js';
	import { randomPuzzles, startRandom } from '#lib/games/pipsPlotRandom.js';
	import { loadRandomBest, saveRandomBest } from '#lib/games/demonDiceProgress.js';
	import { retroPuzzles, startRetro } from '#lib/games/demonDiceRetro.js';
	import { completionReady, movementDuration, inputCooldown } from '#lib/games/devilDiceVisuals.js';
	import { createMovementAudio, type MovementSound } from '#lib/games/devilDiceAudio.js';
	import { createBackgroundMusic } from '#lib/games/demonDiceMusic.js';
	import {
		clone,
		at,
		isClear,
		displayedMoves,
		move,
		heldMove,
		canTransferAt,
		puzzles,
		settle,
		start,
		startTrial,
		tickTrial,
		spawnDie,
		finishTrial,
		shiftTime,
		roll,
		scoreForLevel,
		type Direction,
		type Kind,
		type State
	} from '#lib/games/devilDice.js';
	let {
		mode,
		customPuzzle
	}: { mode: 'tutorials' | 'puzzles' | 'endless' | 'retro' | 'random'; customPuzzle?: Tutorial } =
		$props();
	const initial = () =>
		customPuzzle
			? clone({ ...customPuzzle.state, moves: 0, score: 0, cleared: 0, chainSerial: 0 })
			: mode === 'random'
				? startRandom(0)
				: mode === 'retro'
					? startRetro(0)
					: mode === 'puzzles'
						? startChallenge(0)
						: start(0);
	let game = $state(initial()),
		level = $state(0),
		session = $state(0);
	let phase = $state<'setup' | 'playing' | 'losing' | 'summary'>(
		untrack(() => (mode === 'endless' ? 'setup' : 'playing'))
	);
	let diceKind = $state<Kind | 'mixed'>('normal'),
		paused = $state(false),
		pausedAt = $state(0),
		lossAt = $state(0);
	let ready = $state(false),
		reducedMotion = $state(false),
		muted = $state(false);
	let history = $state<{ state: State; time: number }[]>([]);

	let hintDialog = $state<HTMLDialogElement>();
	let arena = $state<HTMLElement>();
	let typeDialog = $state<HTMLDialogElement>();
	let helpOpen = $state(false),
		helpAt = 0;
	let infoKinds = $state<Kind[]>([]),
		seenKinds: Kind[] = [];
	let lessonIntro = $state<'A1' | 'A5' | 'B1' | null>(null);
	const shownLessons = new Set<string>();
	const lessonGoals: Record<string, string> = {
		A1: 'Goal: push the two 2s together to clear the field.',
		A5: 'Goal: move a 1 beside a sinking group to clear every exposed 1.',
		B1: 'Goal: ride and roll your die to make two touching 2s.'
	};
	let tutorialBest = $state<Record<string, number>>({});
	let retroBest = $state<Record<string, number>>({});
	let randomBest = $state<Record<string, number>>({});
	let randomClearStars = $state(0);
	const typeHelp: Record<Kind, { title: string; text: string }> = {
		normal: {
			title: 'Regular dice',
			text: 'Push from the ground to slide without turning. Ride a die to roll it. Match touching faces in groups at least as large as their number. Push or roll a 1 beside a sinking die to activate Happy One.'
		},
		wood: {
			title: 'Wood dice',
			text: 'Wood rolls even when pushed from the ground. Read its side faces before choosing a direction.'
		},
		ice: {
			title: 'Ice dice',
			text: 'A ground push sends ice sliding until an edge or another die stops it. Ice can pass motion to another ice die. Each square traveled counts as a move. You can keep walking while it slides.'
		},
		stone: {
			title: 'Stone dice',
			text: 'Stone cannot be pushed from the ground. Climb or walk onto it, then ride it to roll.'
		},
		metal: {
			title: 'Metal dice',
			text: 'Metal never moves. Walk across it as a bridge, or bring matching dice to it to clear it.'
		}
	};
	let clock = $state(Date.now()),
		busyUntil = $state(0),
		maxChain = $state(1);
	let heldDirection = $state<Direction | null>(null),
		edgeSince = $state<number | null>(null);
	let heldSource: 'keyboard' | 'pointer' | null = null;
	let blocked = $state<{ direction: Direction; serial: number }>();
	let lastBlocked = 0;
	function blockedMove(direction: Direction) {
		const now = Date.now();
		if (now - lastBlocked < 300) return;
		lastBlocked = now;
		game = { ...game, player: { ...game.player, facing: direction } };
		blocked = { direction, serial: now };
		audio?.play('blocked');
	}
	let audio: ReturnType<typeof createMovementAudio> | undefined;
	let music = $state<ReturnType<typeof createBackgroundMusic>>();
	let pageVisible = $state(true);
	$effect(() => {
		music?.setMuted(muted);
		music?.setActive(phase === 'playing' && !paused && pageVisible);
	});
	const keys: Record<string, Direction> = {
		arrowup: 'up',
		w: 'up',
		arrowdown: 'down',
		s: 'down',
		arrowleft: 'left',
		a: 'left',
		arrowright: 'right',
		d: 'right'
	};
	let entries = $derived(
		customPuzzle
			? [customPuzzle]
			: mode === 'random'
				? randomPuzzles
				: mode === 'retro'
					? retroPuzzles
					: mode === 'puzzles'
						? challengePuzzles
						: puzzles
	);
	let budget = $derived(mode === 'endless' ? Infinity : (entries[level].maxMoves ?? Infinity));
	let motionUntil = $state(0);
	let renderingMotion = $state(false);
	let won = $derived(
		mode !== 'endless' && !helpOpen && completionReady(game, clock, motionUntil, renderingMotion)
	);
	let clearSoundSession = -1;
	$effect(() => {
		if (!isClear(game)) clearSoundSession = -1;
		if (won && ready && clearSoundSession !== session) {
			clearSoundSession = session;
			audio?.play('clear');
		}
	});
	let clearAt = $state<number | null>(null);
	let completed = $state<string[]>([]);
	let nextReady = $derived(won && clearAt !== null && clock - clearAt >= 800);
	$effect(() => {
		if (!won) randomClearStars = 0;
		else if (mode === 'random' && game.dice.length === 6)
			randomClearStars = game.dice.every((d) => d.top === 6) ? (game.moves <= 15 ? 2 : 1) : 0;
		if (
			ready &&
			won &&
			mode === 'retro' &&
			(retroBest[entries[level].id] === undefined || game.moves < retroBest[entries[level].id])
		) {
			retroBest = { ...retroBest, [entries[level].id]: game.moves };
			saveRetroBest(localStorage, retroBest);
		}
		if (
			ready &&
			won &&
			mode === 'random' &&
			game.dice.length === 6 &&
			game.dice.every((d) => d.top === 6) &&
			(randomBest[entries[level].id] === undefined || game.moves < randomBest[entries[level].id])
		) {
			randomBest = { ...randomBest, [entries[level].id]: game.moves };
			saveRandomBest(localStorage, randomBest);
		}
		if (won && clearAt === null) clearAt = Date.now();
		else if (!won && clearAt !== null) clearAt = null;
		if (
			ready &&
			won &&
			!customPuzzle &&
			mode !== 'endless' &&
			!completed.includes(entries[level].id)
		) {
			completed = [...completed, entries[level].id];
			try {
				saveCompleted(localStorage, mode, completed);
			} catch {
				/* Storage may be unavailable. */
			}
		}
		if (
			ready &&
			won &&
			mode === 'tutorials' &&
			(tutorialBest[entries[level].id] === undefined ||
				game.moves < tutorialBest[entries[level].id])
		) {
			tutorialBest = { ...tutorialBest, [entries[level].id]: game.moves };
			try {
				saveTutorialBest(localStorage, tutorialBest);
			} catch {
				/* Optional browser storage. */
			}
		}
	});
	let disabled = $derived(
		!ready || (mode !== 'endless' && isClear(game)) || phase !== 'playing' || paused || helpOpen
	);
	let earnedStars = $derived(
		mode === 'tutorials' && completed.includes(entries[level].id)
			? tutorialBest[entries[level].id] !== undefined && tutorialBest[entries[level].id] <= budget
				? 2
				: 1
			: 0
	);
	let elapsed = $derived(
		game.trial
			? Math.max(
					0,
					Math.floor(
						((game.trial.endedAt ?? (paused ? pausedAt : clock)) - game.trial.started) / 1000
					)
				)
			: 0
	);
	let nextLevelScore = $derived(scoreForLevel((game.trial?.level ?? 1) + 1));
	let baseLevelScore = $derived(scoreForLevel(game.trial?.level ?? 1));
	const formatTime = (seconds: number) =>
		`${Math.floor(seconds / 60)
			.toString()
			.padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
	const diceOptions = [
		{ kind: 'normal', name: 'Regular', description: 'Colorful faces' },
		{ kind: 'wood', name: 'Wood', description: 'Rolls when pushed' },
		{ kind: 'ice', name: 'Ice', description: 'Keeps sliding' },
		{ kind: 'stone', name: 'Stone', description: 'Ride to move' },
		{ kind: 'mixed', name: 'Mixed', description: 'A little of everything' }
	] as const;
	function endHold() {
		heldDirection = null;
		heldSource = null;
		edgeSince = null;
	}
	function reset() {
		endHold();
		history = [];

		hintDialog?.close();
		busyUntil = 0;
		clearAt = null;
		motionUntil = 0;
		renderingMotion = false;
		clock = Date.now();
		session++;
	}
	function load(index: number) {
		level = index;
		game = customPuzzle
			? initial()
			: mode === 'random'
				? startRandom(index)
				: mode === 'retro'
					? startRetro(index)
					: mode === 'puzzles'
						? startChallenge(index)
						: start(index);
		phase = 'playing';
		reset();
		void tick().then(() => {
			showTypeInfo(true);
			if (!helpOpen) arena?.focus({ preventScroll: true });
		});
	}
	function showTypeInfo(onlyNew = false) {
		if (mode !== 'tutorials') return;
		const lesson = entries[level].id;
		lessonIntro =
			(!onlyNew || !shownLessons.has(lesson)) &&
			(lesson === 'A1' || lesson === 'A5' || lesson === 'B1')
				? lesson
				: null;
		const kinds = [...new Set(game.dice.map((die) => die.kind))];
		infoKinds = onlyNew ? kinds.filter((kind) => !seenKinds.includes(kind)) : kinds;
		if (lessonIntro) infoKinds = infoKinds.filter((kind) => kind !== 'normal');
		if ((!infoKinds.length && !lessonIntro) || !typeDialog) return;
		endHold();
		helpAt = Date.now();
		helpOpen = true;
		typeDialog.showModal();
		if (lessonIntro) shownLessons.add(lessonIntro);
	}
	function closeTypeInfo() {
		if (!helpOpen) return;
		const delta = Date.now() - helpAt;
		game = shiftTime(game, delta);
		busyUntil += delta;
		if (motionUntil) motionUntil += delta;
		clock = Date.now();
		helpOpen = false;
		seenKinds = [
			...new Set([...seenKinds, ...infoKinds, ...(lessonIntro ? ['normal' as Kind] : [])])
		];
		try {
			localStorage.setItem('demon-dice.seen-types.v1', JSON.stringify(seenKinds));
		} catch {
			/* Optional browser storage. */
		}
	}
	function beginRun() {
		const now = Date.now();
		game = tickTrial(startTrial(now, diceKind), now);
		phase = 'playing';
		paused = false;
		pausedAt = 0;
		maxChain = 1;
		audio?.unlock();
		reset();
		void tick().then(() => {
			arena?.focus({ preventScroll: true });
			arena?.scrollIntoView({ block: 'start' });
		});
	}
	function endRun() {
		game = finishTrial(game, Date.now(), 'ended');
		phase = 'setup';
		paused = false;
		endHold();
	}
	function settings() {
		endHold();
		phase = 'setup';
		paused = false;
	}
	function pause() {
		if (mode !== 'endless' || phase !== 'playing') return;
		endHold();
		if (!paused) {
			pausedAt = Date.now();
			paused = true;
		} else {
			game = shiftTime(game, Date.now() - pausedAt);
			paused = false;
		}
	}
	function step(direction: Direction, holding = false) {
		if (disabled || Date.now() < busyUntil) return;
		const now = Date.now();
		let next = move(game, direction, false, now);
		if (!next && holding && canTransferAt(game, direction, now)) {
			edgeSince ??= now;
			next = heldMove(game, direction, now - edgeSince, now);
		} else if (!next) edgeSince = null;
		if (!next) {
			if (!canTransferAt(game, direction, now)) blockedMove(direction);
			return;
		}
		if ((mode === 'puzzles' || mode === 'retro' || mode === 'random') && next.moves > budget) {
			blockedMove(direction);
			return;
		}
		if (mode !== 'endless') history = [...history, { state: clone(game), time: now }];
		const moved = next.dice.filter((d) =>
			game.dice.some((old) => old.id === d.id && (old.x !== d.x || old.y !== d.y))
		);
		const sound: MovementSound = moved.length
			? game.player.riding || moved.some((d) => d.kind === 'wood')
				? 'roll'
				: 'slide'
			: 'walk';
		const soundedDie =
			moved[0] ?? (next.player.riding ? at(next, next.player.x, next.player.y) : undefined);
		audio?.play(sound, soundedDie?.kind ?? 'normal');
		motionUntil = Math.max(
			now + movementDuration(game, next, reducedMotion) + (reducedMotion ? 0 : 40),
			...next.dice
				.filter((d) => d.slide)
				.map((d) => d.slide!.started + d.slide!.duration + (reducedMotion ? 0 : 40))
		);
		busyUntil = now + inputCooldown(game, next, reducedMotion);
		renderingMotion ||= !reducedMotion && moved.length > 0;
		game = next;
		edgeSince = null;
	}
	function beginHold(direction: Direction, source: 'keyboard' | 'pointer') {
		if (disabled) return;
		if (heldDirection === direction && heldSource === source) return;
		endHold();
		heldDirection = direction;
		heldSource = source;
		audio?.unlock();
		step(direction, true);
	}
	function pointerDown(event: PointerEvent, direction: Direction) {
		if (event.button !== 0) return;
		event.preventDefault();
		(event.currentTarget as HTMLButtonElement).setPointerCapture(event.pointerId);
		beginHold(direction, 'pointer');
	}
	function clickArrow(event: MouseEvent, direction: Direction) {
		if (event.detail === 0) {
			audio?.unlock();
			step(direction);
		}
	}
	function toggleSound() {
		muted = !muted;
		audio?.setMuted(muted);
		if (!muted) audio?.unlock();
	}
	function undo() {
		endHold();
		const prior = history.at(-1);
		if (!prior || mode === 'endless') return;
		game = shiftTime(prior.state, Date.now() - prior.time);
		history = history.slice(0, -1);
		busyUntil = 0;
		motionUntil = 0;
		renderingMotion = false;
	}
	function gameAction(action: 'undo' | 'restart' | 'hint') {
		if (action === 'undo') undo();
		else if (action === 'restart') load(level);
		else hintDialog?.showModal();
	}
	function keydown(event: KeyboardEvent) {
		event.stopPropagation();
		const target = event.target;
		const key = event.key.toLowerCase();
		if (helpOpen || hintDialog?.open || event.ctrlKey || event.metaKey || event.altKey) return;
		if (
			target instanceof HTMLElement &&
			(target.isContentEditable || target.closest('input,select,textarea,summary,[data-game-ui]'))
		)
			return;
		if (
			event.code === 'Space' &&
			target instanceof HTMLElement &&
			target.closest('button') &&
			!target.closest('.dpad') &&
			!nextReady
		) {
			event.stopPropagation();
			return;
		}
		if (event.code === 'Space' || keys[key] || ['r', 'z', 'p'].includes(key)) {
			music?.unlock();
			event.preventDefault();
			event.stopPropagation();
		}
		if (
			(mode === 'tutorials' || mode === 'retro' || mode === 'random') &&
			event.code === 'Space' &&
			nextReady
		) {
			event.preventDefault();
			if (!event.repeat && level < entries.length - 1) load(level + 1);
			return;
		}
		if (mode !== 'endless' && (key === 'r' || key === 'z')) {
			event.preventDefault();
			if (!event.repeat) {
				if (key === 'r') load(level);
				else undo();
			}
			return;
		}
		if (mode === 'endless' && event.code === 'Space' && phase === 'playing' && !paused) {
			event.preventDefault();
			if (!event.repeat) {
				audio?.unlock();
				game = spawnDie(game, Date.now());
			}
			return;
		}
		if (
			target instanceof HTMLElement &&
			(target.isContentEditable ||
				target.closest('input,select,textarea,summary') ||
				(target.closest('button,a') && !target.closest('.dpad')))
		)
			return;
		if (keys[key]) {
			event.preventDefault();
			if (!event.repeat) beginHold(keys[key], 'keyboard');
		} else if (key === 'z') {
			event.preventDefault();
			undo();
		} else if (key === 'r' && mode !== 'endless') load(level);
		else if (key === 'p') pause();
	}
	function keyup(event: KeyboardEvent) {
		event.stopPropagation();
		if (
			event.target instanceof HTMLElement &&
			event.target.closest('button,input,select,textarea,[data-game-ui]')
		) {
			event.stopPropagation();
			return;
		}
		if (event.code === 'Space' || keys[event.key.toLowerCase()]) {
			event.preventDefault();
			event.stopPropagation();
		}
		if (heldSource === 'keyboard' && keys[event.key.toLowerCase()] === heldDirection) endHold();
	}
	onMount(() => {
		if (mode === 'retro') retroBest = loadRetroBest(localStorage);
		if (mode === 'random') randomBest = loadRandomBest(localStorage);
		if (mode === 'tutorials') {
			try {
				tutorialBest = loadTutorialBest(localStorage);
				const seen = JSON.parse(localStorage.getItem('demon-dice.seen-types.v1') ?? '[]');
				seenKinds = Array.isArray(seen) ? seen.filter((kind: Kind) => kind in typeHelp) : [];
			} catch {
				seenKinds = [];
			}
			void tick().then(() => {
				showTypeInfo(true);
				if (!helpOpen) arena?.focus({ preventScroll: true });
			});
		}
		if (mode !== 'endless') {
			try {
				completed = loadCompleted(
					localStorage,
					mode,
					entries.map((entry) => entry.id)
				);
			} catch {
				completed = [];
			}
		}
		ready = true;
		void tick().then(() => {
			if (!helpOpen) arena?.focus({ preventScroll: true });
		});
		audio = createMovementAudio();
		music = createBackgroundMusic(mode);
		pageVisible = !document.hidden;
		const startMusic = (event: Event) => {
			if (event instanceof KeyboardEvent && (event.ctrlKey || event.metaKey || event.altKey))
				return;
			music?.unlock();
		};
		document.addEventListener('pointerdown', startMusic);
		document.addEventListener('keydown', startMusic);
		const preference = matchMedia('(prefers-reduced-motion: reduce)');
		const update = () => {
			reducedMotion = preference.matches;
		};
		update();
		preference.addEventListener('change', update);
		const timer = setInterval(() => {
			clock = Date.now();
			if (helpOpen) return;
			if (mode === 'endless') {
				if (phase === 'losing') {
					if (clock - lossAt >= (reducedMotion ? 300 : 1700)) phase = 'summary';
					return;
				}
				if (phase !== 'playing' || paused) return;
				game = tickTrial(game, clock);
				maxChain = Math.max(maxChain, ...game.dice.map((d) => (d.chainStep ?? 0) + 1));
				if (game.trial?.over) {
					phase = 'losing';
					lossAt = clock;
					endHold();
					return;
				}
			} else if (
				game.dice.some((d) => d.slide || (d.sinking !== undefined && d.sinking <= clock))
			) {
				game = settle(game, clock);
			}
			if (heldDirection) {
				if (disabled) endHold();
				else step(heldDirection, true);
			}
		}, 40);
		const visibility = () => {
			pageVisible = !document.hidden;
			if (document.hidden) {
				endHold();
				if (mode === 'endless' && phase === 'playing' && !paused) pause();
			}
		};
		document.addEventListener('visibilitychange', visibility);
		return () => {
			clearInterval(timer);
			endHold();
			audio?.dispose();
			music?.dispose();
			document.removeEventListener('pointerdown', startMusic);
			document.removeEventListener('keydown', startMusic);
			preference.removeEventListener('change', update);
			document.removeEventListener('visibilitychange', visibility);
		};
	});
</script>

<svelte:head
	><title
		>{customPuzzle ? `${customPuzzle.title} · Pip's Plot` : "Pip's Plot"} · {mode === 'endless'
			? 'Endless'
			: mode === 'random'
				? 'Random'
				: mode === 'retro'
					? 'Retro'
					: mode === 'puzzles'
						? 'Puzzles'
						: 'Tutorials'}</title
	></svelte:head
>
<svelte:window
	onblur={() => {
		endHold();
	}}
/>
<div class="game-root" data-mode={mode} data-phase={phase}>
	{#if !customPuzzle}<a
			href={mode === 'retro' || mode === 'random' || mode === 'puzzles'
				? '/web-game/pips-plot/puzzles'
				: '/web-game/pips-plot'}
			class="back botanical-muted"
			>← {mode === 'retro' || mode === 'random' || mode === 'puzzles' ? 'Puzzles' : 'All modes'}</a
		>{/if}
	{#if mode === 'endless' && phase === 'setup'}
		<PageHeading
			eyebrow="PIP'S PLOT / ENDLESS"
			title="A little room to play"
			description="Choose your dice, then keep the field open for as long as you can."
		/>
		<section class="botanical-surface setup">
			<div class="setup-art" aria-hidden="true"><span>⚂</span><span>⚄</span><span>⚁</span></div>
			<div>
				<h2>Make it your kind of challenge.</h2>
				<fieldset class="dice-choices">
					<legend>Dice type</legend>
					<div>
						{#each diceOptions as option}<label
								class="dice-choice"
								class:selected={diceKind === option.kind}
								><input
									class="sr-only"
									type="radio"
									name="dice-type"
									value={option.kind}
									bind:group={diceKind}
									disabled={!ready}
								/><span class="choice-image"
									><DemonDieIcon kind={option.kind} label={`${option.name} die`} /></span
								><strong>{option.name}</strong><small>{option.description}</small></label
							>{/each}
					</div>
				</fieldset>
				<p class="botanical-muted">
					Watch for the ground glow: a new die rises there three seconds later. Ride, push, and
					chain matches to gain points. Each level brings dice faster.
				</p>
				<p class="botanical-muted">
					Arrows / WASD to move. Hold briefly at a low edge to climb or drop. Forming dice give you
					plenty of time to hop aboard.
				</p>
				<div class="setup-actions">
					<button class="btn btn-primary" disabled={!ready} onclick={beginRun}>Start Endless</button
					><button
						class="btn btn-ghost"
						aria-pressed={!muted}
						aria-label={muted ? 'Sound off' : 'Sound on'}
						title={muted ? 'Turn sound on' : 'Turn sound off'}
						onclick={toggleSound}><DemonSoundIcon {muted} /></button
					>
				</div>
				{#if game.trial?.over}<p class="botanical-muted">
						Last run: {game.score.toLocaleString()} points · Level {game.trial.level}.
						<button class="btn btn-sm btn-ghost" onclick={() => (phase = 'summary')}
							>View summary</button
						>
					</p>{/if}
			</div>
		</section>
	{:else if mode === 'endless' && phase === 'summary'}
		<PageHeading
			eyebrow="PIP'S PLOT / YOUR RUN"
			title={game.trial?.reason === 'full' ? 'Packed to the pips!' : 'A good little run.'}
			description={game.trial?.reason === 'full'
				? 'The last die settled in. There is always room for another try.'
				: 'Take a breather, change your dice, or start another run.'}
		/>
		<section class="botanical-surface summary" aria-label="Run summary">
			<div class="dizzy" aria-hidden="true"><PipMascot bloom /></div>
			<div class="summary-stats">
				<div><span>Score</span><strong>{game.score.toLocaleString()}</strong></div>
				<div><span>Level</span><strong>{game.trial?.level ?? 1}</strong></div>
				<div><span>Survived</span><strong>{formatTime(elapsed)}</strong></div>
				<div><span>Cleared</span><strong>{game.cleared}</strong></div>
				<div><span>Best chain</span><strong>×{maxChain}</strong></div>
			</div>
			<div class="setup-actions">
				<button class="btn btn-primary" onclick={beginRun}>Retry</button><button
					class="btn"
					onclick={settings}>Back to settings</button
				>
			</div>
		</section>
	{:else}
		{#if mode === 'puzzles' && !customPuzzle}<PageHeading
				eyebrow="PIP'S PLOT / PUZZLES"
				title="Make every roll count"
				description="Twenty garden challenges. Meet each move limit using different dice mechanics."
			/>{:else}<h1 class="sr-only">
				{customPuzzle
					? customPuzzle.title
					: `Pip's Plot ${mode === 'endless' ? 'Endless' : mode === 'retro' ? 'Retro' : mode === 'random' ? 'Random' : 'Tutorials'}`}
			</h1>{/if}
		<div class="game-layout" class:endless={mode === 'endless'}>
			<!-- The game intentionally owns arrow/Space input and is reachable by Tab. -->
			<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
			<section
				bind:this={arena}
				class="botanical-surface arena"
				aria-label="Dice game"
				role="application"
				tabindex="0"
				onkeydown={keydown}
				onkeyup={keyup}
				onfocusout={(event) => {
					if (!arena?.contains(event.relatedTarget as Node | null)) endHold();
				}}
				onpointerdown={(event) => {
					if (!(event.target as HTMLElement).closest('[data-game-ui]'))
						arena?.focus({ preventScroll: true });
				}}
			>
				{#if mode === 'endless'}<div class="hud">
						<div>
							<span>Score</span><strong data-testid="endless-score"
								>{game.score.toLocaleString()}</strong
							>
						</div>
						<div>
							<span>Level</span><strong data-testid="endless-level">{game.trial?.level ?? 1}</strong
							>
						</div>
						<div>
							<span>Time</span><strong data-testid="endless-time">{formatTime(elapsed)}</strong>
						</div>
					</div>
					<div class="level-progress">
						<progress
							class="progress progress-primary"
							aria-label="Progress to next level"
							max={nextLevelScore - baseLevelScore}
							value={game.score - baseLevelScore}
						></progress><small class="botanical-muted"
							>{nextLevelScore - game.score} points to level {(game.trial?.level ?? 1) + 1}</small
						>
					</div>
				{:else if !customPuzzle}<div class="arena-top">
						<PipLevelPicker
							{entries}
							{level}
							{completed}
							best={mode === 'random' ? randomBest : mode === 'retro' ? retroBest : tutorialBest}
							random={mode === 'random'}
							tutorial={mode === 'tutorials'}
							onselect={load}
						/>
					</div>
				{/if}
				<div class="board-wrap">
					{#if mode === 'tutorials' && lessonGoals[entries[level].id]}<p class="lesson-goal">
							{lessonGoals[entries[level].id]}
						</p>{/if}
					{#if mode === 'endless' && game.dice.length < 8}<p class="spawn-tip">
							Press <kbd>Space</kbd> to spawn a die
						</p>{/if}
					{#if mode !== 'endless'}<span
							class="move-countdown bg-base-100 text-base-content"
							aria-label={mode === 'tutorials' ? 'Moves and target' : 'Moves remaining'}
							aria-live="polite"
							>{#if mode === 'tutorials'}<span data-testid="tutorial-moves"
									>{displayedMoves(game, clock)}</span
								><small> / {budget}</small><span
									class="saved-stars"
									aria-label={`${earnedStars} of 2 stars earned`}
									>{'★'.repeat(earnedStars)}{'☆'.repeat(2 - earnedStars)}</span
								>{:else}{Math.max(0, budget - displayedMoves(game, clock))}{/if}</span
						>{/if}
					{#key session}<DevilDiceBoard
							onMotionChange={(moving) => {
								renderingMotion = moving;
							}}
							{game}
							{blocked}
							controlsInset={156}
							{reducedMotion}
							paused={paused || helpOpen || phase === 'losing'}
							lost={phase === 'losing'}
							{won}
						/>{/key}
					{#if phase === 'losing'}<div class="loss-toast" role="status">
							Oh, dice! <span>One cube too cozy.</span>
						</div>{/if}
					{#if paused}<div class="pause-overlay">
							<button class="btn btn-primary" onclick={pause}>Resume game</button>
						</div>{/if}
					{#if won}<div class="clear-overlay" role="status" aria-live="polite">
							<div class="clear-card">
								<strong
									>Clear{#if mode === 'tutorials'}<span
											class="clear-stars"
											aria-label={`${game.moves <= budget ? 2 : 1} of 2 stars`}
											>{game.moves <= budget ? '★★' : '★☆'}</span
										>{:else if mode === 'random' && randomClearStars > 0}<span
											class="clear-stars"
											aria-label="Sixes finish stars">{randomClearStars === 2 ? '★★' : '★'}</span
										>{:else if mode === 'retro' && game.moves < budget}<span
											class="clear-stars"
											aria-label="Completed below the move limit">★</span
										>{/if}</strong
								>{#if nextReady}{#if level < entries.length - 1}<button
											class="btn btn-primary"
											onclick={() => load(level + 1)}>Next level</button
										>{:else}<a
											class="btn btn-primary"
											href={customPuzzle ? '/web-game/pips-plot/workshop' : '/web-game/pips-plot'}
											>{customPuzzle ? 'Return to workshop' : 'All modes'}</a
										>{/if}{/if}
							</div>
						</div>{/if}
					<div class="controls" aria-busy={clock < busyUntil} data-ready-at={busyUntil}>
						<div class="dpad" aria-label="Movement controls">
							{#each ['up', 'left', 'down', 'right'] as direction}<button
									class="btn {direction}"
									class:btn-primary={heldDirection === direction}
									aria-label={`Move ${direction}`}
									aria-pressed={heldDirection === direction}
									{disabled}
									onpointerdown={(event) => pointerDown(event, direction as Direction)}
									onpointerup={endHold}
									onpointercancel={endHold}
									onlostpointercapture={endHold}
									onclick={(event) => clickArrow(event, direction as Direction)}
									><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"
										><path d="M12 4 3.5 12.5H9V20h6v-7.5h5.5Z" fill="currentColor" /></svg
									></button
								>{/each}
							<span class="dpad-center" aria-hidden="true"></span>
						</div>
						<div class="actions">
							<button
								class="btn btn-ghost"
								aria-pressed={!muted}
								aria-label={muted ? 'Sound off' : 'Sound on'}
								title={muted ? 'Turn sound on' : 'Turn sound off'}
								onclick={toggleSound}><DemonSoundIcon {muted} /></button
							>{#if mode === 'endless'}<button
									class="btn btn-ghost"
									disabled={phase === 'losing'}
									onclick={pause}>{paused ? 'Resume' : 'Pause'}</button
								><button class="btn btn-ghost" disabled={phase === 'losing'} onclick={endRun}
									>End run</button
								>{:else}<button
									class="btn btn-ghost"
									disabled={!history.length}
									onclick={undo}
									aria-keyshortcuts="z">Undo <kbd>Z</kbd></button
								><button class="btn btn-ghost" onclick={() => load(level)} aria-keyshortcuts="r"
									>Restart <kbd>R</kbd></button
								><button class="btn btn-ghost" onclick={() => gameAction('hint')}>Hint</button
								>{#if mode === 'tutorials'}<button
										class="btn btn-ghost"
										aria-label="Dice information"
										onclick={() => showTypeInfo()}>ⓘ</button
									>{/if}{/if}
						</div>
					</div>
				</div>
			</section>
		</div>
	{/if}
	{#if mode === 'random'}<details class="retro-credits botanical-muted">
			<summary>Random garden · AAA–JJJ</summary>
			<p>
				1,000 original puzzles inspired by Devil Dice’s Random mode. Six normal dice, a 4×4 field,
				20 moves. Every board has a verified solution connecting six sixes in 15 moves or fewer.
				Finish with sixes for ★; use 15 moves or fewer for ★★.
			</p>
		</details>{/if}
	{#if mode === 'retro'}<details class="retro-credits botanical-muted">
			<summary>Devil Dice / XI · Shift, 1998</summary>
			<p>
				The original 100 puzzle boards, recreated for Pip’s Plot. Original game developed by Shift;
				published by Sony Computer Entertainment and THQ. Independent adaptation, with Pip’s Plot’s
				controls and timing.
			</p>
			<p>
				Board and orientation research: <a
					class="link"
					href="https://www.youtube.com/watch?v=Um5NdG5McKI"
					target="_blank"
					rel="noreferrer">BigSilentRob Retro Gaming’s playthrough</a
				>
				and
				<a
					class="link"
					href="https://scrapbox.io/alea-area/XI(sái)_基本パズル一覧"
					target="_blank"
					rel="noreferrer">aLea-aRea’s board catalogue</a
				>. Occluded faces were reconstructed from physical dice and solution constraints; fully
				hidden stationary faces use a consistent physical orientation. Original artwork and audio
				are not used.
			</p>
		</details>{/if}
</div>

{#if mode === 'tutorials'}<dialog
		bind:this={typeDialog}
		class="modal"
		aria-label="Meet the dice"
		onclose={closeTypeInfo}
	>
		<div class="modal-box bg-base-100 text-base-content">
			{#if lessonIntro === 'A1'}<h2>How to win</h2>
				<p>
					Clear every die from the field. Bring equal top faces together: two 2s, three 3s, and so
					on. Matched dice sink slowly. For this first lesson, walk right and push one 2 beside the
					other. You win as soon as every die is matched.
				</p>
			{:else if lessonIntro === 'A5'}<h2>Happy One</h2>
				<p>
					Ones do not match each other. First match the 2s. While they are sinking, push or roll a 1
					beside that group. This clears all exposed 1s, including distant ones. A 1 supporting Pip
					is protected.
				</p>
				<div class="roll-example">
					<DemonDieIcon
						orientation={{ top: 2, north: 1, east: 3 }}
						label="A sinking pair of 2s"
					/><span> + </span><DemonDieIcon
						orientation={{ top: 1, north: 2, east: 3 }}
						label="Move a 1 beside the sinking pair"
					/>
				</div>
			{:else if lessonIntro === 'B1'}<h2>How to roll</h2>
				<p>
					When Pip is on a die, moving toward an empty square rolls the die. The side face becomes
					the top. In this lesson, roll right to turn the 3 into a 2.
				</p>
				<div class="roll-example">
					<figure>
						<DemonDieIcon
							orientation={{ top: 3, north: 1, east: 5 }}
							label="Before rolling: top 3, west 2"
						/>
						<figcaption>Before · 3 on top</figcaption>
					</figure>
					<span aria-hidden="true">→</span>
					<figure>
						<DemonDieIcon
							orientation={roll({ top: 3, north: 1, east: 5 }, 'right')}
							label="After rolling right: top 2"
						/>
						<figcaption>After · 2 on top</figcaption>
					</figure>
				</div>{/if}
			{#each infoKinds as kind}<div class="type-help">
					<div class="type-picture"><DemonDieIcon {kind} label={typeHelp[kind].title} /></div>
					<div>
						<h2>{typeHelp[kind].title}</h2>
						<p>{typeHelp[kind].text}</p>
					</div>
				</div>{/each}
			<form method="dialog" class="modal-action"><button class="btn btn-primary">OK</button></form>
		</div>
	</dialog>{/if}
{#if mode !== 'endless'}<dialog bind:this={hintDialog} class="modal" aria-label="Tutorial hint">
		<div class="modal-box bg-base-100 text-base-content">
			<h2>{entries[level].id} · {entries[level].title}</h2>
			<p>{entries[level].hint}</p>
			<form method="dialog" class="modal-action"><button class="btn">Close</button></form>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button aria-label="Close hint">Close</button>
		</form>
	</dialog>{/if}

<style>
	.retro-credits {
		max-width: 700px;
		margin: 12px auto 0;
		font-size: 12px;
	}
	.retro-credits summary {
		cursor: pointer;
		text-align: center;
	}
	.retro-credits p {
		margin-top: 8px;
	}
	.lesson-goal {
		position: absolute;
		left: 12px;
		right: 95px;
		bottom: 8px;
		z-index: 1;
		text-align: center;
		font-size: 12px;
		line-height: 1.5;
		color: var(--color-base-content);
	}
	.roll-example {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 22px;
		margin: 18px 0;
	}
	.roll-example :global(svg) {
		width: 90px;
		height: 100px;
	}
	.roll-example figure {
		display: grid;
		justify-items: center;
		gap: 8px;
	}
	.roll-example figcaption {
		font-size: 12px;
	}
	.roll-example > span {
		font-size: 25px;
	}
	.saved-stars {
		display: block;
		text-align: center;
		padding-left: 2px;
		font-size: 14px;
		line-height: 1.4;
		letter-spacing: 2px;
		color: var(--color-secondary);
	}
	.move-countdown small {
		font-size: 18px;
		opacity: 0.65;
	}
	.clear-stars {
		display: block;
		text-align: center;
		font-size: 22px;
		color: var(--color-secondary);
	}
	.actions kbd {
		font-size: 10px;
		opacity: 0.6;
		border: 1px solid var(--color-base-300);
		border-radius: 4px;
		padding: 0 4px;
	}
	.spawn-tip {
		position: absolute;
		bottom: 8px;
		left: 0;
		right: 0;
		z-index: 1;
		text-align: center;
		font-size: 12px;
	}
	.type-help {
		display: flex;
		gap: 18px;
		align-items: center;
		margin-bottom: 20px;
	}
	.type-help .type-picture {
		width: 70px;
		height: 75px;
		flex: none;
	}
	.type-help p {
		font-size: 14px;
		line-height: 1.7;
	}

	.dice-choices {
		margin: 18px 0;
	}
	.dice-choices legend {
		font-size: 13px;
		margin-bottom: 12px;
	}
	.dice-choices > div {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 8px;
	}
	.dice-choice {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		border: 1px solid var(--color-base-300);
		border-radius: 16px;
		padding: 10px 6px;
		cursor: pointer;
		background: var(--color-base-100);
		color: var(--color-base-content);
	}
	.dice-choice.selected {
		border-color: var(--color-primary);
		background: var(--color-base-200);
	}
	.dice-choice:has(input:focus-visible) {
		outline: 3px solid var(--color-primary);
		outline-offset: 3px;
	}
	.choice-image {
		width: 55px;
		height: 60px;
	}
	.dice-choice strong {
		font-size: 12px;
		font-weight: 500;
	}
	.dice-choice small {
		font-size: 10px;
		text-align: center;
		opacity: 0.65;
		line-height: 1.5;
	}
	@media (max-width: 640px) {
		.dice-choices > div {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	.game-root {
		position: relative;
		isolation: isolate;
	}
	.game-root::before {
		content: '';
		position: absolute;
		inset: -26px -24px -40px;
		z-index: -1;
		pointer-events: none;
		border-radius: 36px;
		background:
			radial-gradient(
				ellipse at 0 20%,
				color-mix(in srgb, var(--color-primary) 14%, transparent),
				transparent 42%
			),
			radial-gradient(
				ellipse at 100% 80%,
				color-mix(in srgb, var(--color-accent) 18%, transparent),
				transparent 45%
			);
	}
	.move-countdown {
		font-size: 36px;
		line-height: 1;
		font-weight: 500;
		border-radius: 18px;
		min-width: 60px;
		text-align: center;
		position: absolute;
		right: 12px;
		top: 12px;
		z-index: 1;
		border: 1px solid var(--color-base-300);
		padding: 12px;
		font-variant-numeric: tabular-nums;
	}
	.clear-overlay {
		position: absolute;
		inset: 0;
		display: grid;
		pointer-events: none;
		border-radius: 20px;
	}
	.clear-card {
		display: grid;
		grid-template-rows: auto 1fr auto;
		justify-items: center;
		padding: 10px 16px;
	}
	.clear-card :is(button, a) {
		grid-row: 3;
		pointer-events: auto;
	}
	.clear-card strong {
		grid-row: 1;
		font-size: 32px;
		font-weight: 500;
	}
	.modal-box h2 {
		font-size: 20px;
		margin-bottom: 16px;
	}
	.modal-box p {
		font-size: 14px;
		line-height: 1.9;
	}
	.dpad-center {
		grid-column: 2;
		grid-row: 2;
		display: grid;
		place-items: center;
		background: var(--color-base-200);
		color: var(--color-base-content);
		border-radius: 14px;
	}
	.dpad-center::after {
		content: '';
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: currentColor;
		opacity: 0.3;
	}
	.dpad svg {
		flex: none;
	}
	.right svg {
		transform: rotate(90deg);
	}
	.down svg {
		transform: rotate(180deg);
	}
	.left svg {
		transform: rotate(-90deg);
	}

	.back {
		display: inline-block;
		font-size: 12px;
		margin-bottom: 18px;
	}
	.game-layout {
		display: block;
		max-width: 900px;
		margin: auto;
		text-align: left;
	}
	.game-layout.endless {
		display: block;
		max-width: 900px;
		margin: auto;
	}
	.arena,
	.setup,
	.summary {
		box-shadow: none;
	}
	.arena:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 3px;
	}
	.arena {
		padding: 22px;
		min-width: 0;
	}
	.arena-top {
		display: flex;
		justify-content: center;
		gap: 12px;
		align-items: center;
	}
	.board-wrap {
		position: relative;
	}
	.hud {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr;
		gap: 16px;
	}
	.hud span,
	.summary-stats span {
		display: block;
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.09em;
	}
	.hud strong {
		font-size: 26px;
		font-variant-numeric: tabular-nums;
	}
	.level-progress {
		display: grid;
		gap: 5px;
		margin-top: 10px;
	}
	.level-progress small {
		font-size: 10px;
		text-align: right;
	}
	.level-progress .progress {
		height: 5px;
	}
	.controls {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 24px;
	}
	.dpad {
		display: grid;
		grid-template-columns: repeat(3, 44px);
		gap: 5px;
		flex-shrink: 0;
		touch-action: none;
		user-select: none;
	}
	.dpad .btn {
		width: 44px;
		height: 44px;
		font-size: 22px;
		padding: 0;
	}
	.up {
		grid-row: 1;
		grid-column: 2;
	}
	.left {
		grid-column: 1;
		grid-row: 2;
	}
	.down {
		grid-column: 2;
		grid-row: 3;
	}
	.right {
		grid-column: 3;
		grid-row: 2;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		max-width: 280px;
	}
	.setup {
		display: grid;
		grid-template-columns: 1fr 1.3fr;
		gap: 40px;
		padding: 40px;
		max-width: 920px;
		margin: auto;
		text-align: left;
	}
	.setup h2 {
		font-size: 1.5rem;
	}
	.setting {
		display: grid;
		gap: 8px;
		font-size: 12px;
		margin: 22px 0;
	}
	.setup p {
		font-size: 13px;
		line-height: 1.9;
		margin: 14px 0;
	}
	.setup-actions {
		display: flex;
		gap: 12px;
		justify-content: center;
		flex-wrap: wrap;
		margin-top: 25px;
	}
	.setup .setup-actions {
		justify-content: flex-start;
	}
	.setup-art {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0;
		color: var(--color-primary);
	}
	.setup-art span {
		font-size: 95px;
		transform: rotate(-12deg);
	}
	.setup-art span:nth-child(2) {
		color: var(--color-secondary);
		transform: translateY(-35px) rotate(12deg);
	}
	.summary {
		padding: 35px;
		max-width: 780px;
		margin: auto;
	}
	.dizzy {
		width: 110px;
		height: 130px;
		margin: auto;
		font-size: 70px;
		color: var(--color-primary);
		text-align: center;
	}
	.summary-stats {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 20px;
		text-align: center;
		margin: 20px 0;
	}
	.summary-stats strong {
		font-size: 27px;
	}
	.pause-overlay {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		background: color-mix(in srgb, var(--color-base-100) 65%, transparent);
		border-radius: 20px;
	}
	.loss-toast {
		position: absolute;
		inset: auto 15% 20%;
		padding: 18px;
		border-radius: 20px;
		background: var(--color-secondary);
		color: var(--color-secondary-content);
		font-size: 23px;
		text-align: center;
		animation: loss-pop 650ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	.loss-toast span {
		display: block;
		font-size: 12px;
	}
	@keyframes loss-pop {
		from {
			transform: translateY(15px) scale(0.8);
			opacity: 0;
		}
		to {
			transform: none;
			opacity: 1;
		}
	}
	button:focus-visible {
		outline: 3px solid var(--color-accent);
		outline-offset: 3px;
	}
	@media (max-width: 850px) {
		.game-layout {
			grid-template-columns: 1fr;
		}
		.setup {
			gap: 20px;
			padding: 25px;
		}
		.setup-art span {
			font-size: 70px;
		}
	}
	@media (max-width: 540px) {
		.arena {
			padding: 16px;
		}
		.controls {
			gap: 12px;
		}
		.actions {
			max-width: 180px;
		}
		.actions .btn {
			font-size: 12px;
		}
		.setup {
			grid-template-columns: 1fr;
		}
		.setup-art {
			padding-top: 20px;
		}
		.setup-art span {
			font-size: 80px;
		}
		.summary-stats {
			grid-template-columns: repeat(3, 1fr);
		}
		.summary {
			padding: 24px;
		}
		.loss-toast {
			inset: auto 7% 20%;
		}
		.hud strong {
			font-size: 22px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.loss-toast {
			animation: none;
		}
	}

	.controls {
		position: absolute;
		left: 8px;
		right: 8px;
		bottom: 8px;
		justify-content: space-between;
		align-items: flex-end;
		gap: 8px;
		z-index: 4;
	}
	.actions {
		display: grid;
		grid-template-columns: repeat(2, auto);
		max-width: 210px;
		gap: 3px;
	}
	.actions .btn {
		min-height: 32px;
		height: 32px;
		font-size: 12px;
		padding: 0 7px;
	}
	.clear-card {
		padding-bottom: 160px;
	}
	@media (max-width: 540px) {
		.game-root::before {
			inset: -20px 0 -30px;
		}
		.dpad {
			grid-template-columns: repeat(3, 38px);
			gap: 3px;
		}
		.dpad .btn {
			width: 38px;
			height: 38px;
		}
		.actions {
			max-width: 148px;
		}
		.actions .btn {
			font-size: 11px;
			padding: 0 5px;
		}
	}
</style>
