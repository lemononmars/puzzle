<script lang="ts">
import UiArrowLeft from '@lucide/svelte/icons/arrow-left';
import UiArrowRight from '@lucide/svelte/icons/arrow-right';
import UiArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import AnswerChecker from '#lib/components/AnswerChecker.svelte';
	import EnigMarchContent from '#lib/components/EnigMarchContent.svelte';
	import type { EnigMarchPuzzle } from '#lib/enigmarch.js';
	let { data }: { data: { puzzle: Omit<EnigMarchPuzzle, 'answers'>; canCheck: boolean } } = $props();
	let answer = $state<string | number>('');
	let message = $state('');
	let feedback = $state<{answer:string;correct:boolean;id:number}|null>(null);
	let sequence = 0;
	let checking = $state(false);
	$effect(() => { data.puzzle.day; data.puzzle.year; answer='';message='';feedback=null;checking=false; });
	async function check() {
		if (!String(answer).trim() || checking) return;
		const puzzle = data.puzzle;
		const submittedAnswer = String(answer).trim();
		checking = true;
		try {
			const response = await fetch(`/puzzles/enigmarch/${puzzle.year}/${puzzle.day}/check`, { method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ answer:submittedAnswer }) });
			const result = await response.json();
			if (puzzle !== data.puzzle) return;
			if (!response.ok) throw new Error('Unable to check');
			feedback = {answer:submittedAnswer,correct:result.correct,id:++sequence};
			message='';
		} catch { if(puzzle===data.puzzle) message='Could not check your answer. Please try again.'; }
		finally { if(puzzle===data.puzzle) checking=false; }
	}
</script>
<svelte:head><title>{data.puzzle.title} · EnigMarch {data.puzzle.year}</title></svelte:head>
<div class="text-left space-y-6">
	<a href={`/puzzles/enigmarch/${data.puzzle.year}`} class="link link-primary text-sm"><UiArrowLeft size={16} class="inline-block align-middle" aria-hidden="true" /> EnigMarch {data.puzzle.year}</a>
	<div class="puzzle-navigation">
		{#if data.puzzle.day > 1}<a class="btn btn-sm btn-outline" aria-label="Previous day" href={`/puzzles/enigmarch/${data.puzzle.year}/${data.puzzle.day-1}`}><UiArrowLeft size={16} class="inline-block align-middle" aria-hidden="true" /><span>Previous</span></a>{:else}<span></span>{/if}
		<PageHeading title={data.puzzle.title} eyebrow={`ENIGMARCH ${data.puzzle.year} / DAY ${data.puzzle.day}`} />
		{#if data.puzzle.day < 31}<a class="btn btn-sm btn-outline" aria-label="Next day" href={`/puzzles/enigmarch/${data.puzzle.year}/${data.puzzle.day+1}`}><span>Next</span><UiArrowRight size={16} class="inline-block align-middle" aria-hidden="true" /></a>{:else}<span></span>{/if}
	</div>
	<section class="botanical-surface"><EnigMarchContent blocks={data.puzzle.blocks} />{#if data.puzzle.solverUrl}<a class="btn btn-sm btn-outline mt-5" href={data.puzzle.solverUrl} target="_blank" rel="noreferrer">Open original solving board <UiArrowUpRight size={16} class="inline-block align-middle" aria-hidden="true" /></a>{/if}</section>
	{#if data.canCheck}
		<section class="botanical-surface" aria-label="Answer checker">
			{#key data.puzzle.year + '/' + data.puzzle.day}<AnswerChecker bind:value={answer} on:submit={check} buttonText={checking ? 'Checking…' : 'check'} disabled={checking} {feedback} historyKey={`enigmarch/${data.puzzle.year}/${data.puzzle.day}`} />{/key}
			{#if message}<p role="alert" class="text-sm mt-3">{message}</p>{/if}
		</section>
	{/if}
	{#if data.puzzle.hints.length}<section aria-labelledby="hints-title"><h2 id="hints-title" class="text-xl font-bold mb-4">Hints</h2><div class="space-y-3">{#each data.puzzle.hints as hint}<details class="botanical-surface"><summary class="cursor-pointer font-bold">{hint.title}</summary><div class="mt-4"><EnigMarchContent blocks={hint.blocks} /></div></details>{/each}</div></section>{/if}
	{#if data.puzzle.solution.length}<details class="botanical-surface"><summary class="cursor-pointer font-bold">Reveal solution · spoilers</summary><div class="mt-4"><EnigMarchContent blocks={data.puzzle.solution} /></div></details>{/if}
</div>
<style>.puzzle-navigation { display:grid; grid-template-columns:auto minmax(0,1fr) auto; align-items:center; gap:20px; }.puzzle-navigation :global(.page-heading) { margin:0; text-align:center; }.puzzle-navigation > a { align-self:center; }@media(max-width:600px) { .puzzle-navigation { gap:8px; }.puzzle-navigation > a { padding:8px; }.puzzle-navigation > a span { display:none; }.puzzle-navigation :global(h1) { font-size:22px; } }</style>
