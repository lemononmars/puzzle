<script lang="ts">
	import { onMount } from 'svelte';
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import Surface from '#lib/components/ui/Surface.svelte';
	import { wordPieces, tiles, matchesAnswer } from '#lib/data/puzzles/wordpieces.js';

	let active = $state(0);
	let ready = $state(false);
	onMount(() => { ready = true; });
	let selected = $state<string[]>([]);
	let solved = $state<Record<number, string[]>>({});
	let hints = $state<number[]>([]);
	let message = $state('เลือกคำใบ้ แล้วแตะชิ้นคำเรียงตามลำดับ');
	let order = $state(['2-1', '4-1', '0-0', '2-0', '1-1', '4-0', '0-1', '3-1', '1-0', '3-0']);
	let used = $derived(Object.values(solved).flat());
	let count = $derived(Object.keys(solved).length);
	let assembly = $derived(selected.map(id => tiles.find(tile => tile.id === id)!.text).join(''));

	function choose(index: number) {
		active = index;
		selected = [];
		message = `คำใบ้ที่ ${index + 1}: ${wordPieces[index].clue}`;
	}

	function submit() {
		if (solved[active] || !selected.length) return;
		if (!matchesAnswer(active, selected, used)) {
			message = 'ยังไม่ตรงกับคำใบ้ ลองเรียงชิ้นคำใหม่ได้เลย';
			selected = [];
			return;
		}
		solved = { ...solved, [active]: [...selected] };
		selected = [];
		message = `ถูกต้อง! ${wordPieces[active].chunks.join('')} — สำเร็จ ${Object.keys(solved).length} จาก 5 คำ`;
		const next = wordPieces.findIndex((_, index) => !solved[index]);
		if (next >= 0) active = next;
	}

	function shuffle() {
		const next = [...order];
		for (let i = next.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[next[i], next[j]] = [next[j], next[i]];
		}
		order = next;
		message = 'สลับตำแหน่งชิ้นคำแล้ว';
	}

	function restart() {
		solved = {};
		selected = [];
		hints = [];
		active = 0;
		message = 'เริ่มใหม่แล้ว เลือกชิ้นคำสำหรับคำใบ้แรก';
	}
</script>

<div class="mx-auto max-w-3xl px-4 py-6">
	<PageHeading title="คำต่อชิ้น" eyebrow="WORD PIECES" description="ต่อชิ้นคำให้ตรงกับคำใบ้ทั้ง 5 ข้อ ใช้ทุกชิ้นเพียงครั้งเดียว" />
	<details class="collapse collapse-arrow border border-base-300 bg-base-100 text-base-content mb-6">
		<summary class="collapse-title font-medium">วิธีเล่น</summary>
		<div class="collapse-content text-sm leading-7">เลือกคำใบ้ข้อใดก่อนก็ได้ แล้วแตะชิ้นคำตามลำดับเพื่อสร้างคำตอบ กดตรวจคำตอบเมื่อพร้อม ทุกคำใช้ 2 ชิ้น ชิ้นที่ใช้แล้วจะถูกเก็บไว้กับคำตอบ ลองผิดได้โดยไม่เสียคะแนน ใช้ Tab และ Enter หรือ Space เพื่อเล่นด้วยคีย์บอร์ด</div>
	</details>
	<Surface class="p-4 sm:p-6">
		<div class="flex items-center justify-between gap-3 mb-4">
			<h2 class="font-semibold">คำใบ้ 5 คำ</h2>
			<span class="badge badge-primary">{count} / 5 คำ</span>
		</div>
		<ol class="clues grid gap-2">
			{#each wordPieces as word, index}
				<li>
					<button type="button" class="clue border rounded-xl p-3 text-left w-full {solved[index] ? 'bg-base-200 text-base-content border-base-300' : active === index ? 'bg-primary text-primary-content border-primary' : 'bg-base-100 text-base-content border-base-300'}" aria-pressed={active === index} disabled={!!solved[index]} onclick={() => choose(index)}>
						<span class="text-sm">{index + 1}. {word.clue}</span>
						<span class="block text-sm mt-1 {solved[index] ? 'puzzle-tiles font-semibold' : ''}">{solved[index] ? `✓ ${word.chunks.join('')}` : '2 ชิ้น'}</span>
					</button>
				</li>
			{/each}
		</ol>
		{#if count < 5}
			<form class="mt-6" onsubmit={(event) => { event.preventDefault(); submit(); }}>
				<label for="assembled-word" class="block text-sm font-semibold mb-2">คำตอบข้อ {active + 1}</label>
				<output id="assembled-word" class="puzzle-tiles block min-h-16 border border-base-300 rounded-xl bg-base-200 text-base-content p-4 text-xl">{assembly || '…'}</output>
				<div class="flex flex-wrap gap-2 mt-3">
					<button type="submit" class="btn btn-primary" disabled={!selected.length}>ตรวจคำตอบ</button>
					<button type="button" class="btn btn-ghost" disabled={!selected.length} onclick={() => { selected = selected.slice(0, -1); }}>ย้อนกลับ</button>
					<button type="button" class="btn btn-ghost" disabled={!selected.length} onclick={() => { selected = []; }}>ล้างคำ</button>
				</div>
			</form>
			<div class="flex flex-wrap items-center justify-between gap-2 mt-6 mb-3">
				<h2 class="font-semibold">ชิ้นคำที่เหลือ</h2>
				<button type="button" class="btn btn-sm btn-ghost" onclick={shuffle}>สลับชิ้นคำ</button>
			</div>
			<div class="grid grid-cols-2 sm:grid-cols-5 gap-2" aria-label="ชิ้นคำ">
				{#each order as id (id)}
					{@const tile = tiles.find(tile => tile.id === id)!}
					<button type="button" class="btn h-14 puzzle-tiles text-lg {selected.includes(id) ? 'btn-primary' : 'btn-outline'}" disabled={!ready || used.includes(id)} aria-pressed={selected.includes(id)} aria-label={`${tile.text}${used.includes(id) ? ' ใช้แล้ว' : ''}`} onclick={() => { selected = selected.includes(id) ? selected.filter(item => item !== id) : [...selected, id]; }}>{used.includes(id) ? '✓' : tile.text}</button>
				{/each}
			</div>
			<button type="button" class="btn btn-sm btn-ghost mt-4" onclick={() => { if (!hints.includes(active)) hints = [...hints, active]; message = wordPieces[active].hint; }}>ขอคำใบ้เพิ่ม</button>
			{#if hints.includes(active)}<p class="text-sm mt-2">คำใบ้เพิ่ม: {wordPieces[active].hint}</p>{/if}
		{:else}
			<div class="mt-6 rounded-xl bg-success text-success-content p-5" role="region" aria-label="ผลการเล่น">
				<h2 class="font-semibold text-xl">ต่อครบทั้ง 5 คำแล้ว!</h2>
				<p class="mt-2">{hints.length ? `ใช้คำใบ้เพิ่ม ${hints.length} ข้อ` : 'สำเร็จโดยไม่ใช้คำใบ้เพิ่ม'}</p>
				<button type="button" class="btn mt-4" onclick={restart}>เล่นอีกครั้ง</button>
			</div>
		{/if}
		<p class="text-sm mt-4 min-h-12" role="status" aria-live="polite" aria-atomic="true">{message}</p>
	</Surface>
</div>

<style>
	.clues { list-style: none; padding: 0; margin: 0; }
	.clues li { padding: 0; margin: 0; }
</style>
