

<script lang="ts">
export let data: any;
import { staticHiddenLinkPuzzles } from '#lib/data/puzzles/hiddenlink.js';


	import type { IHiddenLink } from '#lib/data/puzzles/hiddenlink.js';
	import { ChevronLeftIcon, ChevronRightIcon } from 'svelte-feather-icons';
	import { dateToThaiString } from '#lib/utils/date.js';

	let content: IHiddenLink | null = data.content;
let id: number = data.id;

	if (content) {
		content.type = 'hiddenlink';
	}

	let showAnswer: boolean = false;
	let numHints: number = 0;

	const totalPuzzles = staticHiddenLinkPuzzles.length;

	function revealHint() {
		if (content?.hints && numHints < content.hints.length) {
			numHints++;
		}
		scrollBottom();
	}

	function scrollBottom() {
		window.scroll({ top: window.innerHeight + 200, behavior: 'smooth' });
	}

	function resetState() {
		numHints = 0;
		showAnswer = false;
	}

	$: if (content) {
		resetState();
	}

$: ({ content, id } = data);
</script>

<svelte:head>
	<title>Code Breaker | {content ? content.title : 'Hidden Link'}</title>
</svelte:head>

<div class="flex flex-col gap-4 pb-10 max-w-4xl mx-auto px-4 select-none">
	{#if content}
		<!-- Header with Left / Right Navigation Buttons -->
		<div class="w-full flex items-center justify-between gap-3 py-2 bg-base-100 text-base-content border border-base-300 rounded-2xl px-4 shadow-lg">
			<a
				href="/puzzles/hiddenlink"
				class="p-2 rounded-xl bg-base-100 text-base-content border border-base-300 text-base-content/70 hover:text-base-content hover:border-primary/30 transition-all shrink-0 flex items-center justify-center"
				title="กลับไปหน้ารายการ Hidden Link"
			>
				<ChevronLeftIcon size="20" />
			</a>

			<div class="flex items-center gap-3">
				{#if id > 1}
					<a
						href="/puzzles/hiddenlink/{id - 1}"
						class="p-2 rounded-xl bg-base-100 text-base-content border border-base-300 text-base-content/70 hover:text-base-content hover:border-primary/30 transition-all shrink-0 flex items-center justify-center"
						title="ข้อก่อนหน้า"
					>
						<ChevronLeftIcon size="18" />
					</a>
				{:else}
					<button class="p-2 rounded-xl bg-base-100 text-base-content border border-base-300 text-base-content/70 cursor-not-allowed" disabled>
						<ChevronLeftIcon size="18" />
					</button>
				{/if}

				<h1 class="text-xl sm:text-2xl font-black tracking-tight text-base-content text-center flex-1 px-2">
					{content.title}
				</h1>

				{#if id < totalPuzzles}
					<a
						href="/puzzles/hiddenlink/{id + 1}"
						class="p-2 rounded-xl bg-base-100 text-base-content border border-base-300 text-base-content/70 hover:text-base-content hover:border-primary/30 transition-all shrink-0 flex items-center justify-center"
						title="ข้อถัดไป"
					>
						<ChevronRightIcon size="18" />
					</a>
				{:else}
					<button class="p-2 rounded-xl bg-base-100 text-base-content border border-base-300 text-base-content/70 cursor-not-allowed" disabled>
						<ChevronRightIcon size="18" />
					</button>
				{/if}
			</div>

			<div class="text-xs font-mono font-bold text-base-content/70">
				{id} / {totalPuzzles}
			</div>
		</div>

		{#if content.date}
			<div class="flex items-center justify-center text-xs text-base-content/70">
				<span>วันที่ {dateToThaiString(content.date)}</span>
			</div>
		{/if}

		<!-- Image View -->
		<div class="mx-auto w-full lg:w-1/2 pt-2">
			{#key id}
				<img
					src={content.image}
					on:error={(e) => {
						if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.display = 'none';
					}}
					class="aspect-auto object-contain mx-auto rounded-2xl shadow-xl border border-base-300"
					alt="img"
				/>
			{/key}
		</div>

		<div class="divider"></div>

		<!-- Hints & Answer Section -->
		{#if content.hints}
			<div class="w-full lg:w-1/2 mx-auto space-y-3">
				<h1 class="font-bold text-lg text-base-content">คำใบ้ & เฉลย</h1>
				{#each content.hints?.slice(0, numHints) as h, idx}
					<div class="btn btn-outline btn-info btn-sm">คำใบ้ที่ {idx + 1}</div>
					<p class="text-base-content/70 text-sm leading-relaxed">{h}</p>
					<br />
				{/each}
				{#if numHints < content.hints.length}
					<div class="btn btn-outline btn-sm" on:click={revealHint}>เปิดคำใบ้ที่ {numHints + 1}</div>
				{:else}
					<div
						class="btn btn-warning btn-sm"
						on:click={() => {
							showAnswer = !showAnswer;
							scrollBottom();
						}}
					>
						{showAnswer ? 'ซ่อนเฉลย' : 'เฉลย'}
					</div>
					{#if showAnswer}
						<div class="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-sm text-warning-content font-bold mt-3 leading-relaxed">
							เฉลย: {content.answer}
						</div>
					{/if}
				{/if}
			</div>
		{/if}
	{:else}
		<div class="text-center py-12 text-base-content/70 space-y-3">
			<h2 class="text-xl font-bold">ไม่พบปริศนา Hidden Link หมายเลข {id}</h2>
			<a href="/puzzles/hiddenlink" class="btn btn-primary btn-sm">กลับไปหน้ารวม Hidden Link</a>
		</div>
	{/if}
</div>
