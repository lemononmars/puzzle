<script lang="ts">
	import { tick } from 'svelte';
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import { username } from '#lib/store/index.js';
	import { thaiLanguageQuestions } from '#lib/data/puzzles/thaiLanguage.js';
	type Message = { role: 'student' | 'examiner'; text?: string; image?: string; alt?: string };
	let log = $state<Message[]>([]);
	let message = $state('');
	let stage = $state(0);
	let busy = $state(false);
	let bonusHintSeen = $state(false);
	let bonusComplete = $state(false);
	let error = $state('');
	let bottom: HTMLDivElement;
	let name = $derived($username?.trim() && !/^(guest|ผู้เยี่ยมชม)$/i.test($username.trim()) ? ` ${$username.trim()}` : '');
	function reset() { log = []; message = ''; stage = 0; bonusHintSeen = false; bonusComplete = false; error = ''; }
	async function send() {
		if (busy || !message.trim()) return;
		const submitted = message.trim();
		log = [...log, { role: 'student', text: submitted }]; message = ''; busy = true; error = '';
		try {
			const response = await fetch('/api/puzzles/thai-language/check', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stage, message: submitted, bonusHintSeen }) });
			if (!response.ok) throw new Error('Unavailable');
			const reply = await response.json();
			log = [...log, { role: 'examiner', text: reply.text }];
			if (reply.bonusHintSeen) bonusHintSeen = true;
			if (reply.bonus && !bonusComplete) {
				bonusComplete = true;
				log = [...log, { role: 'examiner', image: 'final.jpg', alt: 'คะแนนสอบ ๖/๕ เจ๋งเป้ง ! ทำคะแนนได้เกินคะแนนเต็มอีก คุณได้รับการขนานนามทั้งผู้เชี่ยวชาญภาษาไทย และนักพิชิตปริศนา ! สุดยอด' }];
			} else if (reply.next) {
				stage = reply.next;
				if (stage <= 5) {
					const question = thaiLanguageQuestions[stage - 1];
					log = [...log, { role: 'examiner', image: `${question.image}.png`, alt: question.transcript }];
				} else log = [...log, { role: 'examiner', image: 'complete.png', alt: 'คะแนนสอบ ๕/๕ ขอแสดงความยินดีด้วย ! คุณคือผู้เชี่ยวชาญการใช้ภาษาไทย รอบหน้าตั้งเป้าหมายให้ได้คะแนนสูงขึ้นไปอีก !' }];
			}
		} catch { error = 'ส่งข้อความไม่ได้ กรุณาลองอีกครั้ง'; message = submitted; }
		finally { busy = false; await tick(); bottom?.scrollIntoView({ block: 'nearest', behavior: 'instant' }); }
	}
</script>

<svelte:head><title>ปริศนาภาษาไทย · Chi Fun</title><meta name="description" content="การสอบวิชาภาษาไทยผ่านแชทกับผู้คุมสอบ" /></svelte:head>

<div class="mx-auto max-w-4xl px-4 py-6">
	<a class="link mb-3 inline-block text-sm" href="/puzzles/explore">← Explore</a>
	<div class="flex flex-wrap items-start justify-between gap-3"><PageHeading title="ปริศนาภาษาไทย" /><button class="btn btn-sm btn-ghost" disabled={busy} onclick={reset}>เริ่มใหม่</button></div>
	<section class="rounded-2xl border border-base-300 bg-base-200 text-base-content p-3 sm:p-5" aria-label="แชทกับผู้คุมสอบ">
		<div class="chat chat-start"><div class="chat-header mb-1">ผู้คุมสอบ</div><div class="chat-bubble max-w-full bg-base-100 text-base-content space-y-4 leading-relaxed">
			<p>สวัสดีนักศึกษา{name}<br />ต่อไปนี้จะเป็นการสอบวิชาภาษาไทย<br />มีข้อสอบทั้งหมด ๖ ข้อด้วยกัน</p>
			<p><span class="start-arrow" aria-hidden="true">➜</span> พิมพ์คำว่า <strong>เริ่ม</strong> เพื่อรับข้อสอบข้อแรก</p>
			<p><span class="answer-check" aria-hidden="true">✔</span> เมื่อทราบคำตอบแล้ว ให้พิมพ์คำตอบมาในช่องแชทนี้ โดยพิมพ์เป็นตัวอักษรติดกัน ไม่มีช่องว่างและลบสัญลักษณ์อื่นออก ถ้าคำตอบถูกต้องจึงจะได้ข้อสอบข้อต่อไป</p>
			<p><span aria-hidden="true">❔</span> ถ้ามีข้อสงสัย ให้สอบถามผู้คุมสอบด้วยการพิมพ์ <strong>ใบ้#</strong> เมื่อ # แทนตัวเลขข้อ (เช่น ใบ้3)</p>
		</div></div>
		<div role="log" aria-label="ประวัติการสนทนา" aria-live="polite" aria-relevant="additions">
			{#each log as entry, index}
				<div class="chat" class:chat-start={entry.role === 'examiner'} class:chat-end={entry.role === 'student'}><div class="chat-header mb-1">{entry.role === 'examiner' ? 'ผู้คุมสอบ' : 'คุณ'}</div><div class="chat-bubble max-w-full {entry.role === 'student' ? 'bg-primary text-primary-content' : 'bg-base-100 text-base-content'}">
					{#if entry.image}<img src="/puzzles/thai-language/{entry.image}" alt={entry.alt} width={entry.image === 'final.jpg' ? 1280 : 1243} height={entry.image === 'final.jpg' ? 853 : 794} class="h-auto w-full rounded-lg" onload={(event) => { if (index === log.length - 1) event.currentTarget.scrollIntoView({ block: 'start', behavior: 'instant' }); }} />{:else}<p class="whitespace-pre-wrap break-words leading-relaxed">{entry.text}</p>{/if}
				</div></div>
			{/each}
		</div>
		<div bind:this={bottom}></div>
		{#if error}<p role="alert" class="mt-3">{error}</p>{/if}
		<form class="sticky bottom-20 z-10 mt-5 flex gap-2 rounded-xl border border-base-300 bg-base-100 text-base-content p-2 lg:bottom-3" onsubmit={(event) => { event.preventDefault(); send(); }}>
			<input class="input min-w-0 flex-1 bg-base-100 text-base-content" aria-label="ข้อความถึงผู้คุมสอบ" bind:value={message} maxlength="100" placeholder="พิมพ์ข้อความ…" autocomplete="off" />
			<button class="btn btn-primary" type="submit" disabled={busy || !message.trim()}>{busy ? 'กำลังส่ง…' : 'ส่ง'}</button>
		</form>
	</section>
</div>

<style>.start-arrow { color: #c43636; }.answer-check { color: #286aa1; }</style>


