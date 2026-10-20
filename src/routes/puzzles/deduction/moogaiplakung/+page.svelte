<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
import ChevronUpIcon from '@lucide/svelte/icons/chevron-up';

	// Rich pool of Thai words (excluding "หมู", "ไก่", "ปลา", "กุ้ง")
	const thaiWords = [
		// 10: Lower only (ุ, ู)
		'ปู', 'กู', 'รู', 'งู', 'หรู', 'จูบ', 'ดู', 'ครู', 'สูตร', 'หู', 'หนู', 'พูด', 'สูบ', 'ตรู',
		// 20: Upper only (ั, ิ, ี, ึ, ื, ็, ่, ้, ๊, ๋, ์)
		'กิน', 'กิ๊ก', 'ช้าง', 'นก', 'ม้า', 'ลิง', 'วิ่ง', 'เป็ด', 'ส้ม', 'ปลั๊ก', 'บ้าน', 'ดิน', 'มด', 'วิ่ง',
		// 30: Neither upper nor lower
		'กลม', 'คน', 'ชาม', 'หมา', 'มอง', 'ดาว', 'ปาก', 'ตา', 'ทาง', 'ลม', 'กวาง', 'สด', 'ขวด', 'ทาง',
		// 40: Both upper AND lower
		'มุ้ง', 'กุ๊ก', 'ปู๊น', 'พรุ่ง', 'อุ้ม', 'ยุ่ง', 'ตุ๊ก', 'ผึ้ง', 'ฟุ้ง', 'คุ้ม', 'ดิ้ง', 'ซุ้ม', 'ฟุ้ง'
	];

	let currentWord = 'ปู';
	let thaiStreak = 0;
	let thaiMessage = '';
	let thaiStatus: 'neutral' | 'correct' | 'incorrect' = 'neutral';
	let thaiSolved = false;
	let showHistory = false;

	interface IThaiHistoryItem {
		word: string;
		guess: number;
		correctPrice: number;
		isCorrect: boolean;
	}
	let history: IThaiHistoryItem[] = [];

	// Dynamic calculation of word price based on Thai diacritics
	function getThaiWordPrice(word: string): number {
		const hasLower = /[\u0E38\u0E39\u0E3A]/.test(word); // ุ, ู, ฺ
		const hasUpper = /[\u0E31\u0E34-\u0E37\u0E47-\u0E4E]/.test(word); // ั, ิ, ี, ึ, ื, ็, ่, ้, ๊, ๋, ์

		if (hasLower && !hasUpper) return 10;
		if (!hasLower && hasUpper) return 20;
		if (!hasLower && !hasUpper) return 30;
		return 40; // hasLower && hasUpper
	}

	function pickNextWord() {
		const next = thaiWords[Math.floor(Math.random() * thaiWords.length)];
		currentWord = next;
	}

	function handleChoice(choice: number) {
		if (thaiSolved) return;

		const target = getThaiWordPrice(currentWord);
		const isCorrect = choice === target;

		history = [
			{
				word: currentWord,
				guess: choice,
				correctPrice: target,
				isCorrect
			},
			...history
		];

		if (isCorrect) {
			thaiStreak += 1;
			thaiStatus = 'correct';
			thaiMessage = `ถูกต้อง! (${currentWord} = ${target})`;
			if (thaiStreak >= 5) {
				thaiSolved = true;
			} else {
				pickNextWord();
			}
		} else {
			thaiStreak = 0;
			thaiStatus = 'incorrect';
			thaiMessage = `คำตอบยังไม่ถูกต้อง (คำตอบที่ถูกคือ ${target})`;
			pickNextWord();
		}
	}

	function resetGame() {
		thaiStreak = 0;
		thaiMessage = '';
		thaiStatus = 'neutral';
		thaiSolved = false;
		history = [];
		pickNextWord();
	}

	onMount(() => {
		pickNextWord();
	});
</script>

<svelte:head>
	<title>Puzzle | หมู ไก่ ปลา กุ้ง 🦐</title>
	<meta
		name="description"
		content="เกมไขความลับจากรูปคำภาษาไทย หมู ไก่ ปลา กุ้ง"
	/>
</svelte:head>

