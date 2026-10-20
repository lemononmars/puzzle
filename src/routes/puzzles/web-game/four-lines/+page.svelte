<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Volume2 from '@lucide/svelte/icons/volume-2';
	import VolumeX from '@lucide/svelte/icons/volume-x';
	import Undo2 from '@lucide/svelte/icons/undo-2';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import FourLinesCanvas from '#lib/components/FourLinesCanvas.svelte';
	import {
		inspectPath,
		pointAtDistance,
		progressMarkers,
		type Point
	} from '#lib/four-lines/geometry.ts';

	let points: Point[] = $state([]);
	let pageElement: HTMLDivElement;
	let boardShell: HTMLDivElement;
	let boardSize = $state<number | undefined>();
	onMount(() => {
		const measure = () => {
			const top = boardShell.getBoundingClientRect().top + window.scrollY;
			const bottomSpace = window.matchMedia('(max-width: 1023px)').matches ? 80 : 16;
			boardSize = Math.max(
				100,
				Math.min(
					pageElement.clientWidth,
					(window.visualViewport?.height ?? window.innerHeight) - top - bottomSpace
				)
			);
		};
		const observer = new ResizeObserver(measure);
		observer.observe(pageElement);
		window.addEventListener('resize', measure);
		window.visualViewport?.addEventListener('resize', measure);
		measure();
		return () => {
			observer.disconnect();
			window.removeEventListener('resize', measure);
			window.visualViewport?.removeEventListener('resize', measure);
		};
	});
	let cursor: Point = $state({ x: 480, y: 480 });
	let preview = $state(false);
	let playing = $state(false);
	let progress = $state(-1);
	let frame = 0;
	let soundEnabled = $state(true);
	let audio: AudioContext | undefined;
	const tones = new Set<OscillatorNode>();
	const result = $derived(inspectPath(points));
	const passed = $derived(
		progress < 0 ? [] : result.orderedHits.filter((hit) => hit.distance <= progress)
	);
	const progressOneCrossed = $derived(
		progress >= 0 &&
			result.hits.some((hit) => hit.id === 'progress-one' && hit.distance <= progress)
	);
	const marker = $derived(pointAtDistance(points, Math.max(0, progress)));
	const line = $derived(points.map((point) => `${point.x},${point.y}`).join(' '));
	const message = $derived(
		points.length < 5
			? `เลือกจุดที่ ${points.length + 1} จาก 5 จุด · วาดแล้ว ${Math.max(0, points.length - 1)} / 4 เส้น`
			: playing
				? `กำลังตรวจเส้นทาง · ผ่านแล้ว ${passed.length} / 10`
				: result.valid
					? 'สำเร็จ! ผ่านเลข 1–10 ตามลำดับด้วยเส้นตรง 4 เส้น'
					: `ผ่านแล้ว ${passed.length} / 10 · ลองย้อนกลับหรือเริ่มใหม่`
	);

	function stop() {
		cancelAnimationFrame(frame);
		for (const tone of tones) {
			try {
				tone.stop();
			} catch {
				/* Already ended. */
			}
		}
		tones.clear();
		playing = false;
		progress = -1;
	}
	function prepareAudio() {
		if (!soundEnabled) return;
		try {
			audio ??= new AudioContext();
			void audio.resume().catch(() => {});
		} catch {
			/* Drawing works without audio. */
		}
	}
	function playTone(frequency: number, delay = 0, duration = 0.18) {
		if (!soundEnabled || !audio || audio.state === 'closed') return;
		const oscillator = audio.createOscillator(),
			gain = audio.createGain();
		const start = audio.currentTime + delay;
		oscillator.type = 'sine';
		oscillator.frequency.value = frequency;
		gain.gain.setValueAtTime(0, start);
		gain.gain.linearRampToValueAtTime(0.075, start + 0.012);
		gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
		oscillator.connect(gain);
		gain.connect(audio.destination);
		tones.add(oscillator);
		oscillator.onended = () => {
			tones.delete(oscillator);
			oscillator.disconnect();
			gain.disconnect();
		};
		oscillator.start(start);
		oscillator.stop(start + duration + 0.02);
	}
	function revealSound(value: number, delay = 0) {
		playTone(440 * 2 ** ((value - 1) / 18), delay);
	}
	function toggleSound() {
		soundEnabled = !soundEnabled;
		if (!soundEnabled) {
			for (const tone of tones) {
				try {
					tone.stop();
				} catch {}
			}
			tones.clear();
		}
	}
	function reset() {
		stop();
		points = [];
		preview = false;
	}
	function undo() {
		stop();
		points = points.slice(0, -1);
		preview = false;
	}
	function play() {
		if (points.length !== 5) return;
		stop();
		prepareAudio();
		progress = 0;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			progress = result.total;
			// Avoid a burst of ten sounds with the static reduced-motion result.
			if (result.orderedHits.length) revealSound(result.orderedHits.at(-1)!.value);
			return;
		}
		playing = true;
		let start: number | undefined;
		let revealedCount = 0;
		const duration = Math.max(3000, result.total * 1.2);
		const tick = (now: number) => {
			start ??= now;
			progress = Math.min(result.total, ((now - start) / duration) * result.total);
			const count = result.orderedHits.filter((hit) => hit.distance <= progress).length;
			for (let i = revealedCount; i < count; i++)
				revealSound(result.orderedHits[i].value, (i - revealedCount) * 0.06);
			revealedCount = count;
			if (now - start < duration) frame = requestAnimationFrame(tick);
			else playing = false;
		};
		frame = requestAnimationFrame(tick);
	}
	function choose(point: Point) {
		if (points.length >= 5 || playing) return;
		if (points.length && Math.hypot(point.x - points.at(-1)!.x, point.y - points.at(-1)!.y) < 2)
			return;
		points = [...points, { ...point }];
		cursor = { ...point };
		preview = false;
		if (points.length === 5) play();
		prepareAudio();
		// A short rising placement cue, separate from the number-reveal melody.
		// Play after starting traversal so its cleanup cannot cut off dot five.
		playTone(330 * 2 ** ((points.length - 1) / 6), 0, 0.1);
	}
	function fromPointer(event: PointerEvent | MouseEvent): Point {
		const rect =
			event.currentTarget instanceof Element ? event.currentTarget.getBoundingClientRect() : null;
		if (!rect) return cursor;
		return {
			x: Math.max(0, Math.min(960, ((event.clientX - rect.left) / rect.width) * 960)),
			y: Math.max(0, Math.min(960, ((event.clientY - rect.top) / rect.height) * 960))
		};
	}
	function keydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			preview = false;
			return;
		}
		if (event.key === 'Backspace' || event.key === 'Delete') {
			event.preventDefault();
			undo();
			return;
		}
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			choose(cursor);
			return;
		}
		const direction: Record<string, Point> = {
			ArrowLeft: { x: -1, y: 0 },
			ArrowRight: { x: 1, y: 0 },
			ArrowUp: { x: 0, y: -1 },
			ArrowDown: { x: 0, y: 1 }
		};
		if (direction[event.key]) {
			event.preventDefault();
			const step = event.shiftKey ? 1 : 10,
				delta = direction[event.key];
			cursor = {
				x: Math.max(0, Math.min(960, cursor.x + delta.x * step)),
				y: Math.max(0, Math.min(960, cursor.y + delta.y * step))
			};
			preview = true;
		}
	}
	onDestroy(() => {
		if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(frame);
		void audio?.close().catch(() => {});
	});
