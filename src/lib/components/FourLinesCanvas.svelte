<script lang="ts">
	import { onMount } from 'svelte';
	import { targets, ARTWORK_OFFSET_Y } from '#lib/four-lines/geometry.ts';

	let { revealed = [] }: { revealed?: string[] } = $props();
	let canvas: HTMLCanvasElement;
	let artwork: HTMLCanvasElement | undefined = $state();
	let failed = $state(false);

	onMount(() => {
		let cancelled = false;
		const image = new Image();
		image.onload = () => {
			if (cancelled) return;
			const layer = document.createElement('canvas');
			layer.width = 960;
			layer.height = 870;
			const context = layer.getContext('2d')!;
			context.drawImage(image, 0, 0);
			const pixels = context.getImageData(0, 0, 960, 870);
			// Extract the original glyphs, keeping their exact shapes and positions.
			// Pale dotted guides and paper become transparent; the footer is cropped.
			for (let y = 0; y < 870; y++) {
				for (let x = 0; x < 960; x++) {
					const i = (y * 960 + x) * 4;
					const [r, g, b] = pixels.data.subarray(i, i + 3);
					const max = Math.max(r, g, b),
						min = Math.min(r, g, b);
					const ink = max < 190 && max - min < 45;
					pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = 20;
					pixels.data[i + 3] = ink ? Math.min(255, (190 - max) * 4) : 0;
				}
			}
			context.putImageData(pixels, 0, 0);
			artwork = layer;
		};
		image.onerror = () => {
			if (!cancelled) failed = true;
		};
		image.src = '/puzzles/four-lines/202115.jpg';
		return () => {
			cancelled = true;
		};
	});

	$effect(() => {
		if (!artwork || !canvas) return;
		const context = canvas.getContext('2d')!;
		context.clearRect(0, 0, 960, 960);
		context.fillStyle = '#faf2f3';
		context.fillRect(0, 0, 960, 960);
		context.drawImage(artwork, 0, ARTWORK_OFFSET_Y);
		for (const id of revealed) {
			if (id === 'progress-one') continue; // Drawn by the interactive SVG progress row.
			const target = targets.find((target) => target.id === id);
			if (!target) continue;
			const [left, top, right, bottom] = target.box;
			// Keep the upper vowel of หัก untouched when revealing the base หก.
			const padding = id === 'thai-six' ? 0 : 3;
			const x = left - padding,
				y = top - padding,
				width = right - left + padding * 2,
				height = bottom - top + padding * 2;
			const highlight = document.createElement('canvas');
			highlight.width = width;
			highlight.height = height;
			const ink = highlight.getContext('2d')!;
			ink.drawImage(artwork, x, y - ARTWORK_OFFSET_Y, width, height, 0, 0, width, height);
			ink.globalCompositeOperation = 'source-in';
			ink.fillStyle = '#a52268';
			ink.fillRect(0, 0, width, height);
			context.save();
			context.shadowColor = '#f4a8cd';
			context.shadowBlur = 9;
			context.drawImage(highlight, x, y);
			context.restore();
		}
	});
</script>

<canvas bind:this={canvas} width="960" height="960" aria-hidden="true"></canvas>
{#if failed}<span class="load-error" role="alert">โหลดภาพไม่สำเร็จ กรุณารีเฟรชหน้า</span>{/if}

<style>
	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	.load-error {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
	}
</style>
