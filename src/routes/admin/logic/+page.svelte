<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
import PlusIcon from '@lucide/svelte/icons/plus';
import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
import CheckCircleIcon from '@lucide/svelte/icons/circle-check';
import GridIcon from '@lucide/svelte/icons/grid-2x2';
import EyeIcon from '@lucide/svelte/icons/eye';
import EditIcon from '@lucide/svelte/icons/square-pen';
import XIcon from '@lucide/svelte/icons/x';
import Trash2Icon from '@lucide/svelte/icons/trash-2';
import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import type { ILogicPuzzle } from '#lib/interfaces/index.js';
	import LogicPuzzleThumbnail from '#lib/components/LogicPuzzleThumbnail.svelte';

	let puzzles: ILogicPuzzle[] = [];
	let loading = false;
	let isSubmitting = false;
	let isDeleting = false;
	let successMsg = '';
	let errorMsg = '';
	let editingId: number | null = null;
	let isModalOpen = false;

	// Pagination state
	let currentPage = 1;
	let pageSize = 10;
	$: totalPages = Math.max(1, Math.ceil(puzzles.length / pageSize));
	$: paginatedPuzzles = puzzles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

	// Form fields
	let url = '';
	let genre = 'slither';
	let genreTitle = 'Slitherlink';
	let width = 5;
	let height = 5;
	let difficulty = 'Easy';
	let author = 'Codebreaker';
	let title = '';
	let isUserEditedTitle = false;

	const genreOptions = [
		{ value: 'slither', label: 'Slitherlink' },
		{ value: 'masyu', label: 'Masyu' },
		{ value: 'akari', label: 'Akari' },
		{ value: 'sudoku', label: 'Sudoku' },
		{ value: 'kakuro', label: 'Kakuro' },
		{ value: 'slalom', label: 'Slalom' },
		{ value: 'tapa', label: 'Tapa' },
		{ value: 'nurikabe', label: 'Nurikabe' },
		{ value: 'yajilin', label: 'Yajilin' }
	];

	function getPreviewUrl(urlStr: string): string {
		if (!urlStr) return '';
		if (urlStr.includes('/p?')) {
			return urlStr.replace('/p?', '/pv?');
		}
		return urlStr;
	}

	function autoGenerateTitle() {
		if (isUserEditedTitle || editingId) return;
		const count = puzzles.filter((p) => (p.genre_title || p.genre || '').toLowerCase() === (genreTitle || genre).toLowerCase()).length;
		title = `${genreTitle} ${width}x${height} #${count + 1}`;
	}

	function openAddModal() {
		resetForm();
		errorMsg = '';
		successMsg = '';
		isModalOpen = true;
	}

	function handleEdit(p: ILogicPuzzle) {
		editingId = p.id;
		title = p.title;
		genre = p.genre;
		genreTitle = p.genre_title || p.genre;
		url = p.url;
		width = p.width || 5;
		height = p.height || 5;
		difficulty = p.difficulty || 'Easy';
		author = p.author || 'Codebreaker';
		isUserEditedTitle = true;
		errorMsg = '';
		successMsg = '';
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		resetForm();
	}

	function resetForm() {
		editingId = null;
		title = '';
		url = '';
		genre = 'slither';
		genreTitle = 'Slitherlink';
		width = 5;
		height = 5;
		difficulty = 'Easy';
		author = 'Codebreaker';
		isUserEditedTitle = false;
		autoGenerateTitle();
	}

	function handleUrlInput() {
		if (!url.trim()) return;
		try {
			// Match pzpr URL pattern: /p?<genre>/<width>/<height>/...
			const match = url.match(/\/p\?([a-z0-9_-]+)\/(\d+)\/(\d+)/i);
			if (match) {
				const g = match[1].toLowerCase();
				const w = parseInt(match[2], 10);
				const h = parseInt(match[3], 10);

				if (!isNaN(w) && w > 0) width = w;
				if (!isNaN(h) && h > 0) height = h;

				const known = genreOptions.find((o) => o.value === g || o.label.toLowerCase() === g);
				if (known) {
					genre = known.value;
					genreTitle = known.label;
				} else {
					genre = g;
					genreTitle = g.charAt(0).toUpperCase() + g.slice(1);
				}
				autoGenerateTitle();
			}
		} catch (e) {
			console.warn('URL parsing error:', e);
		}
	}

	function handleGenreTitleInput() {
		const match = genreOptions.find((g) => g.label.toLowerCase() === genreTitle.trim().toLowerCase());
		if (match) {
			genre = match.value;
		} else {
			genre = genreTitle.trim().toLowerCase().replace(/\s+/g, '');
		}
		autoGenerateTitle();
	}

	function handleDimensionInput() {
		autoGenerateTitle();
	}

	async function fetchPuzzles() {
		try {
			loading = true;
			const res = await fetch('/api/puzzle/logicpuzzle');
			if (res.ok) {
				const data = await res.json();
				if (Array.isArray(data)) {
					puzzles = data;
				}
			}
		} catch (err) {
			console.error('Error fetching logic puzzles:', err);
		} finally {
			loading = false;
			autoGenerateTitle();
		}
	}

	async function handleSubmit() {
		if (!title.trim() || !url.trim()) {
			errorMsg = 'กรุณากรอก URL และชื่อปริศนาให้ครบถ้วน';
			return;
		}

		try {
			isSubmitting = true;
			errorMsg = '';
			successMsg = '';

			const body: any = {
				title: title.trim(),
				genre,
				genre_title: genreTitle.trim(),
				url: url.trim(),
				width: Number(width),
				height: Number(height),
				difficulty,
				author: author.trim() || 'Codebreaker'
			};

			let res: Response;
			if (editingId) {
				body.id = editingId;
				res = await fetch('/api/puzzle/logicpuzzle', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body)
				});
			} else {
				res = await fetch('/api/puzzle/logicpuzzle', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body)
				});
			}

			if (res.ok) {
				successMsg = editingId ? `แก้ไข ${title.trim()} เรียบร้อยแล้ว!` : `เพิ่ม ${title.trim()} เรียบร้อยแล้ว!`;
				closeModal();
				await fetchPuzzles();
			} else {
				const errData = await res.json().catch(() => null);
				errorMsg = errData?.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
			}
		} catch (err: any) {
			errorMsg = err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์';
		} finally {
			isSubmitting = false;
		}
	}

	async function handleDelete() {
		if (!editingId) return;
		if (!confirm(`คุณต้องการลบ "${title}" ใช่หรือไม่?`)) return;

		try {
			isDeleting = true;
			errorMsg = '';
			successMsg = '';

			const res = await fetch(`/api/puzzle/logicpuzzle?id=${editingId}`, {
				method: 'DELETE'
			});

			if (res.ok) {
				successMsg = `ลบ ${title} เรียบร้อยแล้ว!`;
				closeModal();
				await fetchPuzzles();
			} else {
				const errData = await res.json().catch(() => null);
				errorMsg = errData?.error || 'เกิดข้อผิดพลาดในการลบข้อมูล';
			}
		} catch (err: any) {
			errorMsg = err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์';
		} finally {
			isDeleting = false;
		}
	}

	onMount(fetchPuzzles);
