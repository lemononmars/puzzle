<script lang="ts">
import UiArrowLeft from '@lucide/svelte/icons/arrow-left';
	import { onMount } from 'svelte';
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import AnswerChecker from '#lib/components/AnswerChecker.svelte';
	import TBS2021Writeup from '#lib/components/TBS2021Writeup.svelte';
	import { letterTable, round1Puzzles, round2Puzzles, submitTBSAnswer } from '#lib/data/puzzles/tbs2021.js';
	let tab = $state<'round1'|'round2'|'writeup'>('round1');
	let round1Index = $state(1);
	let round2Index = $state(0);
	let answer = $state<string | number>('');
	let message = $state('');
	let feedback = $state<{answer:string;correct:boolean;id:number}|null>(null);
	let sequence = 0;
	let marks = $state<number[]>(Array(25).fill(0));
	const markKey = 'tbs2021-letter-marks';
	onMount(() => {
		try {
			const saved=JSON.parse(localStorage.getItem(markKey)||'null') || JSON.parse(localStorage.getItem('saveTBS2021Puzzles_v2')||'null')?.letterStates?.flat();
			if(Array.isArray(saved) && saved.length===25 && saved.every(value=>[0,1,2].includes(value))) marks=saved;
		} catch {}
	});
	function saveMarks() { try {localStorage.setItem(markKey,JSON.stringify(marks));} catch {} }
	function markCell(index:number) { marks[index]=(marks[index]+1)%3;saveMarks(); }
	function resetMarks() { marks=Array(25).fill(0);saveMarks(); }
	function resetAnswer() { answer='';message='';feedback=null; }
	function selectTab(next: typeof tab) { tab=next;resetAnswer(); }
	function choose(index:number) { if(tab==='round1')round1Index=index;else round2Index=index;resetAnswer(); }
	function check() {
		const submittedAnswer=String(answer).trim();
		if(!submittedAnswer)return;
		const result=submitTBSAnswer(tab==='round1'?0:1,tab==='round1'?round1Index-1:round2Index,submittedAnswer);
		feedback={answer:submittedAnswer,correct:result.isCorrect,id:++sequence};
		message=!result.isCorrect && !result.message.startsWith('ยังไม่ถูก') ? result.message : '';
	}
