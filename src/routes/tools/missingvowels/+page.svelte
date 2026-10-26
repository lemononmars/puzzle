<script lang="ts">
	import SaveIcon from '@lucide/svelte/icons/save';
import LinkIcon from '@lucide/svelte/icons/link';
import ChevronUpIcon from '@lucide/svelte/icons/chevron-up';
import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
import Trash2Icon from '@lucide/svelte/icons/trash-2';
import PlusIcon from '@lucide/svelte/icons/plus';

	let title = '';
	let author = '';

	// Represent each answer as an object with text and unique ID
	let answers: { text: string; id: string }[] = [
		{ text: '', id: Math.random().toString(36).substring(2, 9) }
	];

	let isSaving = false;
	let saveStatus = '';
	let savedLink = '';

	function stripVowels(w: string) {
		if (!w) return '';
		let naked = w.replace(/[^\u0E00-\u0E2E]/g, '');
		let result = '';
		for (let i = 0; i < naked.length; i++) {
			result += naked[i];
			// Simple hash function to generate a stable pseudo-random value for each prefix
			let hash = 0;
			for (let j = 0; j <= i; j++) {
				hash = (hash * 31 + naked.charCodeAt(j)) & 0xffff;
			}
			if (hash % 10 >= 6 && i < naked.length - 1) {
				result += ' ';
			}
		}
		return result.trim();
	}

	function addWord() {
		answers = [...answers, { text: '', id: Math.random().toString(36).substring(2, 9) }];
	}

	function removeWord(index: number) {
		if (answers.length === 1) {
			answers = [{ text: '', id: Math.random().toString(36).substring(2, 9) }];
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
		const finalAnswers = answers.map((a) => a.text.trim()).filter((t) => t.length > 0);
		if (finalAnswers.length === 0) {
			saveStatus = 'กรอกโจทย์อย่างน้อย 1 คำ';
			return;
		}
		if (!title.trim()) {
			saveStatus = 'ใส่หมวดหมู่ด้วย';
			return;
		}

		isSaving = true;
		saveStatus = 'กำลังบันทึก...';
		savedLink = '';

		const uid = Math.random().toString(36).substring(2, 12);

		try {
			const payload = {
				type: 'missingvowels',
				data: {
					uid,
					title: title.trim(),
					author: author.trim() || null,
					answers: finalAnswers,
					tags: ['missingvowels', 'word puzzle'],
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
			savedLink = `${window.location.origin}/puzzles/missingvowels/${uid}`;
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
	<title>Chi Fun | Missing Vowels Builder</title>
	<meta
		name="description"
		content="Create and play custom Missing Vowels puzzles. Strip vowels and challenge others to guess the original words."
	/>



</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	<div class="botanical-card bg-base-200 rounded-3xl p-8 shadow-xl border border-base-300">
		<h1 class="text-4xl font-black mb-6 text-center text-primary font-outfit">Missing Vowels Builder</h1>

		<!-- Row 2: Settings and Save buttons (side-by-side) -->
		<div class="flex flex-col md:flex-row gap-4 items-end mb-6">
			<!-- Title -->
			<div class="flex flex-col gap-2 flex-1 w-full">
				<label for="mv-title" class="label"><span class="text-sm font-bold">ชื่อหมวดหมู่</span></label>
				<input
					id="mv-title"
					type="text"
					bind:value={title}
					class="input  w-full"
					placeholder="อาหารไทย"
				/>
			</div>

			<!-- Author -->
			<div class="flex flex-col gap-2 flex-1 w-full">
				<label for="mv-author" class="label"><span class="text-sm font-bold">ชื่อผู้สร้าง (ไม่บังคับ)</span></label>
				<input
					id="mv-author"
					type="text"
					bind:value={author}
					class="input  w-full"
					placeholder="Code Breaker"
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
						<SaveIcon size={18} class="mr-1.5" />
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
							<LinkIcon size={16} class="mr-1" /> คัดลอกลิงก์
						</button>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Row 3: Answers List spanning the full width -->
		<div class="space-y-3">
			<div class="label">
				<span class="text-sm font-bold text-lg">โจทย์</span>
			</div>

			<div class="bg-base-300 p-4 rounded-3xl shadow-inner border border-base-100/50 space-y-2">
				<div class="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
					{#each answers as ans, idx (ans.id)}
						<div class="bg-base-100 p-2 px-3 rounded-xl shadow-sm border border-base-200/50 flex items-center gap-3">
							<!-- Reorder Controls -->
							<div class="flex flex-col gap-0.5">
								<button
									class="btn btn-ghost btn-xs p-0 h-auto hover:text-primary disabled:opacity-30"
									on:click={() => moveWord(idx, -1)}
									disabled={idx === 0}
									title="เลื่อนขึ้น"
								>
									<ChevronUpIcon size={14} />
								</button>
								<button
									class="btn btn-ghost btn-xs p-0 h-auto hover:text-primary disabled:opacity-30"
									on:click={() => moveWord(idx, 1)}
									disabled={idx === answers.length - 1}
									title="เลื่อนลง"
								>
									<ChevronDownIcon size={14} />
								</button>
							</div>

							<!-- Index Number -->
							<span class="text-sm font-bold text-base-content/40 w-6 text-center">#{idx + 1}</span>

							<!-- Text Input -->
							<input
								type="text"
								bind:value={ans.text}
								placeholder="ใส่คำเฉลย..."
								class="input  input-sm flex-1 font-bold text-base"
							/>

							<!-- Live Strip Vowels Preview -->
							<div
								class="text-sm font-black bg-info text-info-content px-3 py-1 rounded-xl tracking-wider min-w-[90px] text-center"
								title="ผู้เล่นจะเห็น..."
							>
								{stripVowels(ans.text) || '...'}
							</div>

							<!-- Remove Button -->
							<button
								class="btn btn-ghost btn-sm btn-circle text-error-content hover:bg-error/15"
								on:click={() => removeWord(idx)}
								title="ลบคำนี้"
							>
								<Trash2Icon size={16} />
							</button>
						</div>
					{/each}
				</div>

				<!-- Add Word Button inside the same panel -->
				<button
					class="btn btn-secondary btn-outline btn-sm btn-block gap-1 mt-2"
					on:click={addWord}
				>
					<PlusIcon size={16} />
					เพิ่มโจทย์
				</button>
			</div>
		</div>
	</div>
</div>