</script>

<svelte:head>
	<title>Admin - Logic Puzzles Management</title>
</svelte:head>

<div class="flex flex-col gap-8 w-full max-w-6xl mx-auto px-4 py-8 select-none">
	<!-- Header Bar -->
	<header class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-base-300 pb-4">
		<div class="space-y-2">
			<div class="flex items-center gap-2 bg-base-100 text-base-content p-1 rounded-2xl border border-base-300 w-fit">
				<a href="/admin/logic" class="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-base-content hover:text-base-content shadow-md">
					Logic
				</a>
			</div>

			<h1 class="text-3xl font-black text-base-content flex items-center gap-3">
				<span>ระบบจัดการ Logic Puzzles</span>
				<span class="px-3 py-1 rounded-xl bg-emerald-500/20 border border-primary/30 text-primary font-mono text-xs">Admin</span>
			</h1>
			<p class="text-sm text-base-content/70">เพิ่มและจัดการปริศนาตรรกศาสตร์ (Slitherlink, Sudoku, Masyu ฯลฯ)</p>
		</div>

		<button
			on:click={openAddModal}
			class="btn bg-gradient-to-r from-base-200 to-base-200 hover:from-base-200 hover:to-base-200 text-base-content/70 font-bold border-none px-5 rounded-2xl shadow-lg flex items-center gap-2 self-start md:self-auto"
		>
			<PlusIcon size={18} />
			<span>เพิ่ม Logic Puzzle</span>
		</button>
	</header>

	{#if successMsg}
		<div class="alert alert-success text-sm font-bold rounded-2xl shadow-lg">
			<CheckCircleIcon size={18} />
			<span>{successMsg}</span>
		</div>
	{/if}

	<!-- Existing Puzzles Table -->
	<section class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-3xl p-6 shadow-xl space-y-4">
		<div class="flex items-center justify-between border-b border-base-300 pb-3 flex-wrap gap-2">
			<h2 class="text-xl font-bold text-base-content">
				รายการ Logic Puzzles ในระบบ ({puzzles.length})
			</h2>
			<div class="text-xs text-base-content/70 font-mono">
				แสดง {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, puzzles.length)} จาก {puzzles.length}
			</div>
		</div>

		{#if loading}
			<div class="text-center py-12 text-base-content/70 font-bold">กำลังโหลดรายการ...</div>
		{:else if puzzles.length === 0}
			<div class="text-center py-12 text-base-content/70 font-bold">ยังไม่มีข้อมูล Logic Puzzle ในระบบ</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="table w-full text-sm">
					<thead>
						<tr class="bg-base-100 text-base-content text-base-content/70 text-xs font-bold uppercase">
							<th class="w-12">ID</th>
							<th class="w-24 text-center">รูปตัวอย่าง</th>
							<th>ชื่อ</th>
							<th>ประเภท</th>
							<th>ขนาด</th>
							<th>ความยาก</th>
							<th>ผู้แต่ง</th>
							<th class="text-right">จัดการ</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-base-300">
						{#each paginatedPuzzles as p (p.id)}
							<tr class="hover:bg-base-100 text-base-content transition-colors">
								<td class="font-mono text-xs text-base-content/70">{p.id}</td>
								<td>
									<div class="w-16 h-12 bg-base-100 text-base-content rounded-xl overflow-hidden border border-base-300 mx-auto shrink-0 shadow-inner">
										<LogicPuzzleThumbnail
											genre={p.genre}
											width={p.width}
											height={p.height}
											title={p.title}
											thumbnail={p.thumbnail}
											url={p.url}
										/>
									</div>
								</td>
								<td class="font-bold text-primary">{p.title}</td>
								<td class="font-mono text-xs text-base-content/70">{p.genre_title || p.genre}</td>
								<td class="font-mono text-xs text-base-content/70">{p.width} x {p.height}</td>
								<td>
									<span class="badge badge-sm badge-outline text-xs font-bold">{p.difficulty || 'Easy'}</span>
								</td>
								<td class="text-base-content/70 text-xs">{p.author || 'Codebreaker'}</td>
								<td class="text-right">
									<button
										on:click={() => handleEdit(p)}
										class="btn btn-ghost btn-xs text-amber-400 hover:bg-amber-500/10 gap-1 font-bold rounded-lg"
									>
										<EditIcon size={12} />
										<span>แก้ไข</span>
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Pagination Bar -->
			{#if totalPages > 1}
				<div class="flex items-center justify-between pt-4 border-t border-base-300 text-xs font-medium text-base-content/70 flex-wrap gap-3">
					<span>หน้า {currentPage} จาก {totalPages} (ทั้งหมด {puzzles.length} รายการ)</span>
					<div class="flex items-center gap-2">
						<button
							class="btn btn-xs bg-base-100 text-base-content border-base-300 text-base-content/70 hover:border-primary/30 disabled:opacity-40 rounded-lg"
							disabled={currentPage === 1}
							on:click={() => (currentPage -= 1)}
						>
							<ChevronLeftIcon size={14} />
							<span>ก่อนหน้า</span>
						</button>
						<span class="px-3 py-1 bg-base-100 text-base-content border border-base-300 rounded-lg font-mono font-bold text-primary">
							{currentPage} / {totalPages}
						</span>
						<button
							class="btn btn-xs bg-base-100 text-base-content border-base-300 text-base-content/70 hover:border-primary/30 disabled:opacity-40 rounded-lg"
							disabled={currentPage >= totalPages}
							on:click={() => (currentPage += 1)}
						>
							<span>ถัดไป</span>
							<ChevronRightIcon size={14} />
						</button>
					</div>
				</div>
			{/if}
		{/if}
	</section>
</div>

<!-- Add / Edit Modal Overlay (Image / Live Preview on Left, Form on Right) -->
{#if isModalOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-base-100 text-base-content backdrop-blur-md animate-fade-in select-none">
		<div class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] lg:h-[80vh] flex flex-col lg:flex-row overflow-hidden relative">
			<!-- Close Button (Mobile & Desktop) -->
			<button
				on:click={closeModal}
				class="absolute top-3 right-3 z-20 btn btn-circle btn-sm bg-base-100 text-base-content text-base-content/70 hover:text-base-content border-base-300 hover:bg-base-100 text-base-content"
			>
				<XIcon size={18} />
			</button>

			<!-- LEFT COLUMN: Live Preview / Image -->
			<div class="w-full lg:w-1/2 h-48 sm:h-64 lg:h-full bg-base-100 text-base-content relative overflow-hidden border-b lg:border-b-0 lg:border-r border-base-300 shrink-0 flex flex-col justify-center items-center">
				{#if url.trim()}
					<div class="w-full h-full bg-white relative">
						<iframe
							src={getPreviewUrl(url)}
							title="Logic Puzzle Live Preview"
							class="w-full h-full border-0 pointer-events-none"
						></iframe>
					</div>
				{:else}
					<div class="flex flex-col items-center justify-center text-center p-6 space-y-3 text-base-content/70">
						<div class="w-16 h-16 rounded-2xl bg-base-100 text-base-content border border-base-300 flex items-center justify-center text-purple-400 shadow-inner">
							<EyeIcon size={28} />
						</div>
						<h4 class="font-bold text-base-content/70 text-sm">ตัวอย่างปริศนา (Live Preview)</h4>
						<p class="text-xs text-base-content/70 max-w-xs font-light">
							วาง URL ปริศนาทางด้านขวาเพื่อแสดงตัวอย่างรูปภาพ/พัซเซิลแบบสดที่นี่
						</p>
					</div>
				{/if}
			</div>

			<!-- RIGHT COLUMN: Form Inputs & Info -->
			<div class="w-full lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-base-100 text-base-content text-base-content/70 space-y-5">
				<!-- Header -->
				<div class="border-b border-base-300 pb-3 pr-8">
					<h2 class="text-xl font-bold flex items-center gap-2">
						{#if editingId}
							<EditIcon size={20} class="text-amber-400" />
							<span class="text-amber-400">แก้ไข Logic Puzzle #{editingId}</span>
						{:else}
							<PlusIcon size={20} class="text-primary" />
							<span class="text-primary">เพิ่ม Logic Puzzle ใหม่</span>
						{/if}
					</h2>
				</div>

				{#if errorMsg}
					<div class="alert alert-error text-xs font-bold rounded-xl py-2 px-3">
						<span>✕ {errorMsg}</span>
					</div>
				{/if}

				<form id="logic-form" on:submit|preventDefault={handleSubmit} class="space-y-4 flex-1">
					<!-- 1. URL Input -->
					<div class="space-y-1">
						<label class="text-xs font-bold text-base-content/70 flex items-center justify-between" for="modal-url">
							<span>1. URL ปริศนา (pzpr / pzprxs / puzz.link) *</span>
						</label>
						<input
							id="modal-url"
							type="url"
							bind:value={url}
							on:input={handleUrlInput}
							on:change={handleUrlInput}
							placeholder="https://pzprxs.vercel.app/p?slither/5/5/..."
							class="input  input-sm w-full bg-base-100 text-base-content text-xs font-mono focus:border-primary/30 rounded-xl"
							required
						/>
					</div>

					<!-- 2. Genre Input -->
					<div class="space-y-1">
						<label class="text-xs font-bold text-base-content/70" for="modal-genre">2. ประเภทปริศนา (Genre)</label>
						<input
							id="modal-genre"
							type="text"
							list="genre-datalist-modal"
							bind:value={genreTitle}
							on:input={handleGenreTitleInput}
							placeholder="ค้นหา หรือ พิมพ์ชื่อประเภทใหม่..."
							class="input  input-sm w-full bg-base-100 text-base-content text-xs font-bold focus:border-primary/30 rounded-xl"
						/>
						<datalist id="genre-datalist-modal">
							{#each genreOptions as opt}
								<option value={opt.label}></option>
							{/each}
						</datalist>
					</div>

					<!-- 3. Width & Height -->
					<div class="grid grid-cols-2 gap-2">
						<div class="space-y-1">
							<label class="text-xs font-bold text-base-content/70" for="modal-width">กว้าง (Width)</label>
							<input
								id="modal-width"
								type="number"
								bind:value={width}
								on:input={handleDimensionInput}
								min="3"
								max="30"
								class="input  input-sm w-full bg-base-100 text-base-content text-xs font-mono rounded-xl"
							/>
						</div>
						<div class="space-y-1">
							<label class="text-xs font-bold text-base-content/70" for="modal-height">สูง (Height)</label>
							<input
								id="modal-height"
								type="number"
								bind:value={height}
								on:input={handleDimensionInput}
								min="3"
								max="30"
								class="input  input-sm w-full bg-base-100 text-base-content text-xs font-mono rounded-xl"
							/>
						</div>
					</div>

					<!-- 4. Difficulty & Author -->
					<div class="grid grid-cols-2 gap-2">
						<div class="space-y-1">
							<label class="text-xs font-bold text-base-content/70" for="modal-difficulty">ระดับความยาก</label>
							<select id="modal-difficulty" bind:value={difficulty} class="select  select-sm w-full bg-base-100 text-base-content text-xs font-bold rounded-xl">
								<option value="Easy">Easy</option>
								<option value="Medium">Medium</option>
								<option value="Hard">Hard</option>
							</select>
						</div>

						<div class="space-y-1">
							<label class="text-xs font-bold text-base-content/70" for="modal-author">ผู้แต่ง (Author)</label>
							<input
								id="modal-author"
								type="text"
								bind:value={author}
								placeholder="Codebreaker"
								class="input  input-sm w-full bg-base-100 text-base-content text-xs font-bold rounded-xl"
							/>
						</div>
					</div>

					<!-- 5. Title Input -->
					<div class="space-y-1 pt-1 border-t border-base-300">
						<label class="text-xs font-bold text-base-content/70 flex items-center justify-between" for="modal-title">
							<span>3. ชื่อปริศนา (Puzzle Title) *</span>
						</label>
						<input
							id="modal-title"
							type="text"
							bind:value={title}
							on:input={() => (isUserEditedTitle = true)}
							placeholder="เช่น Slitherlink 5x5 #1"
							class="input  input-sm w-full bg-base-100 text-base-content text-xs font-extrabold text-primary focus:border-primary/30 rounded-xl"
							required
						/>
					</div>
				</form>

				<!-- Modal Actions (Bottom Row) -->
				<div class="flex items-center justify-between gap-2 pt-3 border-t border-base-300 flex-wrap">
					<div class="flex items-center gap-2">
						<button form="logic-form" type="submit" class="btn btn-primary btn-sm font-bold px-6 rounded-xl" disabled={isSubmitting}>
							{isSubmitting ? 'กำลังบันทึก...' : editingId ? 'บันทึกการแก้ไข' : 'บันทึก Logic Puzzle'}
						</button>
						<button type="button" on:click={closeModal} class="btn btn-ghost btn-sm text-base-content/70 hover:text-base-content font-bold rounded-xl">
							ยกเลิก
						</button>
					</div>

					{#if editingId}
						<button
							type="button"
							on:click={handleDelete}
							class="btn btn-error btn-outline btn-sm font-bold gap-1 rounded-xl text-rose-400 border-rose-500/40 hover:bg-rose-500/20"
							disabled={isDeleting}
						>
							<Trash2Icon size={14} />
							<span>{isDeleting ? 'กำลังลบ...' : 'ลบปริศนา'}</span>
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
