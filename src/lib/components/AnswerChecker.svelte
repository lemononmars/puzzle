<script lang="ts">
 import {updateEntry} from "#lib/progress/local.js";
 let draftReady=false;
	import { createEventDispatcher, onMount } from 'svelte';

	export let value: string | number = '';
	export let placeholder: string = 'type an answer here';
	export let type: 'text' | 'number' = 'text';
	export let buttonText: string = 'check';
	export let feedback: { answer:string; correct:boolean; id:number } | null = null;
	export let historyKey = '';
	let history: {answer:string;correct:boolean}[] = [];
	let incorrectHistory: {answer:string;correct:boolean}[] = [];
	$: incorrectHistory=history.filter(attempt=>!attempt.correct);
	let lastFeedback: typeof feedback = null;
	let reaction = 0;
	onMount(() => {
        if(!historyKey)return;
 try {const draft=JSON.parse(localStorage.getItem('puzzle-answer-draft:'+historyKey)||'null');if(typeof draft==='string'&&draft.length<=2000)value=draft;}catch{}draftReady=true;
		try { const saved=JSON.parse(localStorage.getItem('puzzle-answer-history:'+historyKey)||'[]'); if(Array.isArray(saved)) history=saved.filter(item=>typeof item?.answer==='string' && typeof item?.correct==='boolean').slice(-50); } catch {}
	});
	function recordFeedback(result: typeof feedback) {
		if (!result || result===lastFeedback) return;
		lastFeedback=result;
		reaction++;
 if(typeof window!=='undefined')updateEntry(window.location.pathname,document.querySelector('main h1')?.textContent||document.title,{status:result.correct?'solved':'in-progress'});
		history=[...history,{answer:result.answer,correct:result.correct}].slice(-50);
		if(historyKey && typeof localStorage!=='undefined') try { localStorage.setItem('puzzle-answer-history:'+historyKey,JSON.stringify(history)); } catch {}
	}
	$: recordFeedback(feedback);
 $: if(draftReady&&historyKey){try{localStorage.setItem('puzzle-answer-draft:'+historyKey,JSON.stringify(String(value).slice(0,2000)));}catch{}}
	const feedbackText = (item:{answer:string;correct:boolean}) => item.correct ? `${item.answer} is correct!` : `${item.answer} is incorrect. Try again.`;
	export let btnClass: string = 'btn-primary text-primary-content';
	export let disabled: boolean = false;
	export let min: number | string | undefined = undefined;
	export let max: number | string | undefined = undefined;
	export let size: 'sm' | 'md' | 'lg' = 'md';

	const dispatch = createEventDispatcher<{ submit: { value: string | number } }>();

	function handleSubmit() {
		if (disabled) return;
		dispatch('submit', { value });
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-2 w-full">
	<div class="join w-full justify-center checker-group" class:success-glow={feedback?.correct} class:shake-a={feedback && !feedback.correct && reaction % 2 === 1} class:shake-b={feedback && !feedback.correct && reaction % 2 === 0}>
		<span class="join-item key-prefix bg-base-200 text-base-content" aria-hidden="true">🔑</span>
		{#if type === 'number'}
			<input
				type="number"
				aria-label="Answer"
				bind:value
				{placeholder}
				{disabled}
				{min}
				{max}
				class:botanical-answer-input={true}
				class="join-item input  border border-base-300 focus:border-primary flex-1 min-w-0 font-medium bg-base-100 text-base-content placeholder:text-base-content/60
					{size === 'sm' ? 'input-sm text-xs' : ''}
					{size === 'md' ? 'input-md text-sm' : ''}
					{size === 'lg' ? 'input-lg text-base' : ''}"
			/>
		{:else}
			<input
				type="text"
				aria-label="Answer"
				bind:value
				{placeholder}
				{disabled}
				class:botanical-answer-input={true}
				class="join-item input  border border-base-300 focus:border-primary flex-1 min-w-0 font-medium bg-base-100 text-base-content placeholder:text-base-content/60
					{size === 'sm' ? 'input-sm text-xs' : ''}
					{size === 'md' ? 'input-md text-sm' : ''}
					{size === 'lg' ? 'input-lg text-base' : ''}"
			/>
		{/if}
		<button
			type="submit"
			{disabled}
			class="join-item btn border-none font-bold shadow-md shrink-0 {btnClass}
				{size === 'sm' ? 'btn-sm text-xs px-3' : ''}
				{size === 'md' ? 'btn-md text-sm px-5' : ''}
				{size === 'lg' ? 'btn-lg text-base px-6' : ''}"
		>
			{buttonText}
		</button>
	</div>
</form>

{#if feedback}<p role="status" class="answer-feedback text-sm font-semibold" class:answer-correct={feedback.correct} class:answer-incorrect={!feedback.correct}>{#if feedback.correct}<span aria-hidden="true">✅ </span>{/if}{feedbackText(feedback)}</p>{/if}
{#if incorrectHistory.length}<ul aria-label="Incorrect answers" class="answer-history mt-3 flex flex-wrap gap-2 text-sm">{#each [...incorrectHistory].reverse() as attempt}<li class="rounded-xl bg-base-200 text-base-content px-3 py-2 answer-incorrect">{attempt.answer}</li>{/each}</ul>{/if}
<style>
 .key-prefix { border:1px solid var(--color-base-300); border-right:0; padding:0 12px; display:grid; place-items:center; }
 .checker-group { border-radius:var(--radius-field,12px); }
 .answer-feedback,.answer-history li { overflow-wrap:anywhere; }
 .answer-correct { color:var(--color-success-content); }.answer-incorrect { color:var(--color-error-content); }
 .success-glow { box-shadow:0 0 0 3px var(--color-success),0 0 20px color-mix(in srgb,var(--color-success-content) 30%,transparent); }
 .shake-a { animation:answer-shake-a .36s ease-out; }.shake-b { animation:answer-shake-b .36s ease-out; }
 @keyframes answer-shake-a { 0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-4px)}40%,80%{transform:translateX(4px)} }
 @keyframes answer-shake-b { 0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-4px)}40%,80%{transform:translateX(4px)} }
 @media(prefers-reduced-motion:reduce) { .shake-a,.shake-b { animation:none; } }
</style>