<div class="flex flex-col gap-8 w-full max-w-2xl mx-auto px-4 py-8 select-none">
	<!-- Navigation -->
	<div class="flex items-center justify-between">
		<a href="/puzzles/deduction" class="btn btn-ghost btn-xs gap-1.5 font-bold text-base-content/70 hover:text-base-content">
			<ArrowLeftIcon size={14} />
			<span>กลับไปหน้า Deduction Games</span>
		</a>
	</div>

	<!-- Main Game Card -->
	<section class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl">
		<!-- Header Info -->
		<div class="space-y-2 text-center">
			<h1 class="text-2xl sm:text-4xl font-black text-base-content">หมู ไก่ ปลา กุ้ง</h1>
			<p class="text-xs sm:text-sm text-base-content/70 font-medium leading-relaxed">
				หมู = 10, ไก่ = 20, ปลา = 30, กุ้ง = 40, แล้วของต่อไปนี้ราคาเท่าไหร่
			</p>

			<!-- 5 Circles Streak Indicator (Red turns Green) -->
			<div class="flex items-center justify-center gap-2 pt-3">
				{#each Array(5) as _, i}
					<div
						class="w-4 h-4 rounded-full transition-all duration-300 shadow-md border
						{i < thaiStreak
							? 'bg-emerald-500 border-primary/30 scale-110 shadow-emerald-500/50'
							: 'bg-rose-500/80 border-rose-600/40 opacity-50'}"
					></div>
				{/each}
			</div>
		</div>

		<!-- Target Word Display -->
		<div class="botanical-card bg-base-100 text-base-content p-8 rounded-2xl border border-base-300 flex flex-col items-center justify-center shadow-inner space-y-1">
			<span class="text-xs font-bold text-base-content/70 uppercase tracking-widest">คำปริศนา</span>
			<div class="text-5xl sm:text-6xl font-black text-primary tracking-wide py-2">
				{currentWord}
			</div>
		</div>

		<!-- Message Feedback -->
		{#if thaiMessage}
			<div class="alert text-xs font-bold rounded-xl py-2 px-3
				{thaiStatus === 'correct' ? 'alert-success' : ''}
				{thaiStatus === 'incorrect' ? 'alert-error' : ''}">
				<span>{thaiMessage}</span>
			</div>
		{/if}

		<!-- Congratulations Banner (When streak reaches 5) -->
		{#if thaiSolved}
			<div class="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-6 text-center space-y-3 animate-fade-in">
				<div class="text-4xl">🎉</div>
				<h3 class="text-xl sm:text-2xl font-black text-primary">
					ยินดีด้วย! คุณถอดรหัสสำเร็จแล้ว!
				</h3>
				<p class="text-xs sm:text-sm text-base-content/70 font-light">
					คุณไขความลับราคาสินค้าภาษาไทยได้สำเร็จครบ 5 ครั้งติดต่อกัน!
				</p>
				<button on:click={resetGame} class="btn btn-indigo btn-sm rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-content border-none px-6 mt-2">
					เล่นอีกครั้ง
				</button>
			</div>
		{:else}
			<!-- Single Row Options (10, 20, 30, 40) -->
			<div class="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto">
				{#each [10, 20, 30, 40] as opt}
					<button
						on:click={() => handleChoice(opt)}
						class="btn bg-base-100 text-base-content hover:bg-indigo-500/20 text-base-content/70 hover:text-primary border border-base-300 hover:border-indigo-500/50 rounded-2xl font-bold py-3 text-lg sm:text-xl shadow-md transition-all active:scale-95"
					>
						{opt}
					</button>
				{/each}
			</div>
		{/if}

		<!-- Expandable History Badges -->
		{#if history.length > 0}
			<div class="border-t border-base-300 pt-4 space-y-3">
				<button
					on:click={() => (showHistory = !showHistory)}
					class="btn btn-ghost btn-xs text-xs text-base-content/70 hover:text-base-content flex items-center justify-between w-full font-bold"
				>
					<span>ประวัติการตอบ ({history.length} รายการ)</span>
					{#if showHistory}
						<ChevronUpIcon size={14} />
					{:else}
						<ChevronDownIcon size={14} />
					{/if}
				</button>

				{#if showHistory}
					<div class="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1 pt-1">
						{#each history as item}
							<span class="badge badge-xl p-3 sm:p-4 gap-2.5 font-mono border text-sm shadow-sm
								{item.isCorrect
									? 'bg-emerald-500/20 text-primary border-primary/30'
									: 'bg-rose-500/20 text-error-content border-rose-500/40'}">
								<span class="font-bold text-base-content/70">{item.word}</span>
								<span class="text-base-content/70">→</span>
								<span class="font-bold">{item.guess}</span>
								<span class="text-xs opacity-80">{item.isCorrect ? '✓' : `(เฉลย ${item.correctPrice})`}</span>
							</span>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</section>
</div>
