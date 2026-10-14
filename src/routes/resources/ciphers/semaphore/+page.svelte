<script lang="ts">
	import AnswerChecker from '#lib/components/AnswerChecker.svelte';
	import { ArrowLeftIcon, FlagIcon, CheckCircleIcon } from 'svelte-feather-icons';

	let inputText = 'CODEBREAKER';

	// Semaphore flag angle definitions (in degrees from 12 o'clock / top)
	// Angles: 0=Top, 45=NE, 90=E, 135=SE, 180=S, 225=SW, 270=W, 315=NW
	const semaphoreData: Record<string, { arm1: number; arm2: number }> = {
		A: { arm1: 180, arm2: 225 },
		B: { arm1: 180, arm2: 270 },
		C: { arm1: 180, arm2: 315 },
		D: { arm1: 180, arm2: 0 },
		E: { arm1: 180, arm2: 45 },
		F: { arm1: 180, arm2: 90 },
		G: { arm1: 180, arm2: 135 },
		H: { arm1: 270, arm2: 225 },
		I: { arm1: 270, arm2: 315 },
		J: { arm1: 90, arm2: 0 },
		K: { arm1: 0, arm2: 225 },
		L: { arm1: 45, arm2: 225 },
		M: { arm1: 90, arm2: 225 },
		N: { arm1: 135, arm2: 225 },
		O: { arm1: 270, arm2: 45 },
		P: { arm1: 0, arm2: 270 },
		Q: { arm1: 45, arm2: 270 },
		R: { arm1: 90, arm2: 270 },
		S: { arm1: 135, arm2: 270 },
		T: { arm1: 0, arm2: 315 },
		U: { arm1: 45, arm2: 315 },
		V: { arm1: 0, arm2: 135 },
		W: { arm1: 90, arm2: 45 },
		X: { arm1: 135, arm2: 45 },
		Y: { arm1: 90, arm2: 315 },
		Z: { arm1: 135, arm2: 90 }
	};

	const letters = Object.keys(semaphoreData);

	// Helper to calculate X2, Y2 coordinates for arm line
	function getArmCoords(deg: number, len = 28) {
		const rad = ((deg - 90) * Math.PI) / 180;
		return {
			x: 40 + len * Math.cos(rad),
			y: 40 + len * Math.sin(rad)
		};
	}

	// Practice Exercises
	let answers = ['', '', ''];
	let feedback = ['', '', ''];

	const exercises = [
		{ id: 1, word: 'FLAG', correctAnswer: 'FLAG' },
		{ id: 2, word: 'SHIP', correctAnswer: 'SHIP' },
		{ id: 3, word: 'NAVY', correctAnswer: 'NAVY' }
	];

	function checkAnswer(idx: number) {
		const user = answers[idx].trim().toUpperCase();
		if (user === exercises[idx].correctAnswer) {
			feedback[idx] = 'correct';
		} else {
			feedback[idx] = 'incorrect';
		}
	}
</script>

<svelte:head>
	<title>Code Breaker | Semaphore Cipher (รหัสธงสัญญาณ) 🚩</title>
	<meta name="description" content="ระบบเรียนรู้และถอดรหัสธงสัญญาณ (Flag Semaphore Cipher) สำหรับนักไขปริศนา" />
</svelte:head>

