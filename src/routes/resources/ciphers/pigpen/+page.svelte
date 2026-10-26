<script lang="ts">
	import AnswerChecker from '#lib/components/AnswerChecker.svelte';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
import CheckCircleIcon from '@lucide/svelte/icons/circle-check';
import DownloadIcon from '@lucide/svelte/icons/download';
	import PigpenSVG from '#lib/components/PigpenSVG.svelte';
	import PigpenGridHelper from '#lib/components/PigpenGridHelper.svelte';

	let inputText = 'CODEBREAKER';

	$: charArray = inputText.toUpperCase().split('');

	function exportImage() {
		const svgElements = document.querySelectorAll('.pigpen-output-container svg');
		if (!svgElements || svgElements.length === 0) return;

		const canvas = document.createElement('canvas');
		const width = Math.max(200, svgElements.length * 44 + 20);
		const height = 70;
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.fillStyle = '#090d16';
		ctx.fillRect(0, 0, width, height);

		let loaded = 0;
		svgElements.forEach((el, idx) => {
			const svgData = new XMLSerializer().serializeToString(el);
			const img = new Image();
			img.onload = () => {
				ctx.drawImage(img, 10 + idx * 44, 15, 36, 36);
				loaded++;
				if (loaded === svgElements.length) {
					const link = document.createElement('a');
					link.download = `pigpen_${inputText || 'code'}.png`;
					link.href = canvas.toDataURL('image/png');
					link.click();
				}
			};
			img.src = 'data:image/svg+xml;base64,' + unescape(encodeURIComponent(svgData));
		});
	}

	// Practice Exercises (without hints)
	let answers = ['', '', ''];
	let feedback = ['', '', ''];

	const exercises = [
		{ id: 1, word: 'JONO' },
		{ id: 2, word: 'CODE' },
		{ id: 3, word: 'STUV' }
	];

	function checkAnswer(idx: number) {
		const user = answers[idx].trim().toUpperCase();
		if (user === exercises[idx].word) {
			feedback[idx] = 'correct';
		} else {
			feedback[idx] = 'incorrect';
		}
	}
</script>

<svelte:head>
	<title>Chi Fun | Pigpen Cipher (รหัสคอกหมู) 🔐</title>
	<meta name="description" content="คู่มือและแบบฝึกหัดถอดรหัสลับ Pigpen Cipher พร้อมเครื่องมือแปลงรหัสเวกเตอร์ SVG" />
</svelte:head>

