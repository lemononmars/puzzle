<script lang="ts">
	import type { IPuzzleHunt } from '#lib/interfaces/index.js';
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import AnswerChecker from '#lib/components/AnswerChecker.svelte';
	import PuzzleHuntContent from '#lib/components/PuzzleHuntContent.svelte';
	export let data: { content: IPuzzleHunt };
	$: content = data.content;
	$: puzzles = content.puzzles;
	let currentTab = 0;
	let loadedId: number | undefined;
	let solved: boolean[] = [];
	let answer = '';
	let submissionResponse: {
		answer: string;
		result: 'correct' | 'incorrect';
		hint?: string;
	} | null = null;
	$: if (content.id !== loadedId) {
		loadedId = content.id;
		currentTab = 0;
		solved = Array(content.puzzles.length).fill(false);
		answer = '';
		submissionResponse = null;
	}
	$: currentPuzzle = puzzles[currentTab];
	async function checkAnswer() {
		if (!answer || !currentPuzzle) return;
		const tab = currentTab;
		const submitted = answer;
		const huntId = content.id;
		let isCorrect = false;
		let hint = '';
		if (currentPuzzle.solution) {
			isCorrect = submitted.toUpperCase() === currentPuzzle.solution;
		} else {
			const res = await fetch(`/api/puzzle/puzzlehunt/${currentPuzzle.index}`, {
				method: 'POST',
				credentials: 'same-origin',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ index: tab, answer: submitted })
			});
			const response = await res.json();
			isCorrect = response.result === 'correct';
			hint = response.hint || '';
		}
		if (huntId !== content.id) return;
		if (isCorrect) solved[tab] = true;
		if (tab !== currentTab) return;
		submissionResponse = { answer: submitted, result: isCorrect ? 'correct' : 'incorrect', hint };
		answer = '';
	}
	function changeTab(n: number) {
		currentTab = n;
		answer = '';
		submissionResponse = null;
	}
</script>

<PageHeading title={content.title} eyebrow="Puzzle Hunt" />
<div class="flex flex-col gap-6 min-w-0">
	<nav class="flex flex-wrap gap-2" aria-label="เลือกปริศนา">
		{#each puzzles as puzzle, idx}
			<button
				type="button"
				class="btn btn-sm {currentTab === idx ? 'btn-primary text-primary-content' : 'btn-outline'}"
				aria-pressed={currentTab === idx}
				onclick={() => changeTab(idx)}
			>
				ข้อที่ {puzzle.index}{solved[idx] ? ' ✔️' : ''}
			</button>
		{/each}
	</nav>
	{#if currentPuzzle}
		<h2 class="text-xl font-bold">ข้อที่ {currentPuzzle.index} - {currentPuzzle.title}</h2>
		<PuzzleHuntContent huntId={content.id} puzzleIndex={currentPuzzle.index} />
		<div class="max-w-lg w-full mx-auto">
			{#if !solved[currentTab]}
				<AnswerChecker
					bind:value={answer}
					placeholder="พิมพ์คำตอบที่นี่..."
					buttonText="ตรวจคำตอบ"
					on:submit={checkAnswer}
				/>
			{:else}
				<p role="status">
					คำตอบถูกต้อง: {currentPuzzle.solution?.toUpperCase() ||
						submissionResponse?.answer.toUpperCase()}
				</p>
			{/if}
			{#if submissionResponse && !solved[currentTab]}
				<p role="status" class="mt-2">
					{submissionResponse.answer.toUpperCase()} is {submissionResponse.result}. {submissionResponse.hint ||
						''}
				</p>
			{/if}
		</div>
		{#key `${content.id}-${currentPuzzle.index}`}
			<details class="border border-base-300 rounded-box bg-base-100 text-base-content p-4">
				<summary class="cursor-pointer font-semibold">PDF ต้นฉบับ — เปิดเพื่อตรวจสอบเนื้อหา</summary
				>
				<p class="text-sm botanical-muted my-3">เก็บไว้ชั่วคราวสำหรับเทียบกับเนื้อหาบนหน้าเว็บ</p>
				<a class="link" href="{currentPuzzle.file}/view" target="_blank" rel="noreferrer"
					>เปิด PDF ต้นฉบับในแท็บใหม่</a
				>
				<iframe
					src="{currentPuzzle.file}/preview"
					width="600"
					height="800"
					title="PDF ต้นฉบับ: {currentPuzzle.title}"
					loading="lazy"
					class="mt-4 w-full max-w-full border-0"
				></iframe>
			</details>
			<section aria-label="คำใบ้" class="flex flex-col gap-3">
				<h3 class="font-bold">คำใบ้</h3>
				{#each currentPuzzle.hints || [] as hint, idx}
					<details class="border border-base-300 rounded-box bg-base-100 text-base-content p-4">
						<summary class="cursor-pointer font-semibold">คำใบ้ที่ {idx + 1}</summary>
						<p class="mt-3">{hint}</p>
					</details>
				{:else}
					<p>ไม่มีคำใบ้</p>
				{/each}
			</section>
		{/key}
	{/if}
</div>