</script>
<svelte:head><title>TBS2021 · Puzzle archive</title><meta name="description" content="Thailand Board Game Show 2021 puzzles, an interactive letter grid, and the original event writeup." /></svelte:head>
<div class="text-left space-y-6">
	<a href="/portfolio/web-development" class="link link-primary text-sm"><UiArrowLeft size={16} class="inline-block align-middle" aria-hidden="true" /> Web development</a>
	<PageHeading title="TBS2021" eyebrow="THAILAND BOARD GAME SHOW 2021" />
	<nav aria-label="TBS2021 sections" class="flex flex-wrap gap-2">
		<button type="button" class="btn btn-sm {tab==='round1'?'btn-primary text-primary-content':'btn-outline'}" aria-pressed={tab==='round1'} onclick={()=>selectTab('round1')}>Round 1</button>
		<button type="button" class="btn btn-sm {tab==='round2'?'btn-primary text-primary-content':'btn-outline'}" aria-pressed={tab==='round2'} onclick={()=>selectTab('round2')}>Round 2</button>
		<button type="button" class="btn btn-sm {tab==='writeup'?'btn-primary text-primary-content':'btn-outline'}" aria-pressed={tab==='writeup'} onclick={()=>selectTab('writeup')}>Writeup / เบื้องหลัง</button>
	</nav>
	{#if tab==='writeup'}
		<TBS2021Writeup />
	{:else}
		<div class="round-layout">
			<div class="puzzle-column">

				<nav aria-label="Choose a puzzle" class="puzzle-options mb-5">
					{#each (tab==='round1'?round1Puzzles:round2Puzzles) as puzzle,i}<button type="button" class="btn btn-sm {i===(tab==='round1'?round1Index:round2Index)?'btn-primary text-primary-content':'btn-outline'}" aria-pressed={i===(tab==='round1'?round1Index:round2Index)} onclick={()=>choose(i)}>{puzzle.title}</button>{/each}
				</nav>
				<section class="botanical-surface puzzle-panel">
					{#if tab==='round1'}
						{@const puzzle=round1Puzzles[round1Index]}
						<h2 class="puzzle-title">{puzzle.title}</h2>
						{#if round1Index>0}<div class="puzzle-media"><img src={puzzle.icon} alt={puzzle.title} width="320" height="240" /></div>{/if}
						{#key round1Index}<div class="archive-content grid gap-3">{#each puzzle.sections as section}<details><summary class="cursor-pointer text-primary font-bold">{section.title}</summary><div class="mt-3">{@html section.content}</div></details>{/each}</div>{/key}
					{:else}
						{@const puzzle=round2Puzzles[round2Index]}
						<h2 class="puzzle-title">{puzzle.title}</h2>
						<div class="puzzle-media round-two-media"><a href={puzzle.image} target="_blank" rel="noreferrer" aria-label="Open full-size puzzle image"><img src={puzzle.image} alt={puzzle.title} width="1080" height="800" /></a></div>
						{#key round2Index}<details class="archive-content"><summary class="cursor-pointer text-primary font-bold">คำใบ้</summary><div class="mt-3">{@html puzzle.hint}</div></details>{/key}
					{/if}
					{#if tab==='round2'||round1Index>0}<div class="checker-space">{#key `${tab}/${tab === 'round1' ? round1Index : round2Index}`}<AnswerChecker bind:value={answer} on:submit={check} buttonText="check" historyKey={`tbs2021/${tab}/${tab==='round1'?round1Index:round2Index}`} {feedback} />{/key}<p class="extra-feedback" role="status">{message}</p></div>{/if}
				</section>
			</div>
			{#if tab==='round1'}
				<aside class="botanical-surface letter-panel" aria-labelledby="letter-grid-title">
					<div class="flex items-center justify-between gap-3 mb-4"><h2 id="letter-grid-title" class="text-lg font-bold">ตารางตัวอักษร 5×5</h2><button type="button" class="btn btn-sm btn-ghost" onclick={resetMarks}>รีเซ็ต</button></div>
					<div class="letter-grid puzzle-tiles" role="group" aria-label="Interactive 5 by 5 letter table">{#each letterTable.flat() as letter,i}<button type="button" class="letter-cell {marks[i]===1?'bg-primary text-primary-content':marks[i]===2?'bg-accent text-accent-content':'bg-base-200 text-base-content'}" aria-label={`Row ${Math.floor(i/5)+1}, column ${i%5+1}: ${letter}, ${['unmarked','green','peach'][marks[i]]}`} aria-pressed={marks[i]>0} onclick={()=>markCell(i)}>{letter}</button>{/each}</div>
					<p class="botanical-muted text-xs leading-relaxed mt-4">คลิกช่องเพื่อเปลี่ยนสี: ปกติ → เขียว → พีช<br />ใช้ช่วยทดได้ทุกข้อ โดยไม่กระทบการตรวจคำตอบ</p>
				</aside>
			{:else}
				<aside class="botanical-surface room-panel" aria-label="Round 2 room"><a href="/puzzles/tbs2021/round2overview.png" target="_blank" rel="noreferrer" aria-label="Open full-size room image"><img src="/puzzles/tbs2021/round2overview.png" alt="Round 2 room" width="1080" height="675" /></a></aside>
			{/if}
		</div>
	{/if}
</div>
<style>
 .round-layout { display:grid; grid-template-columns:minmax(0,1fr) 330px; align-items:start; gap:24px; overflow-anchor:none; }
 .room-panel { position:sticky; top:90px; min-width:0; }.room-panel img { width:100%; height:auto; border-radius:12px; }
 .puzzle-column { min-width:0; }.puzzle-options { display:flex; flex-wrap:nowrap; gap:6px; max-width:100%; overflow-x:auto; padding:3px 2px 7px; }.puzzle-options button { flex:0 0 auto; height:32px; min-height:32px; padding-inline:12px; font-size:12px; white-space:nowrap; }
 .puzzle-panel { min-height:480px; overflow-anchor:none; }.puzzle-title { font-size:20px; font-weight:700; min-height:32px; margin-bottom:16px; }
 .puzzle-media { height:220px; display:flex; align-items:center; justify-content:center; margin-bottom:20px; }.puzzle-media img { width:auto; max-width:100%; height:100%; object-fit:contain; }.round-two-media { height:420px; }.round-two-media a { display:flex; justify-content:center; width:100%; height:100%; }
 .letter-panel { position:sticky; top:90px; }.letter-grid { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:6px; }.letter-cell { aspect-ratio:1; min-width:0; font-size:24px; font-weight:700; border:1px solid var(--color-base-300); border-radius:10px; }.letter-cell:focus-visible { outline:3px solid var(--color-secondary); outline-offset:2px; }
 .archive-content { line-height:1.8; font-size:14px; }.archive-content :global(img) { height:auto; max-width:100%; }.archive-content :global(iframe) { aspect-ratio:16/9; width:100%; }.checker-space { margin-top:24px; }.extra-feedback { min-height:24px; font-size:13px; margin-top:8px; }
 @media(max-width:850px) { .round-layout { grid-template-columns:minmax(0,1fr); }.letter-panel, .room-panel { position:static; order:-1; }.letter-grid { width:100%; max-width:290px; margin:auto; }.round-two-media { height:300px; } }
</style>
