<script lang="ts">
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import Surface from '#lib/components/ui/Surface.svelte';
	import KeyboardLayout from '#lib/components/KeyboardLayout.svelte';
	import Keyboard from '@lucide/svelte/icons/keyboard';
	import type { PageData } from './$types';
	import { letterBoxes } from '#lib/data/puzzles/crypticClue.js';
	export let data: PageData;
	let answer: string | number = '';
	let feedback: { answer: string; correct: boolean; id: number } | null = null;
	let usedHints: string[] = [];
	let activeHint = '';
	let solutionVisible = false;
	let keyboardVisible = false;
	let answerInput: HTMLInputElement;
	let correctDialog: HTMLDialogElement;
	const hintColors: Record<string, string> = {
		definition: 'bg-info text-info-content',
		wordplay: 'bg-success text-success-content',
		fodder: 'bg-secondary text-secondary-content'
	};
	function focusBox(index: number) {
		answerInput.focus();
		const position = letterBoxes(String(answer)).slice(0, index + 1).join('').length;
		answerInput.setSelectionRange(position, position);
	}
	function updateAnswer(value: string) {
		answer = letterBoxes(value).slice(0, data.puzzle.boxCount).join('');
		feedback = null;
	}
	function keyboardType(event: CustomEvent<string>) {
		const value = String(answer);
		const start = answerInput?.selectionStart ?? value.length;
		const end = answerInput?.selectionEnd ?? start;
		const key = event.detail;
		const cut = key === '⬅' && start === end ? Math.max(0, start - 1) : start;
		updateAnswer(value.slice(0, cut) + (key === '⬅' ? '' : key) + value.slice(end));
		answerInput.value = String(answer);
		const position = key === '⬅' ? cut : start + key.length;
		answerInput.setSelectionRange(position, position);
	}
	$: selectedHint = data.puzzle.hints.find(hint => hint.key === activeHint);
	$: clueSegments = highlightParts(data.puzzle.clue, selectedHint?.parts ?? []);
	function highlightParts(clue: string, parts: string[]) {
		const ranges = parts.map(part => ({ start: clue.indexOf(part), end: clue.indexOf(part) + part.length })).filter(range => range.start >= 0).sort((a, b) => a.start - b.start);
		const segments: { text: string; highlighted: boolean }[] = [];
		let cursor = 0;
		for (const range of ranges) {
			if (range.start < cursor) continue;
			if (range.start > cursor) segments.push({ text: clue.slice(cursor, range.start), highlighted: false });
			segments.push({ text: clue.slice(range.start, range.end), highlighted: true });
			cursor = range.end;
		}
		if (cursor < clue.length) segments.push({ text: clue.slice(cursor), highlighted: false });
		return segments;
	}
	$: typedBoxes = letterBoxes(solutionVisible ? data.puzzle.answer : String(answer));
	function useHint(key: string) {
		activeHint = key;
		if (!usedHints.includes(key)) usedHints = [...usedHints, key];
	}
	function resetForPuzzle(_id: string) {
		answer = '';
		feedback = null;
		usedHints = [];
		activeHint = '';
		solutionVisible = false;
		keyboardVisible = false;
		correctDialog?.close();
	}
	$: resetForPuzzle(data.puzzle.id);
	function check() {
		const submitted = String(answer).trim();
		feedback = { answer: submitted, correct: submitted.normalize('NFC') === data.puzzle.answer.normalize('NFC'), id: Date.now() };
		if (feedback.correct) correctDialog.showModal();
	}
</script>

<svelte:head><title>{data.puzzle.title} · Cryptic Clue</title></svelte:head>