<div class="flex flex-col gap-8 w-full max-w-5xl mx-auto px-4 py-8 select-none">
	<!-- Navigation -->
	<div class="flex items-center justify-between">
		<a href="/resources/ciphers" class="btn btn-ghost btn-xs gap-1.5 font-bold text-base-content/70 hover:text-base-content">
			<ArrowLeftIcon size="14" />
			<span>กลับไปหน้า Cipher Library</span>
		</a>
	</div>

	<!-- Header -->
	<header class="text-center max-w-2xl mx-auto space-y-3">
		<div class="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 mx-auto shadow-lg shadow-amber-500/5">
			<FlagIcon size="32" />
		</div>
		<h1 class="text-3xl lg:text-4xl font-black tracking-tight text-base-content">
			Flag Semaphore (รหัสธงสัญญาณ) 🚩
		</h1>
		<p class="text-base-content/70 text-sm lg:text-base leading-relaxed">
			รหัสสื่อสารด้วยการชูธงสองมือในมุมต่างๆ ซึ่งนิยมใช้มากในกิจการทหารเรือ ลอร์ดเบเดน โพเอลล์ (ลูกเสือ) และปริศนาแนวภาพ
		</p>
	</header>

	<!-- Interactive Converter Section -->
	<section class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-3xl p-6 shadow-xl space-y-6">
		<div class="space-y-2">
			<label for="semaphore-input-text" class="text-sm font-bold text-base-content/70">ใส่ข้อความภาษาอังกฤษ (A-Z):</label>
			<input
				id="semaphore-input-text"
				type="text"
				bind:value={inputText}
				placeholder="พิมพ์ข้อความที่ต้องการแปลงเป็นรหัสธง..."
				class="input  w-full bg-base-100 text-base-content border-base-300 text-base-content font-mono uppercase text-base rounded-xl focus:border-amber-500"
			/>
		</div>

		<!-- Rendered Flags Display -->
		<div class="space-y-3">
			<h3 class="text-sm font-bold text-amber-400">ผลลัพธ์แสดงรูปธงสัญญาณ:</h3>
			<div class="botanical-card flex flex-wrap gap-3 bg-base-100 text-base-content p-4 rounded-2xl border border-base-300 min-h-[120px] items-center">
				{#each inputText.toUpperCase().replace(/[^A-Z]/g, '').split('') as char}
					{@const data = semaphoreData[char]}
					{#if data}
						{@const arm1 = getArmCoords(data.arm1)}
						{@const arm2 = getArmCoords(data.arm2)}
						<div class="flex flex-col items-center gap-1 bg-base-100 text-base-content p-2 rounded-xl border border-base-300">
							<svg class="w-16 h-16 bg-base-100 text-base-content rounded-lg" viewBox="0 0 80 80">
								<circle cx="40" cy="30" r="6" fill="#94a3b8" />
								<line x1="40" y1="36" x2="40" y2="60" stroke="#94a3b8" stroke-width="3" />
								<line x1="40" y1="60" x2="30" y2="76" stroke="#64748b" stroke-width="2.5" />
								<line x1="40" y1="60" x2="50" y2="76" stroke="#64748b" stroke-width="2.5" />
								<line x1="40" y1="42" x2={arm1.x} y2={arm1.y} stroke="#f59e0b" stroke-width="3" stroke-linecap="round" />
								<circle cx={arm1.x} cy={arm1.y} r="3" fill="#ef4444" />
								<line x1="40" y1="42" x2={arm2.x} y2={arm2.y} stroke="#f59e0b" stroke-width="3" stroke-linecap="round" />
								<circle cx={arm2.x} cy={arm2.y} r="3" fill="#ef4444" />
							</svg>
							<span class="text-xs font-mono font-bold text-amber-400">{char}</span>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</section>

	<!-- Practice Exercises -->
	<section class="botanical-card bg-base-100 text-base-content p-6 rounded-3xl border border-base-300 shadow-xl space-y-5">
		<h2 class="text-xl font-extrabold text-amber-400 flex items-center gap-2 border-b border-base-300 pb-3">
			<span>✏️</span> แบบฝึกหัดทดลองถอดรหัส Semaphore (Practice Exercises)
		</h2>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			{#each exercises as ex, idx}
				<div class="botanical-card bg-base-100 text-base-content p-5 rounded-2xl border border-base-300 space-y-4 flex flex-col justify-between">
					<div class="space-y-3">
						<span class="font-bold text-xs text-base-content/70">ข้อที่ {ex.id}</span>
						<div class="bg-base-100 text-base-content p-3 rounded-xl border border-base-300 flex flex-wrap items-center justify-center gap-2 min-h-[60px]">
							{#each ex.word.split('') as c}
								{@const data = semaphoreData[c]}
								{#if data}
									{@const arm1 = getArmCoords(data.arm1, 20)}
									{@const arm2 = getArmCoords(data.arm2, 20)}
									<svg class="w-10 h-10 bg-base-100 text-base-content rounded" viewBox="0 0 80 80">
										<circle cx="40" cy="30" r="5" fill="#94a3b8" />
										<line x1="40" y1="35" x2="40" y2="58" stroke="#94a3b8" stroke-width="2.5" />
										<line x1="40" y1="42" x2={arm1.x} y2={arm1.y} stroke="#f59e0b" stroke-width="2.5" />
										<circle cx={arm1.x} cy={arm1.y} r="2.5" fill="#ef4444" />
										<line x1="40" y1="42" x2={arm2.x} y2={arm2.y} stroke="#f59e0b" stroke-width="2.5" />
										<circle cx={arm2.x} cy={arm2.y} r="2.5" fill="#ef4444" />
									</svg>
								{/if}
							{/each}
						</div>
					</div>

					<div class="space-y-2 pt-2">
						<AnswerChecker
							bind:value={answers[idx]}
							placeholder="พิมพ์คำตอบภาษาอังกฤษ..."
							buttonText="ตรวจ"
							btnClass="btn-primary text-primary-content"
							size="sm"
							on:submit={() => checkAnswer(idx)}
						/>

						{#if feedback[idx] === 'correct'}
							<div class="flex items-center gap-1 text-xs font-bold text-primary">
								<CheckCircleIcon size="14" />
								<span>ถูกต้อง!</span>
							</div>
						{:else if feedback[idx] === 'incorrect'}
							<div class="text-xs font-bold text-rose-400">
								✕ ยังไม่ถูกต้อง ลองใหม่อีกครั้ง
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Full Semaphore Reference Chart -->
	<section class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-3xl p-6 shadow-xl space-y-4">
		<h2 class="text-lg font-bold text-base-content border-b border-base-300 pb-2">
			📋 ตารางอ้างอิงตำแหน่งธงสัญญาณ A - Z
		</h2>
		<div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
			{#each letters as letter}
				{@const data = semaphoreData[letter]}
				{@const arm1 = getArmCoords(data.arm1)}
				{@const arm2 = getArmCoords(data.arm2)}
				<div class="bg-base-100 text-base-content p-2.5 rounded-2xl border border-base-300 flex flex-col items-center gap-1.5 hover:border-amber-500/40 transition-colors">
					<svg class="w-12 h-12 bg-base-100 text-base-content rounded-lg" viewBox="0 0 80 80">
						<circle cx="40" cy="30" r="5" fill="#94a3b8" />
						<line x1="40" y1="35" x2="40" y2="58" stroke="#94a3b8" stroke-width="2.5" />
						<line x1="40" y1="42" x2={arm1.x} y2={arm1.y} stroke="#f59e0b" stroke-width="2.5" />
						<circle cx={arm1.x} cy={arm1.y} r="2.5" fill="#ef4444" />
						<line x1="40" y1="42" x2={arm2.x} y2={arm2.y} stroke="#f59e0b" stroke-width="2.5" />
						<circle cx={arm2.x} cy={arm2.y} r="2.5" fill="#ef4444" />
					</svg>
					<span class="text-xs font-mono font-bold text-base-content">{letter}</span>
				</div>
			{/each}
		</div>
	</section>
</div>
