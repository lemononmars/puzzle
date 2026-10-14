<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { buildWordList, splitSlots, diffSlots } from '#lib/wordladder/wordladder.js';
	import dictJson from '#lib/dict.json';

	type SlotSize = 3 | 4 | 5 | 6;

	let slotSize: SlotSize = 3;
	let loading = false;
	let components: string[][] = [];   // sorted largest-first
	let wordCount = 0;
	let isolatedCount = 0;

	// ── Union-Find ─────────────────────────────────────────────
	function buildComponents(words: string[]): string[][] {
		const n = words.length;
		const parent = Int32Array.from({ length: n }, (_, i) => i);
		const rank   = new Int32Array(n);

		function find(x: number): number {
			while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
			return x;
		}
		function union(a: number, b: number) {
			a = find(a); b = find(b);
			if (a === b) return;
			if (rank[a] < rank[b]) { const t = a; a = b; b = t; }
			parent[b] = a;
			if (rank[a] === rank[b]) rank[a]++;
		}

		// Pre-compute splits once
		const splits = words.map(splitSlots);

		// O(n²) adjacency
		for (let i = 0; i < n; i++) {
			for (let j = i + 1; j < n; j++) {
				if (diffSlots(splits[i], splits[j]) === 1) union(i, j);
			}
		}

		// Group by root
		const groups = new Map<number, string[]>();
		for (let i = 0; i < n; i++) {
			const r = find(i);
			if (!groups.has(r)) groups.set(r, []);
			groups.get(r)!.push(words[i]);
		}

		return [...groups.values()].sort((a, b) => b.length - a.length);
	}

	async function compute(n: SlotSize) {
		loading = true;
		components = [];
		await new Promise(r => setTimeout(r, 20));

		const words = buildWordList(dictJson as string[], n);
		wordCount = words.length;
		const comps = buildComponents(words);
		components = comps;
		isolatedCount = comps.filter(c => c.length === 1).length;
		loading = false;
	}

	onMount(() => compute(slotSize));

	function changeSize(n: number) {
		if (n === slotSize && !loading) return;
		slotSize = n as SlotSize;
		compute(slotSize);
	}

	// Show/collapse large components
	let expanded = new Set<number>();
	function toggle(i: number) {
		if (expanded.has(i)) expanded.delete(i);
		else expanded.add(i);
		expanded = expanded;
	}

	const PREVIEW = 30;
</script>

<svelte:head>
	<title>Word Graph – Connected Components | Code Breaker</title>
	<meta name="description" content="กราฟคำภาษาไทย — แสดง connected components สำหรับคำ 3-6 ช่อง" />
</svelte:head>

<div class="container mx-auto px-4 py-6 max-w-3xl flex flex-col gap-5">

	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="flex flex-col gap-1">
			<h1 class="text-3xl font-extrabold tracking-tight text-primary">
				Word Graph
			</h1>
			<p class="text-base-content/70 text-sm">กลุ่มคำที่เชื่อมกันได้โดยเปลี่ยนทีละหนึ่งช่อง (connected components)</p>
		</div>
		<a
			href="/puzzles/wordladder"
			class="px-3 py-1.5 rounded-lg text-xs font-bold bg-base-100 text-base-content border border-base-300 text-base-content/70 hover:bg-base-100 text-base-content transition-colors flex items-center gap-1 shrink-0"
		>
			← กลับไปยังเกม
		</a>
	</div>

	<!-- Slot-size selector -->
	<div class="flex gap-2">
		{#each [3, 4, 5, 6] as n}
			<button
				on:click={() => changeSize(n)}
				class={`flex-1 py-2 rounded-xl font-bold text-sm border-2 transition-all ${
					slotSize === n
						? 'bg-emerald-500 border-primary/30 text-base-content/70'
						: 'bg-base-100 text-base-content border-base-300 text-base-content/70 hover:bg-base-100 text-base-content'
				}`}
			>
				{n} ช่อง
			</button>
		{/each}
	</div>

	{#if loading}
		<div class="flex flex-col items-center gap-3 py-20" in:fade>
			<div class="w-12 h-12 rounded-full border-4 border-primary/30 border-t-emerald-400 animate-spin"></div>
			<p class="text-base-content/70 text-sm">กำลังคำนวณ ({slotSize} ช่อง)…</p>
		</div>

	{:else if components.length}
		<!-- Summary bar -->
		<div class="grid grid-cols-3 gap-3 shrink-0" in:fade>
			<div class="bg-base-100 text-base-content border border-base-300 rounded-xl p-3 text-center">
				<p class="text-2xl font-extrabold text-primary">{wordCount.toLocaleString()}</p>
				<p class="text-xs text-base-content/70 mt-0.5">คำทั้งหมด</p>
			</div>
			<div class="bg-base-100 text-base-content border border-base-300 rounded-xl p-3 text-center">
				<p class="text-2xl font-extrabold text-primary">{components.length.toLocaleString()}</p>
				<p class="text-xs text-base-content/70 mt-0.5">กลุ่ม</p>
			</div>
			<div class="bg-base-100 text-base-content border border-base-300 rounded-xl p-3 text-center">
				<p class="text-2xl font-extrabold text-base-content/70">{isolatedCount.toLocaleString()}</p>
				<p class="text-xs text-base-content/70 mt-0.5">คำโดดเดี่ยว</p>
			</div>
		</div>

		<!-- Component list -->
		<div class="flex flex-col gap-3" in:fade>
			{#each components as comp, i}
				{@const big = comp.length > PREVIEW}
				{@const isOpen = expanded.has(i)}
				{@const shown = big && !isOpen ? comp.slice(0, PREVIEW) : comp}
				<div class="bg-base-100 text-base-content border border-base-300 rounded-xl overflow-hidden">
					<button
						on:click={() => toggle(i)}
						class="w-full flex items-center justify-between px-4 py-2.5 hover:bg-base-100 text-base-content transition-colors text-left"
					>
						<div class="flex items-center gap-2">
							{#if i === 0}
								<span class="text-xs bg-emerald-500/20 text-primary border border-primary/30 rounded-full px-2 py-0.5 font-bold">ใหญ่สุด</span>
							{/if}
							<span class="text-sm font-bold text-base-content/70">กลุ่ม #{i + 1}</span>
							<span class="text-xs text-base-content/70">{comp.length} คำ</span>
						</div>
						<span class="text-base-content/70 text-xs">{isOpen || !big ? '▲' : '▼'}</span>
					</button>
					<div class="px-4 pb-3 flex flex-wrap gap-1.5">
						{#each shown as word}
							<span class="px-2 py-0.5 rounded-lg bg-base-100 text-base-content border border-base-300 text-base-content/70 text-sm font-medium">{word}</span>
						{/each}
						{#if big}
							<button
								on:click={() => toggle(i)}
								class="px-2 py-0.5 rounded-lg bg-base-100 text-base-content border border-base-300 text-base-content/70 text-sm hover:bg-base-200 text-base-content transition-colors"
							>
								{isOpen ? '▲ ย่อ' : `+${comp.length - PREVIEW} เพิ่มเติม…`}
							</button>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
