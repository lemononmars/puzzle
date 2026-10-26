<script lang="ts">
import UiArrowLeft from '@lucide/svelte/icons/arrow-left';
	import AnswerChecker from '#lib/components/AnswerChecker.svelte';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
import CheckCircleIcon from '@lucide/svelte/icons/circle-check';
import RepeatIcon from '@lucide/svelte/icons/repeat';
import CopyIcon from '@lucide/svelte/icons/copy';
import CheckIcon from '@lucide/svelte/icons/check';

	let inputText = 'CODEBREAKER THAILAND';
	let isSwapped = false;
	let isCopied = false;

	function atbashCipher(str: string): string {
		return str
			.toUpperCase()
			.split('')
			.map((ch) => {
				const code = ch.charCodeAt(0);
				if (code >= 65 && code <= 90) {
					return String.fromCharCode(90 - (code - 65));
				}
				return ch;
			})
			.join('');
	}

	$: processedResult = atbashCipher(inputText);

	function copyOutput() {
		navigator.clipboard.writeText(processedResult);
		isCopied = true;
		setTimeout(() => (isCopied = false), 2000);
	}

	// Exercises without hints
	let answers = ['', '', ''];
	let feedback = ['', '', ''];

	const exercises = [
		{ id: 1, cipherText: 'SVOOL', correctAnswer: 'HELLO' },
		{ id: 2, cipherText: 'XLWV', correctAnswer: 'CODE' },
		{ id: 3, cipherText: 'AFAAI', correctAnswer: 'ZUZAR' }
	];

	function checkAnswer(idx: number) {
		const user = answers[idx].trim().toUpperCase();
		if (user === exercises[idx].correctAnswer) {
			feedback[idx] = 'correct';
		} else {
			feedback[idx] = 'incorrect';
		}
	}

	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
	const reversed = 'ZYXWVUTSRQPONMLKJIHGFEDCBA'.split('');
</script>

<svelte:head>
	<title>Chi Fun | Atbash Cipher (รหัสแอตแบช) 🔐</title>
	<meta name="description" content="คู่มือและแบบฝึกหัดรหัสลับสะท้อนกระจก Atbash Cipher" />
</svelte:head>