<div class="mx-auto max-w-2xl px-4 py-6">
	<a class="link mb-4 inline-block text-sm" href="/puzzles/cryptic">← Cryptic Clue / ศัพท์ซับซ้อน</a>
	<PageHeading title={data.puzzle.title} description="หาคำตอบภาษาไทยที่ตรงทั้งความหมายและกลไกของคำใบ้" />
	{#key data.puzzle.id}
		<Surface class="text-center">
			<p lang="th" class="clue mb-6 font-semibold">
				{#each clueSegments as segment}{#if segment.highlighted && selectedHint}<mark class="{hintColors[selectedHint.key]} rounded px-1">{segment.text}</mark>{:else}{segment.text}{/if}{/each}
				<span class="whitespace-nowrap text-base font-normal">({data.puzzle.boxCount})</span>
			</p>
			<form on:submit|preventDefault={check}>
				<div class="answer-boxes relative mb-5 flex flex-wrap justify-center gap-2" role="group" aria-label="คำตอบ {data.puzzle.boxCount} ช่องอักษร">
					<input class="sr-only" bind:this={answerInput} value={answer} on:input={(event) => { updateAnswer(event.currentTarget.value); event.currentTarget.value = String(answer); }} aria-label="คำตอบภาษาไทย" inputmode="none" autocomplete="off" spellcheck="false" disabled={solutionVisible} />
					{#each Array(data.puzzle.boxCount) as _, index}<button type="button" class="letter-box bg-base-100 text-base-content border border-base-300" disabled={solutionVisible} on:click={() => focusBox(index)} aria-label="ช่อง {index + 1}{typedBoxes[index] ? ': ' + typedBoxes[index] : ': ว่าง'}">{typedBoxes[index] || ''}</button>{/each}
				</div>
				<div class="flex flex-wrap justify-center gap-2">
					<button type="submit" class="btn btn-primary" disabled={solutionVisible}>ตรวจคำตอบ</button>
					<button type="button" class="btn btn-outline mobile-keyboard-toggle" aria-expanded={keyboardVisible} aria-controls="cryptic-keyboard" on:click={() => keyboardVisible = !keyboardVisible}><Keyboard size={18} />{keyboardVisible ? 'ซ่อนแป้นพิมพ์' : 'แสดงแป้นพิมพ์'}</button>
				</div>
			</form>
			{#if feedback && !feedback.correct}<p role="status" class="mt-3 font-semibold">ยังไม่ถูก ลองอีกครั้ง</p>{/if}
			{#if keyboardVisible}<div id="cryptic-keyboard" class="mt-4 text-base-content"><KeyboardLayout on:type={keyboardType} /></div>{/if}
			<div class="mt-6 flex flex-wrap justify-center gap-2" role="group" aria-label="คำใบ้สามส่วน">
				{#each data.puzzle.hints as hint}<button type="button" class="btn btn-sm hint-button {hintColors[hint.key]}" class:hint-active={activeHint === hint.key} aria-pressed={activeHint === hint.key} on:click={() => useHint(hint.key)}>{hint.label}{usedHints.includes(hint.key) ? ' ✓' : ''}</button>{/each}
			</div>
			<p class="mt-3 min-h-12 leading-relaxed" aria-live="polite">{selectedHint ? selectedHint.text : 'เลือกคำใบ้เพื่อไฮไลต์ส่วนที่เกี่ยวข้องในโจทย์'}</p>
			<button class="btn btn-outline mt-3" disabled={usedHints.length < 3} on:click={() => solutionVisible = true}>เฉลย / Solution ({usedHints.length}/3)</button>
			{#if usedHints.length < 3}<p class="botanical-muted mt-2 text-sm">ใช้คำใบ้ทั้งสามส่วนเพื่อปลดล็อกเฉลย</p>{/if}
			{#if solutionVisible && usedHints.length === 3}<div class="mt-4 rounded-xl border border-base-300 p-4"><p class="font-bold">{data.puzzle.answer}</p><p class="mt-2 leading-relaxed">{data.puzzle.explanation}</p></div>{/if}
		</Surface>
	{/key}
	<a class="link mt-6 inline-block text-sm" href="/puzzles/cryptic/guide">อ่านคู่มือ / Read the guide</a>
</div>

<dialog bind:this={correctDialog} class="modal" aria-labelledby="correct-title">
	<div class="modal-box bg-base-100 text-base-content text-center">
		<h2 id="correct-title" class="text-2xl font-bold">ถูกต้อง!</h2>
		<div class="modal-action justify-center"><form method="dialog"><button class="btn btn-primary">ปิด</button></form></div>
	</div>
	<form method="dialog" class="modal-backdrop"><button aria-label="ปิด">ปิด</button></form>
</dialog>

<style>
	.clue { font-size: clamp(1.9rem, 5vw, 2.65rem); line-height: 1.8; overflow-wrap: anywhere; }
	.letter-box { width: 2.75rem; height: 3.5rem; border-radius: .5rem; display: grid; place-items: center; font-size: 1.6rem; }
	.answer-boxes:focus-within { outline: 2px solid var(--color-primary); outline-offset: 5px; border-radius: .5rem; }
	.mobile-keyboard-toggle { display: none; }
	.hint-active { outline: 2px solid currentColor; outline-offset: 3px; }
	@media (max-width: 767px), (pointer: coarse) { .mobile-keyboard-toggle { display: inline-flex; } }
</style>
