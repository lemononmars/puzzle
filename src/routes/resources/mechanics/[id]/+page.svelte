<script lang="ts">
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import Surface from '#lib/components/ui/Surface.svelte';
	import FormattedText from '#lib/components/ui/FormattedText.svelte';
	import AnswerChecker from '#lib/components/AnswerChecker.svelte';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
import ChevronLeft from '@lucide/svelte/icons/chevron-left';
import ChevronRight from '@lucide/svelte/icons/chevron-right';
import Lightbulb from '@lucide/svelte/icons/lightbulb';
import BookOpen from '@lucide/svelte/icons/book-open';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	let mechanic = $derived(data.mechanic);
	let answer = $state<string | number>('');
	let feedback = $state<{ answer: string; correct: boolean; id: number } | null>(null);
	let sequence = 0;
	let showSolution = $state(false);
	$effect(() => { mechanic.id; answer = ''; feedback = null; showSolution = false; });
	function check() {
		const submitted = String(answer).trim();
		if (!submitted) return;
		const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '');
		const correct = mechanic.puzzle.acceptedAnswers.some(value => normalize(value) === normalize(submitted));
		feedback = { answer: submitted, correct, id: ++sequence };
		if (correct) showSolution = true;
	}
</script>
<svelte:head><title>{mechanic.englishTitle} · Puzzle Mechanics</title><meta name="description" content={mechanic.description} /></svelte:head>
<div class="space-y-6 text-left">
	<nav aria-label="Mechanic navigation" class="flex flex-wrap items-center justify-between gap-3">
		<a href="/resources/mechanics" class="btn btn-sm btn-ghost"><ArrowLeft size={16} />กลไกปริศนาทั้งหมด</a>
		<div class="flex gap-2">
			{#if data.prev}<a href={`/resources/mechanics/${data.prev.id}`} class="btn btn-sm btn-outline" aria-label={`Previous: ${data.prev.englishTitle}`}><ChevronLeft size={16} /><span class="hidden sm:inline">{data.prev.englishTitle}</span></a>{/if}
			{#if data.next}<a href={`/resources/mechanics/${data.next.id}`} class="btn btn-sm btn-outline" aria-label={`Next: ${data.next.englishTitle}`}><span class="hidden sm:inline">{data.next.englishTitle}</span><ChevronRight size={16} /></a>{/if}
		</div>
	</nav>
	<PageHeading title={mechanic.englishTitle} eyebrow={mechanic.chapter.englishTitle} description={mechanic.description} />
	<p class="botanical-muted text-sm">{mechanic.thaiTitle} <span aria-hidden="true">·</span> <span lang="ja">{mechanic.japaneseTitle}</span></p>
	{#if data.article}
		{@const Article = data.article}
		<Article />
	{:else}
		<Surface><section class="space-y-4"><h2 class="text-xl font-bold flex gap-2 items-center"><BookOpen size={20} />แนวคิด / Concept</h2><FormattedText text={mechanic.detailedDescription} /></section></Surface>
		<Surface><section class="space-y-4"><h2 class="text-xl font-bold flex gap-2 items-center"><Lightbulb size={20} />วิธีสังเกต / Solving approach</h2><FormattedText text={mechanic.solvingTechnique} /></section></Surface>
		{#if mechanic.technicalTerms.length}<Surface><section class="space-y-4"><h2 class="text-xl font-bold">คำศัพท์ / Terms</h2><dl class="grid gap-4 sm:grid-cols-2">{#each mechanic.technicalTerms as term}<div><dt class="font-bold">{term.en}</dt><dd class="text-sm botanical-muted">{term.th}<br /><span lang="ja">{term.ja}</span></dd></div>{/each}</dl></section></Surface>{/if}
	{/if}
	{#if mechanic.hasExercise}
		<Surface><section class="space-y-5" aria-label="Practice puzzle">
			<h2 class="text-xl font-bold">{mechanic.puzzle.title}</h2><p>{mechanic.puzzle.prompt}</p>
			<div class="diagram bg-base-100 text-base-content">{@html showSolution && mechanic.puzzle.solutionSvg ? mechanic.puzzle.solutionSvg : mechanic.puzzle.svg}</div>
			{#if mechanic.puzzle.hint}<details class="bg-base-200 text-base-content rounded-xl p-4"><summary class="cursor-pointer font-bold">คำใบ้ / Hint</summary><p class="mt-3">{mechanic.puzzle.hint}</p></details>{/if}
			{#key mechanic.id}<AnswerChecker bind:value={answer} on:submit={check} {feedback} historyKey={`mechanics/${mechanic.id}`} />{/key}
			<button type="button" class="btn btn-sm btn-outline" aria-expanded={showSolution} onclick={() => showSolution = !showSolution}>{showSolution ? 'ซ่อนเฉลย / Hide solution' : 'ดูเฉลย / Show solution'}</button>
			{#if showSolution}<section class="space-y-3" aria-label="Solution" data-pagefind-ignore><h3 class="font-bold">{mechanic.puzzle.answerDisplay}</h3><FormattedText text={mechanic.puzzle.solutionExplanation} /></section>{/if}
		</section></Surface>
	{/if}
</div>
<style>.diagram { overflow:auto; }.diagram :global(svg) { max-width:100%; height:auto; margin:auto; }</style>
