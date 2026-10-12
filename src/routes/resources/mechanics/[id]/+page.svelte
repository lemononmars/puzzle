

<script lang="ts">
export let data: any;
import type { MechanicDetail } from '#lib/data/resources/puzzleMechanicDetails.js';


	import AnswerChecker from '#lib/components/AnswerChecker.svelte';
	import {
		ArrowLeftIcon,
		ChevronLeftIcon,
		ChevronRightIcon,
		HelpCircleIcon,
		CheckCircleIcon,
		XCircleIcon,
		EyeIcon,
		EyeOffIcon,
		BookOpenIcon,
		AwardIcon
	} from 'svelte-feather-icons';

	let mechanic: MechanicDetail = data.mechanic;
	let prev: { id: string; englishTitle: string; thaiTitle: string } | null = data.prev;
	let next: { id: string; englishTitle: string; thaiTitle: string } | null = data.next;

	let userAnswer = '';
	let checkStatus: 'idle' | 'correct' | 'incorrect' = 'idle';
	let showHint = false;
	let showSolution = false;

	// Reset interaction state whenever the mechanic changes
	$: if (mechanic) {
		userAnswer = '';
		checkStatus = 'idle';
		showHint = false;
		showSolution = false;
	}

	function normalize(text: string | number): string {
		return String(text)
			.trim()
			.toLowerCase()
			.replace(/\s+/g, '');
	}

	function handleCheck() {
		const normalizedInput = normalize(userAnswer);
		if (!normalizedInput) return;

		const isCorrect = mechanic.puzzle.acceptedAnswers.some(
			(ans) => normalize(ans) === normalizedInput
		);

		if (isCorrect) {
			checkStatus = 'correct';
			showSolution = true;
		} else {
			checkStatus = 'incorrect';
		}
	}

	function toggleSolution() {
		showSolution = !showSolution;
	}

	function toggleHint() {
		showHint = !showHint;
	}

	function formatConceptHtml(text: string): string {
		if (!text) return '';
		return text
			.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-base-content">$1</strong>')
			.replace(/\*([^*]+)\*/g, '<span class="text-primary font-semibold">$1</span>')
			.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-base-300 text-primary text-xs font-mono">$1</code>');
	}

$: ({ mechanic, prev, next } = data);
</script>

<svelte:head>
	<title>{mechanic.englishTitle} ({mechanic.thaiTitle}) | Puzzle Mechanics</title>
	<meta
		name="description"
		content="{mechanic.thaiTitle} ({mechanic.englishTitle} · {mechanic.japaneseTitle}): {mechanic.description}"
	/>
</svelte:head>

