<script lang="ts">
	import { fade } from 'svelte/transition';

	const questions = [
		{ label: 'Q1', hash: '7aee5b5dbb9e781589946f9087eb09e4a880d57e5d52441daaf7d49f9c2e629f' }, // october
		{ label: 'Q2', hash: 'fa75b5c25fc089798cf96479474da0ebe84c6cb743a1f1010bb05fd8756275b7' }, // march
		{ label: 'Q3', hash: 'c2afdd38565b01f278bc8a5513cd8354840fec53de25dd45af4d23d6939abe8a' }, // august
		{ label: 'Q4', hash: '53e2975b5e720223b6f4e8317049d74dcddef8669e42f9fd5b94cc86378350e7' }, // february
		{
			label: 'Meta (ตอบวันที่และชื่อเดือนภาษาอังกฤษติดกัน เช่น 18august, 01may)',
			hash: 'f92838b216390f6e7309d7d1b62218aef5aa3628acb20bbeea9adc8bb2427e59'
		} // 26august (no space)
	];

	let inputs = Array(5).fill('');
	let status = Array(5).fill('neutral'); // neutral, correct, incorrect
	let showModal = false;

	async function checkAnswer(index: number) {
		if (!inputs[index]) {
			status[index] = 'neutral';
			return;
		}

		// Strip all whitespace before validation
		const val = inputs[index].replace(/\s+/g, '').toLowerCase();
		const msgBuffer = new TextEncoder().encode(val);
		const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

		if (hashHex === questions[index].hash) {
			status[index] = 'correct';

			// Show modal if Meta (last question) is solved
			if (index === 4) {
				showModal = true;
			}
		} else {
			status[index] = 'incorrect';
		}
	}
</script>

<svelte:head>
	<title>Code Breaker | Calendar 2026 Puzzles</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 sm:py-12 flex flex-col items-center min-h-screen max-w-3xl">
	<!-- Warning Banner -->
	<div class="w-full max-w-xl bg-amber-500/10 border border-amber-500/30 text-warning-content rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-md flex items-center justify-center gap-3 text-center mb-8">
		<svg class="w-6 h-6 shrink-0 text-warning-content" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
			<line x1="12" y1="9" x2="12" y2="13"/>
			<line x1="12" y1="17" x2="12.01" y2="17"/>
		</svg>
		<span class="font-bold text-sm sm:text-base">ต้องใช้ปฏิทิน Code Breaker 2026 ในการเล่น</span>
	</div>

	<div class="text-center mb-8">
		<h1 class="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-base-200 to-base-200 text-primary mb-2">
			Calendar 2026
		</h1>
		<h2 class="text-lg sm:text-xl text-base-content/70 font-medium">Postcard Puzzles</h2>
	</div>

	<div class="grid gap-4 sm:gap-6 w-full max-w-xl">
		{#each questions as q, i}
			<div class="bg-base-100 text-base-content backdrop-blur-xl border border-base-300 rounded-2xl p-5 sm:p-6 shadow-xl transition-all duration-300 hover:border-base-300">
				<label for="calendar-input-{i}" class="block font-bold text-base sm:text-lg text-base-content/70 mb-3 flex items-center gap-2">
					{#if i === 4}
						<span class="badge bg-amber-500/20 text-warning-content border border-amber-500/40 text-xs px-2.5 py-1 font-semibold rounded-lg">META</span>
					{/if}
					<span>{q.label}</span>
				</label>
				<div class="relative">
					<input
						id="calendar-input-{i}"
						type="text"
						placeholder="พิมพ์คำตอบที่นี่..."
						style="background-color: #020617 !important; color: #f8fafc !important;"
						class="w-full placeholder-slate-500 rounded-xl px-4 py-3 text-base focus:outline-none transition-all duration-200 shadow-inner pr-12 border
              {status[i] === 'correct' ? 'border-primary/30 ring-2 ring-emerald-500/20 !text-primary' : ''}
              {status[i] === 'incorrect' ? 'border-rose-500/80 ring-2 ring-rose-500/20 !text-error-content' : ''}
              {status[i] === 'neutral' ? 'border-base-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20' : ''}"
						bind:value={inputs[i]}
						on:input={() => (status[i] = 'neutral')}
						on:change={() => checkAnswer(i)}
						on:keydown={(e) => e.key === 'Enter' && checkAnswer(i)}
					/>

					{#if status[i] === 'correct'}
						<div class="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary" transition:fade>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
						</div>
					{:else if status[i] === 'incorrect'}
						<div class="absolute right-3.5 top-1/2 -translate-y-1/2 text-error-content" transition:fade>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<!-- Congratulations Modal -->
<input type="checkbox" id="success-modal" class="modal-toggle" bind:checked={showModal} />
<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="modal cursor-pointer bg-base-100 text-base-content backdrop-blur-md" for="success-modal">
	<label class="modal-box relative bg-base-100 text-base-content border border-base-300 text-base-content/70 rounded-3xl p-8 shadow-2xl max-w-md" for="">
		<div class="text-center">
			<div class="text-5xl mb-4">🎉</div>
			<h3 class="text-3xl font-extrabold bg-gradient-to-r from-amber-400 to-base-200 text-primary mb-3">
				Congratulations!
			</h3>
			<p class="text-base-content/70 text-base leading-relaxed mb-6">
				สวัสดีปีใหม่ 2026! ขอให้เป็นปีม้าที่ฮึกเหิมนะครับ
			</p>
			<div class="flex justify-center">
				<label for="success-modal" class="btn bg-gradient-to-r from-amber-500 to-base-200 hover:from-amber-400 hover:to-base-200 text-base-content/70 font-bold border-none px-8 rounded-xl shadow-lg transition-all">
					ปิดหน้าต่าง
				</label>
			</div>
		</div>
	</label>
</label>