<div class="flex flex-col gap-8 w-full max-w-5xl mx-auto px-4 py-8 select-none">
	<div class="flex items-center justify-between">
		<a href="/resources/ciphers" class="btn btn-ghost btn-xs gap-1.5 font-bold">
			<UiArrowLeft size={16} class="inline-block align-middle" aria-hidden="true" /> กลับไปคลังรหัสลับ
		</a>
	</div>

	<header class="space-y-2 text-center md:text-left">
		<div class="flex items-center gap-2 justify-center md:justify-start">
			<span class="badge badge-info font-bold text-xs py-2 px-3">EASY - MEDIUM</span>
			<span class="text-xs text-base-content/70 font-mono uppercase tracking-wider">Mirror Substitution</span>
		</div>
		<h1 class="text-3xl lg:text-4xl font-black text-base-content">Atbash Cipher (รหัสแอตแบช)</h1>
		<p class="text-base-content/70 text-sm lg:text-base leading-relaxed">
			Atbash Cipher เป็นรหัสลับแบบสลับตัวอักษรเป็นกระจกสะท้อน (A ↔ Z, B ↔ Y, C ↔ X) การเข้ารหัสและถอดรหัสใช้ฟังก์ชันเดียวกัน
		</p>
	</header>

	<!-- Mirror Table -->
	<section class="botanical-card bg-base-200 p-6 rounded-3xl border border-base-300 shadow-xl space-y-4">
		<h2 class="text-xl font-extrabold text-primary flex items-center gap-2">
			<span>🪞</span> ตารางสลับตัวอักษรแบบกระจก (Atbash Mirror Grid)
		</h2>

		<div class="overflow-x-auto">
			<div class="grid grid-rows-2 gap-1 font-mono text-center text-xs min-w-[600px]">
				<div class="flex gap-1">
					{#each alphabet as char}
						<div class="flex-1 bg-base-100 text-base-content p-2 rounded-t font-bold text-amber-400 border border-base-300">{char}</div>
					{/each}
				</div>
				<div class="flex gap-1">
					{#each reversed as char}
						<div class="flex-1 bg-base-100 text-base-content p-2 rounded-b font-bold text-primary border border-base-300">{char}</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- Converter Tool -->
	<section class="botanical-card bg-base-200 p-6 rounded-3xl border border-base-300 shadow-xl space-y-4">
		<div class="flex items-center justify-between flex-wrap gap-2">
			<h2 class="text-xl font-extrabold text-accent-content flex items-center gap-2">
				<span>⚡</span> เครื่องมือแปลงรหัส (Converter)
			</h2>
			<button
				on:click={() => (isSwapped = !isSwapped)}
				class="btn btn-outline btn-xs gap-1.5 font-bold"
			>
				<RepeatIcon size={14} />
				<span>{isSwapped ? 'สลับฝั่ง (ผลลัพธ์ ซ้าย | ข้อความ ขวา)' : 'สลับฝั่ง (ข้อความ ซ้าย | ผลลัพธ์ ขวา)'}</span>
			</button>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
			<!-- Input Column -->
			<div class="botanical-card bg-base-100 text-base-content p-5 rounded-2xl border border-base-300 flex flex-col justify-between space-y-3 {isSwapped ? 'order-2' : 'order-1'}">
				<div>
					<label for="atbash-input-text" class="block text-xs font-semibold text-base-content/70 mb-2">ข้อความ (Input):</label>
					<textarea
						id="atbash-input-text"
						bind:value={inputText}
						rows="4"
						placeholder="พิมพ์ข้อความภาษาอังกฤษ..."
						class="textarea  w-full bg-base-100 text-base-content font-mono text-sm uppercase focus:textarea-primary"
					></textarea>
				</div>
				<span class="text-[11px] text-base-content/70">สลับตัวอักษรเป็นกระจกสะท้อนแบบสมมิติ</span>
			</div>

			<!-- Output Column -->
			<div class="botanical-card bg-base-100 text-base-content p-5 rounded-2xl border border-base-300 flex flex-col justify-between space-y-3 {isSwapped ? 'order-1' : 'order-2'}">
				<div>
					<div class="flex items-center justify-between mb-2">
						<span class="block text-xs font-semibold text-base-content/70">ผลลัพธ์ (Output):</span>
						<button on:click={copyOutput} class="btn btn-ghost btn-xs gap-1 text-base-content/70 hover:text-base-content">
							{#if isCopied}
								<CheckIcon size={14} class="text-success-content" />
								<span class="text-success-content">คัดลอกแล้ว</span>
							{:else}
								<CopyIcon size={14} />
								<span>คัดลอกข้อความ</span>
							{/if}
						</button>
					</div>

					<div class="bg-base-100 text-base-content p-4 rounded-xl border border-base-300 min-h-[110px] font-mono text-lg text-primary tracking-widest break-words flex items-center">
						{processedResult || 'พิมพ์ข้อความเพื่อดูผลลัพธ์...'}
					</div>
				</div>

				<span class="text-[11px] text-base-content/70">ผลลัพธ์สลับ A↔Z, B↔Y, C↔X</span>
			</div>
		</div>
	</section>

	<!-- Practice Exercises -->
	<section class="botanical-card bg-base-200 p-6 rounded-3xl border border-base-300 shadow-xl space-y-6">
		<h2 class="text-xl font-extrabold text-warning-content flex items-center gap-2">
			<span>✏️</span> แบบฝึกหัดทดลองถอดรหัส (Practice Exercises)
		</h2>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			{#each exercises as ex, idx}
				<div class="botanical-card bg-base-100 text-base-content p-5 rounded-2xl border border-base-300 space-y-3 flex flex-col justify-between">
					<div class="space-y-3">
						<span class="font-bold text-xs text-base-content/70">ข้อที่ {ex.id}</span>

						<div class="bg-base-100 text-base-content p-3 rounded-xl border border-base-300 font-mono text-lg text-primary tracking-widest text-center min-h-[60px] flex items-center justify-center">
							{ex.cipherText}
						</div>
					</div>

					<div class="space-y-2 pt-2">
						<AnswerChecker
							bind:value={answers[idx]}
							placeholder="พิมพ์คำตอบ..."
							buttonText="ตรวจ"
							btnClass="btn-primary text-primary-content"
							size="sm"
							on:submit={() => checkAnswer(idx)}
						/>

						{#if feedback[idx] === 'correct'}
							<div class="flex items-center gap-1 text-xs font-bold text-success-content">
								<CheckCircleIcon size={14} />
								<span>ถูกต้อง!</span>
							</div>
						{:else if feedback[idx] === 'incorrect'}
							<div class="text-xs font-bold text-error-content">
								✕ ยังไม่ถูกต้อง
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</section>
</div>