<div class="w-full max-w-5xl mx-auto px-4 py-6 sm:py-10 text-base-content space-y-8">
	<!-- Top Navigation -->
	<div class="flex flex-wrap items-center justify-between gap-3 border-b border-base-300 pb-4">
		<a href="/resources/mechanics" class="btn btn-ghost btn-sm gap-2 text-xs sm:text-sm">
			<ArrowLeftIcon size="16" />
			<span>กลับสู่สารานุกรมกลไกปริศนา (Mechanics Wiki)</span>
		</a>

		<div class="flex items-center gap-2">
			{#if prev}
				<a
					href="/resources/mechanics/{prev.id}"
					class="btn btn-outline btn-xs sm:btn-sm gap-1 text-xs"
					title="ก่อนหน้า: {prev.englishTitle}"
				>
					<ChevronLeftIcon size="14" />
					<span class="hidden sm:inline">ก่อนหน้า:</span>
					<span class="line-clamp-1 max-w-[120px]">{prev.englishTitle}</span>
				</a>
			{/if}
			{#if next}
				<a
					href="/resources/mechanics/{next.id}"
					class="btn btn-outline btn-xs sm:btn-sm gap-1 text-xs"
					title="ถัดไป: {next.englishTitle}"
				>
					<span class="hidden sm:inline">ถัดไป:</span>
					<span class="line-clamp-1 max-w-[120px]">{next.englishTitle}</span>
					<ChevronRightIcon size="14" />
				</a>
			{/if}
		</div>
	</div>

	<!-- Header Hero Card -->
	<header class="rounded-3xl border border-base-300 bg-base-200 text-base-content p-6 sm:p-8 shadow-xl space-y-4">
		<div class="flex flex-wrap items-center gap-2">
			<span class="badge {mechanic.chapter.accent} font-bold text-xs uppercase tracking-wide py-2 px-3">
				{mechanic.chapter.thaiTitle} ({mechanic.chapter.englishTitle})
			</span>
			<span class="badge badge-outline text-xs py-2 px-2.5 opacity-70">
				#{mechanic.id}
			</span>
		</div>

		<div>
			<h1 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-base-content">
				{mechanic.englishTitle}
			</h1>
			<div class="flex flex-wrap items-baseline gap-3 mt-2">
				<p class="text-xl sm:text-2xl font-bold text-primary">
					{mechanic.thaiTitle}
				</p>
				<span class="opacity-40">·</span>
				<p class="text-lg sm:text-xl font-medium opacity-75" lang="ja">
					{mechanic.japaneseTitle}
				</p>
			</div>
		</div>

		<p class="text-sm sm:text-base leading-relaxed opacity-85 pt-1 max-w-3xl border-t border-base-300/80">
			{mechanic.description}
		</p>
	</header>

	<!-- Section 1: Detailed Concept (Formatted with CSS styling) -->
	<div class="p-6 sm:p-8 rounded-3xl border border-base-300 bg-base-100 text-base-content shadow-sm space-y-4">
		<h2 class="text-xl font-black flex items-center gap-2 text-base-content border-b border-base-300/80 pb-3">
			<BookOpenIcon size="20" class="text-primary" />
			<span>คำอธิบายกลไก (Mechanic Concept)</span>
		</h2>
		<div class="text-sm sm:text-base leading-relaxed opacity-90 whitespace-pre-line space-y-3">
			{@html formatConceptHtml(mechanic.detailedDescription)}
		</div>
	</div>

	<!-- Section 2: Interactive Puzzle Section (Conditional on hasExercise) -->
	{#if mechanic.hasExercise}
	<section class="rounded-3xl border border-base-300 bg-base-200 text-base-content p-6 sm:p-8 shadow-xl space-y-6">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-base-300 pb-4">
			<div>
				<div class="flex items-center gap-2 mb-1">
					<span class="badge badge-accent text-accent-content font-bold text-xs uppercase tracking-wide">
						Interactive Exercise
					</span>
					<span class="text-xs opacity-60">Vector Graphic (SVG)</span>
				</div>
				<h2 class="text-xl sm:text-2xl font-black text-base-content">
					{mechanic.puzzle.title}
				</h2>
			</div>

			{#if mechanic.puzzle.hint}
				<button
					type="button"
					on:click={toggleHint}
					class="btn btn-sm btn-ghost gap-1.5 self-start sm:self-auto text-xs"
				>
					<HelpCircleIcon size="15" class="text-amber-400" />
					<span>{showHint ? 'ซ่อนคำใบ้' : 'ขอคำใบ้ (Hint)'}</span>
				</button>
			{/if}
		</div>

		<!-- Question Prompt -->
		<div class="p-4 rounded-xl bg-base-100 border border-base-300 text-sm leading-relaxed">
			<span class="font-bold text-primary mr-1.5">คำถาม:</span>
			<span>{mechanic.puzzle.prompt}</span>
		</div>

		<!-- Hint box if opened -->
		{#if showHint && mechanic.puzzle.hint}
			<div class="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-start gap-2.5">
				<HelpCircleIcon size="16" class="text-amber-400 shrink-0 mt-0.5" />
				<div>
					<span class="font-bold">คำใบ้: </span>
					<span>{mechanic.puzzle.hint}</span>
				</div>
			</div>
		{/if}

		<!-- Non-raster Vector SVG Puzzle Canvas -->
		<div class="relative overflow-hidden rounded-2xl bg-base-100 text-base-content border border-base-300 p-3 sm:p-6 shadow-inner">
			{#if showSolution && mechanic.puzzle.solutionSvg}
				<div class="transition-all duration-300">
					{@html mechanic.puzzle.solutionSvg}
				</div>
			{:else}
				<div class="transition-all duration-300">
					{@html mechanic.puzzle.svg}
				</div>
			{/if}
		</div>

		<!-- Answer Checker & Submission -->
		<div class="max-w-md mx-auto space-y-3 pt-2">
			<AnswerChecker
				bind:value={userAnswer}
				placeholder="พิมพ์คำตอบของคุณที่นี่..."
				buttonText="ตรวจคำตอบ"
				btnClass="btn-primary text-primary-content"
				on:submit={handleCheck}
			/>

			<!-- Feedback Banner -->
			{#if checkStatus === 'correct'}
				<div class="alert alert-success text-success-content shadow-lg text-xs sm:text-sm font-bold flex items-center justify-between">
					<div class="flex items-center gap-2">
						<CheckCircleIcon size="18" />
						<span>ถูกต้องแล้ว! 🎉 คำตอบคือ {mechanic.puzzle.answerDisplay}</span>
					</div>
				</div>
			{:else if checkStatus === 'incorrect'}
				<div class="alert alert-warning text-warning-content shadow-lg text-xs sm:text-sm font-bold flex items-center justify-between">
					<div class="flex items-center gap-2">
						<XCircleIcon size="18" />
						<span>ยังไม่ถูกต้อง ลองสังเกตคำใบ้อีกครั้ง หรือกดดูเฉลย</span>
					</div>
				</div>
			{/if}
		</div>

		<!-- Solution Disclosure Section -->
		<div class="pt-4 border-t border-base-300/80">
			<div class="flex items-center justify-between">
				<button
					type="button"
					on:click={toggleSolution}
					class="btn btn-sm btn-outline gap-2 text-xs"
				>
					{#if showSolution}
						<EyeOffIcon size="14" />
						<span>ซ่อนเฉลยและวิธีคิด</span>
					{:else}
						<EyeIcon size="14" />
						<span>ดูเฉลยและวิธีคิด (Show Solution)</span>
					{/if}
				</button>

				{#if showSolution}
					<span class="text-xs font-bold text-primary">
						คำตอบที่ถูกต้อง: {mechanic.puzzle.answerDisplay}
					</span>
				{/if}
			</div>

			{#if showSolution}
				<div class="mt-4 p-5 rounded-2xl bg-base-100 border border-primary/30 text-sm leading-relaxed space-y-3">
					<div class="flex items-center gap-2 text-primary font-bold">
						<AwardIcon size="18" />
						<span>เฉลยและขั้นตอนการคิด (Step-by-Step Breakdown)</span>
					</div>
					<div class="whitespace-pre-line text-xs sm:text-sm opacity-90 pl-1">
						{mechanic.puzzle.solutionExplanation}
					</div>
				</div>
			{/if}
		</div>
	</section>
	{/if}

	<!-- Bottom Adjacent Mechanics Links -->
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
		{#if prev}
			<a
				href="/resources/mechanics/{prev.id}"
				class="group flex flex-col p-4 rounded-2xl border border-base-300 bg-base-200/60 hover:bg-base-200 transition-colors text-left"
			>
				<span class="text-[11px] uppercase tracking-wider opacity-60 flex items-center gap-1">
					<ChevronLeftIcon size="12" />
					<span>กลไกก่อนหน้า</span>
				</span>
				<span class="font-bold text-sm text-base-content group-hover:text-primary transition-colors mt-1">
					{prev.englishTitle}
				</span>
				<span class="text-xs opacity-70">{prev.thaiTitle}</span>
			</a>
		{:else}
			<div></div>
		{/if}

		{#if next}
			<a
				href="/resources/mechanics/{next.id}"
				class="group flex flex-col p-4 rounded-2xl border border-base-300 bg-base-200/60 hover:bg-base-200 transition-colors text-right"
			>
				<span class="text-[11px] uppercase tracking-wider opacity-60 flex items-center justify-end gap-1">
					<span>กลไกถัดไป</span>
					<ChevronRightIcon size="12" />
				</span>
				<span class="font-bold text-sm text-base-content group-hover:text-primary transition-colors mt-1">
					{next.englishTitle}
				</span>
				<span class="text-xs opacity-70">{next.thaiTitle}</span>
			</a>
		{/if}
	</div>
</div>
