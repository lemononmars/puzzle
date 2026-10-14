<script lang="ts">
	import { SaveIcon, LinkIcon, ChevronUpIcon, ChevronDownIcon, Trash2Icon, PlusIcon } from 'svelte-feather-icons';
	import { splitWord } from '#lib/utils/thaiwords.js';

	let title = '';
	let author = '';

	// Represent each hint/answer pair as an object with unique ID
	let answers: { hint: string; answer: string; id: string }[] = [
		{ hint: '', answer: '', id: Math.random().toString(36).substring(2, 9) }
	];

	let isSaving = false;
	let saveStatus = '';
	let savedLink = '';

	function addWord() {
		answers = [...answers, { hint: '', answer: '', id: Math.random().toString(36).substring(2, 9) }];
	}

	function removeWord(index: number) {
		if (answers.length === 1) {
			answers = [{ hint: '', answer: '', id: Math.random().toString(36).substring(2, 9) }];
		} else {
			answers = answers.filter((_, i) => i !== index);
		}
	}

	function moveWord(index: number, direction: number) {
		const targetIndex = index + direction;
		if (targetIndex < 0 || targetIndex >= answers.length) return;

		const temp = answers[index];
		answers[index] = answers[targetIndex];
		answers[targetIndex] = temp;
		answers = answers; // trigger Svelte reactivity
	}

	async function saveToDatabase(isPublic: boolean) {
		const finalHints = answers.map((a) => a.hint.trim()).filter((h) => h.length > 0);
		const finalAnswers = answers.map((a) => a.answer.trim()).filter((t) => t.length > 0);

		if (finalAnswers.length === 0 || finalHints.length !== finalAnswers.length) {
			saveStatus = 'กรุณากรอกคำใบ้และคำเฉลยให้ครบถ้วนอย่างน้อย 1 คู่';
			return;
		}
		if (!title.trim()) {
			saveStatus = 'กรุณาใส่ชื่อปริศนา';
			return;
		}

		isSaving = true;
		saveStatus = 'กำลังบันทึก...';
		savedLink = '';

		const uid = Math.random().toString(36).substring(2, 12);

		try {
			const payload = {
				type: 'alphabet',
				data: {
					uid,
					title: title.trim(),
					author: author.trim() || null,
					hints: finalHints,
					answers: finalAnswers,
					tags: ['alphabet', 'word puzzle'],
					is_public: isPublic,
					created_at: new Date().toISOString()
				}
			};

			const res = await fetch('/api/puzzle/add', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			if (!res.ok) throw new Error('Failed to save');

			saveStatus = 'บันทึกสำเร็จ!';
			savedLink = `${window.location.origin}/puzzles/alphabet/${uid}`;
		} catch (error: any) {
			console.error(error);
			saveStatus = 'เกิดข้อผิดพลาด: ' + error.message;
		} finally {
			isSaving = false;
		}
	}

	function copyLink() {
		if (savedLink) {
			navigator.clipboard.writeText(savedLink);
			alert('คัดลอกลิงก์แล้ว!');
		}
	}
</script>

<svelte:head>
	<title>Code Breaker | Alphabet Builder</title>
	<meta
		name="description"
		content="Create and play custom Alphabet puzzles. Challenge players to guess the hidden words from hints."
	/>
	<meta property="og:title" content="Alphabet Builder" />
	<meta
		property="og:description"
		content="Create and play custom Alphabet puzzles. Challenge players to guess the hidden words from hints."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	<div class="botanical-card bg-base-200 rounded-3xl p-8 shadow-xl border border-base-300">
		<h1 class="text-4xl font-black mb-6 text-center text-primary font-outfit">Alphabet Builder</h1>

		<!-- Row 2: Settings and Save buttons (side-by-side) -->
		<div class="flex flex-col md:flex-row gap-4 items-end mb-6">
			<!-- Title -->
			<div class="flex flex-col gap-2 flex-1 w-full">
				<label for="ab-title" class="label"><span class="text-sm font-bold">ชื่อปริศนา</span></label>
				<input
					id="ab-title"
					type="text"
					bind:value={title}
					class="input  w-full"
					placeholder="ex. ทายคำสุภาษิต"
				/>
			</div>

			<!-- Author -->
			<div class="flex flex-col gap-2 flex-1 w-full">
				<label for="ab-author" class="label"><span class="text-sm font-bold">ชื่อผู้สร้าง (ไม่บังคับ)</span></label>
				<input
					id="ab-author"
					type="text"
					bind:value={author}
					class="input  w-full"
					placeholder="ex. นามปากกา"
				/>
			</div>

			<!-- Save buttons in a button group -->
			<div class="flex flex-col gap-2 w-full md:w-auto">
				<div class="label hidden md:block"><span class="text-sm font-bold opacity-0">บันทึก</span></div>
				<div class="join shadow-md w-full flex">
					<button
						class="join-item btn btn-primary flex-1 md:flex-none"
						on:click={() => saveToDatabase(true)}
						disabled={isSaving}
					>
						<SaveIcon size="18" class="mr-1.5" />
						{isSaving ? 'บันทึก...' : 'บันทึกสู่สาธารณะ'}
					</button>
					<button
						class="join-item btn btn-outline flex-1 md:flex-none"
						on:click={() => saveToDatabase(false)}
						disabled={isSaving}
					>
						บันทึกส่วนตัว
					</button>
				</div>
			</div>
		</div>

		<!-- Status & Saved Link Messages -->
		{#if saveStatus || savedLink}
			<div class="mb-6 flex flex-col items-center">
				{#if saveStatus}
					<div class="font-bold text-center {saveStatus.includes('สำเร็จ') ? 'text-success-content' : 'text-error-content'}">
						{saveStatus}
					</div>
				{/if}
				{#if savedLink}
					<div class="mt-3 bg-base-100 p-4 rounded-xl border border-success/30 flex items-center gap-4 w-full max-w-2xl">
						<div class="flex-1 font-mono text-sm overflow-hidden text-ellipsis whitespace-nowrap">
							{savedLink}
						</div>
						<a href={savedLink} target="_blank" rel="noreferrer" class="btn btn-success btn-sm">เปิดเล่น</a>
						<button class="btn btn-outline btn-sm" on:click={copyLink}>
							<LinkIcon size="16" class="mr-1" /> คัดลอกลิงก์
						</button>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Row 3: Answers List spanning the full width -->
		<div class="space-y-3">
			<div class="label">
				<span class="text-sm font-bold text-lg">รายการคำใบ้และคำเฉลย</span>
			</div>

			<div class="bg-base-300 p-4 rounded-3xl shadow-inner border border-base-100/50 space-y-2">
				<div class="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
					{#each answers as ans, idx (ans.id)}
						<div class="bg-base-100 p-2.5 px-3 rounded-xl shadow-sm border border-base-200/50 flex flex-col sm:flex-row items-center gap-3">

							<div class="flex items-center gap-3 w-full sm:w-auto flex-1">
								<!-- Reorder Controls -->
								<div class="flex flex-col gap-0.5">
									<button
										class="btn btn-ghost btn-xs p-0 h-auto hover:text-primary disabled:opacity-30"
										on:click={() => moveWord(idx, -1)}
										disabled={idx === 0}
										title="เลื่อนขึ้น"
									>
										<ChevronUpIcon size="14" />
									</button>
									<button
										class="btn btn-ghost btn-xs p-0 h-auto hover:text-primary disabled:opacity-30"
										on:click={() => moveWord(idx, 1)}
										disabled={idx === answers.length - 1}
										title="เลื่อนลง"
									>
										<ChevronDownIcon size="14" />
									</button>
								</div>

								<!-- Index Number -->
								<span class="text-sm font-bold text-base-content/40 w-6 text-center">#{idx + 1}</span>

								<!-- Hint Input -->
								<input
									type="text"
									bind:value={ans.hint}
									placeholder="คำใบ้..."
									class="input  input-sm flex-1 font-bold text-sm"
								/>
							</div>

							<div class="flex items-center gap-3 w-full sm:w-auto flex-1">
								<!-- Answer Input -->
								<input
									type="text"
									bind:value={ans.answer}
									placeholder="คำเฉลย..."
									class="input  input-sm flex-1 font-bold text-base"
								/>

								<!-- Live Blocks Preview -->
								<div
									class="flex flex-wrap gap-0.5 max-w-[150px] justify-center min-w-[90px]"
									title="ตัวอย่างบล็อกที่จะแสดงให้ผู้เล่นเห็น"
								>
									{#if ans.answer}
										{#each splitWord(ans.answer) as block}
											<span class="px-1.5 py-0.2 bg-base-100 text-base-content text-base-content rounded-md text-xs font-bold font-mono">{block}</span>
										{/each}
									{:else}
										<span class="text-xs text-base-content/30 italic">รอคำเฉลย...</span>
									{/if}
								</div>

								<!-- Remove Button -->
								<button
									class="btn btn-ghost btn-sm btn-circle text-error-content hover:bg-error/15"
									on:click={() => removeWord(idx)}
									title="ลบคำนี้"
								>
									<Trash2Icon size="16" />
								</button>
							</div>
						</div>
					{/each}
				</div>

				<!-- Add Word Button inside the same panel -->
				<button
					class="btn btn-secondary btn-outline btn-sm btn-block gap-1 mt-2"
					on:click={addWord}
				>
					<PlusIcon size="16" />
					เพิ่มคำเฉลย
				</button>
			</div>
		</div>
	</div>
</div>