<div class="flex flex-col gap-8 w-full max-w-5xl mx-auto px-4 py-8 select-none">
	<div class="flex items-center justify-between">
		<a href="/resources/ciphers" class="btn btn-ghost btn-xs gap-1.5 font-bold text-base-content/70 hover:text-base-content">
			<ArrowLeftIcon size={14} />
			<span>กลับไปคลังรหัสลับ</span>
		</a>
	</div>

	<header class="space-y-2 text-center md:text-left">
		<div class="flex items-center gap-2 justify-center md:justify-start">
			<span class="badge badge-success font-bold text-xs py-2 px-3">EASY</span>
			<span class="text-xs text-base-content/70 font-mono uppercase tracking-wider">Geometric Substitution</span>
		</div>
		<h1 class="text-3xl lg:text-4xl font-black text-base-content">Pigpen Cipher (รหัสคอกหมู)</h1>
		<p class="text-base-content/70 text-sm lg:text-base leading-relaxed">
			Pigpen Cipher (หรือ Masonic Cipher) เป็นรหัสลับสัญลักษณ์ทดตัวอักษรด้วยเส้นตารางและจุด ใช้อย่างแพร่หลายในองค์กรฟรีเมสันและเกม Escape Room
		</p>
	</header>

	<!-- Visual Sharp / X Grid Helper Diagrams -->
	<section class="botanical-card bg-base-100 text-base-content p-6 rounded-3xl border border-base-300 shadow-xl space-y-4">
		<h2 class="text-xl font-extrabold text-primary flex items-center gap-2">
			<span>📐</span> ผังโครงสร้าง Pigpen Grids (Sharp # & X Shapes)
		</h2>
		<PigpenGridHelper />
	</section>

	<!-- Converter Tool (Single Full-Width Layout, No Left-Right Split) -->
	<section class="botanical-card bg-base-100 text-base-content p-6 rounded-3xl border border-base-300 shadow-xl space-y-5">
		<div class="flex items-center justify-between flex-wrap gap-2 border-b border-base-300 pb-3">
			<h2 class="text-xl font-extrabold text-amber-400 flex items-center gap-2">
				<span>⚡</span> เครื่องมือแปลงรหัส Pigpen
			</h2>
			<button
				on:click={exportImage}
				class="btn btn-primary btn-xs gap-1.5 font-bold rounded-xl shadow-md"
			>
				<DownloadIcon size={14} />
				<span>ส่งออกภาพ (Export Image)</span>
			</button>
		</div>

		<div class="space-y-4">
			<div class="space-y-2">
				<label for="pigpen-input-text" class="block text-xs font-semibold text-base-content/70">
					ข้อความภาษาอังกฤษ (A-Z Input):
				</label>
				<input
					id="pigpen-input-text"
					type="text"
					bind:value={inputText}
					placeholder="พิมพ์ข้อความภาษาอังกฤษ..."
					class="input  w-full bg-base-100 text-base-content border-base-300 font-mono text-sm uppercase text-base-content rounded-xl focus:border-amber-500"
				/>
			</div>

			<!-- Output Box -->
			<div class="space-y-2">
				<span class="block text-xs font-semibold text-base-content/70">
					ผลลัพธ์สัญลักษณ์ Pigpen:
				</span>
				<div class="botanical-card pigpen-output-container bg-base-100 text-base-content p-5 rounded-2xl border border-base-300 min-h-[120px] flex flex-wrap items-center gap-2 font-mono text-lg text-primary">
					{#if charArray.length > 0}
						{#each charArray as ch}
							{#if /[A-Z]/.test(ch)}
								<div class="botanical-card p-2.5 bg-base-100 text-base-content rounded-xl border border-base-300 text-amber-400 flex items-center justify-center shadow-md" title={ch}>
									<PigpenSVG char={ch} size={32} />
								</div>
							{:else if ch === ' '}
								<div class="w-6"></div>
							{:else}
								<span class="font-mono text-base-content/70">{ch}</span>
							{/if}
						{/each}
					{:else}
						<span class="text-xs text-base-content/70 font-mono">พิมพ์ข้อความเพื่อดูสัญลักษณ์ Pigpen...</span>
					{/if}
				</div>
			</div>
		</div>
	</section>

	<!-- Practice Exercises (Standardized Single Button Group Layout) -->
	<section class="botanical-card bg-base-100 text-base-content p-6 rounded-3xl border border-base-300 shadow-xl space-y-5">
		<h2 class="text-xl font-extrabold text-amber-400 flex items-center gap-2 border-b border-base-300 pb-3">
			<span>✏️</span> แบบฝึกหัดทดลองถอดรหัส (Practice Exercises)
		</h2>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			{#each exercises as ex, idx}
				<div class="botanical-card bg-base-100 text-base-content p-5 rounded-2xl border border-base-300 space-y-4 flex flex-col justify-between">
					<div class="space-y-3">
						<span class="font-bold text-xs text-base-content/70">ข้อที่ {ex.id}</span>

						<div class="bg-base-100 text-base-content p-3 rounded-xl border border-base-300 flex flex-wrap items-center justify-center gap-2 min-h-[60px]">
							{#each ex.word.split('') as c}
								<div class="p-1.5 bg-base-100 text-base-content rounded border border-base-300 text-amber-400">
									<PigpenSVG char={c} size={24} />
								</div>
							{/each}
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
							<div class="flex items-center gap-1 text-xs font-bold text-primary">
								<CheckCircleIcon size={14} />
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
</div>