</script>

<svelte:head>
	<title>Four Lines</title>
	<meta name="description" content="เลือก 5 จุด ลากเส้นตรงต่อเนื่อง 4 เส้น ผ่านเลข 1–10 ตามลำดับ" />
</svelte:head>

<div class="game-page" bind:this={pageElement}>
	<PageHeading title="Four Lines" />
	<div class="toolbar">
		<p role="status" aria-live="polite">{message}</p>
		<div class="actions join" role="group" aria-label="ควบคุมปริศนา">
			<button
				class="btn btn-sm btn-outline join-item"
				aria-pressed={soundEnabled}
				onclick={toggleSound}
				aria-label="เสียงเมื่อพบตัวเลข"
				>{#if soundEnabled}<Volume2 size={16} aria-hidden="true" />{:else}<VolumeX
						size={16}
						aria-hidden="true"
					/>{/if}{soundEnabled ? 'เสียง: เปิด' : 'เสียง: ปิด'}</button
			>
			<button class="btn btn-sm btn-outline join-item" onclick={undo} disabled={!points.length}
				><Undo2 size={16} aria-hidden="true" />ย้อนกลับ</button
			>
			<button class="btn btn-sm btn-outline join-item" onclick={reset} disabled={!points.length}
				><RotateCcw size={16} aria-hidden="true" />เริ่มใหม่</button
			>
		</div>
	</div>
	<div
		class="board-shell"
		bind:this={boardShell}
		style:--board-size={boardSize ? `${boardSize}px` : 'min(100%, calc(100svh - 230px))'}
	>
		<ul class="sr-only" aria-label="เลขที่ผ่านตามลำดับ">
			{#each progressMarkers as marker}<li>
					{marker.value === 1 || passed.some((hit) => hit.value === marker.value)
						? marker.value
						: 'วงกลมว่าง'}
				</li>{/each}
		</ul>
		<button
			class="board"
			aria-label="กระดานลากเส้น เลือกจุดเริ่มต้นและจุดต่อไปจนครบ 5 จุด"
			onclick={(event) => choose(fromPointer(event))}
			onpointermove={(event) => {
				if (event.pointerType !== 'touch') {
					cursor = fromPointer(event);
					preview = true;
				}
			}}
			onpointerleave={() => (preview = false)}
			onfocus={() => (preview = true)}
			onblur={() => (preview = false)}
			onkeydown={keydown}
		>
			<FourLinesCanvas revealed={passed.map((hit) => hit.id)} />
			<svg viewBox="0 0 960 960" aria-hidden="true">
				<polyline points={line} class="ink" />
				<g class="number-progress">
					{#each progressMarkers as item}
						{@const reached =
							item.value === 1
								? progressOneCrossed
								: passed.some((hit) => hit.value === item.value)}
						<g
							class="progress-item"
							class:reached
							class:number-one={item.value === 1}
							transform={`translate(${item.x},${item.y})`}
						>
							<circle r="16" />
							{#if item.value === 1 || reached}<text data-progress-value={item.value} y="1"
									>{item.value}</text
								>{/if}
							{#if item.value < 10}<text class="progress-arrow" x="48" y="1">→</text>{/if}
						</g>
					{/each}
				</g>
				{#if preview && points.length > 0 && points.length < 5}
					<line
						x1={points.at(-1)!.x}
						y1={points.at(-1)!.y}
						x2={cursor.x}
						y2={cursor.y}
						class="ghost"
					/>
				{/if}
				{#each points as point, index}
					{#if !(Math.abs(point.x - progressMarkers[0].x) < 20 && Math.abs(point.y - progressMarkers[0].y) < 20 && progressOneCrossed)}
						<circle class="vertex" cx={point.x} cy={point.y} r="6" />
						{#if index === 0}<circle class="start" cx={point.x} cy={point.y} r="12" />{/if}
					{/if}
				{/each}
				{#if progress >= 0}<circle class="traveller" cx={marker.x} cy={marker.y} r="9" />{/if}
				{#if preview && points.length < 5}<circle
						class="cursor"
						cx={cursor.x}
						cy={cursor.y}
						r="9"
					/>{/if}
			</svg>
		</button>
	</div>
</div>

<style>
	.game-page {
		max-width: 820px;
		margin: 0 auto;
		padding: 0;
	}
	.toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		flex-wrap: wrap;
		margin-bottom: 12px;
	}
	.toolbar p {
		font-size: 14px;
		flex: 1 1 260px;
	}
	.actions {
		display: flex;
		gap: 0;
		flex-wrap: nowrap;
	}
	.actions :global(.btn) {
		font-size: 12px;
		padding-inline: 8px;
		gap: 4px;
	}
	.board-shell {
		width: min(100%, var(--board-size));
		margin-inline: auto;
		border-radius: 12px;
		overflow: hidden;
		border: 1px solid var(--color-base-300);
	}
	.board {
		display: block;
		width: 100%;
		aspect-ratio: 1;
		padding: 0;
		border: 0;
		background: #faf2f3;
		cursor: crosshair;
		position: relative;
		touch-action: manipulation;
	}
	.board:focus-visible {
		outline: 4px solid var(--color-primary);
		outline-offset: -4px;
	}
	.board > svg {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
	}
	.ink,
	.ghost {
		fill: none;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	/* These strokes overlay a fixed pale illustration, so use fixed contrasting puzzle ink. */
	.ink {
		stroke: #315e51;
		stroke-width: 5;
		opacity: 0.85;
	}
	.ghost {
		stroke: #315e51;
		stroke-width: 4;
		stroke-dasharray: 10 9;
		opacity: 0.55;
	}
	.vertex {
		fill: #fff;
		stroke: #315e51;
		stroke-width: 3;
	}
	.traveller {
		fill: #a52268;
		stroke: #fff;
		stroke-width: 3;
	}
	.start,
	.cursor {
		fill: none;
		stroke: #315e51;
		stroke-width: 3;
	}
	.cursor {
		stroke-dasharray: 4 4;
	}
	.progress-item circle {
		fill: var(--color-base-100);
		stroke: var(--color-base-300);
		stroke-width: 2;
	}
	.progress-item text {
		fill: var(--color-base-content);
		font: 24px sans-serif;
		text-anchor: middle;
		dominant-baseline: middle;
	}
	.progress-item .progress-arrow {
		font-size: 20px;
		opacity: 0.55;
	}
	.progress-item.reached circle {
		fill: var(--color-primary);
		stroke: var(--color-primary);
	}
	.progress-item.reached text:not(.progress-arrow) {
		fill: var(--color-primary-content);
	}
	.progress-item.number-one.reached circle {
		fill: var(--color-base-100);
		stroke: #a52268;
	}
	.progress-item.number-one.reached text:not(.progress-arrow) {
		fill: #a52268;
		font-weight: 700;
		filter: drop-shadow(0 0 4px #f4a8cd);
	}
</style>
