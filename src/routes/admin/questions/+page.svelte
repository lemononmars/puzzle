<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { THAI_QUIZ_CATEGORIES } from '#lib/data/puzzles/thaiquiz/catalog.js';
	import CheckCircleIcon from '@lucide/svelte/icons/circle-check';
import Edit3Icon from '@lucide/svelte/icons/pencil-line';
import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
import SearchIcon from '@lucide/svelte/icons/search';

	type ReviewStatus = 'draft' | 'needs_review' | 'approved' | 'retired';
	interface ReviewQuestion {
		questionKey: string;
		id: number;
		category: string;
		question: string;
		choices: string[];
		correctIndex: number;
		explanation: string;
		difficulty: 'easy' | 'normal' | 'hard';
		audit: {
			score: number;
			findings: Array<{ code: string; messageTh: string }>;
			reviewStatus: ReviewStatus;
			calibratedDifficulty: 'easy' | 'normal' | 'hard';
			blueprint: { skill: string; knowledgePoint: string; answerForm: string };
			provenance?: {
				sourceUrl: string;
				sourceTitle: string;
				factCheckedAt: string;
				reviewAfter?: string;
			};
		};
		review?: any;
		feedback: { up: number; down: number; attempts: number; correct: number };
	}

	const { password } = getContext<{ password: string }>('admin-session');
	let loading = false;
	let errorMessage = '';
	let questions: ReviewQuestion[] = [];
	let selected: ReviewQuestion | null = null;
	let search = '';
	let category = 'all';
	let status: 'all' | ReviewStatus = 'needs_review';
	let saving = false;
	let saved = false;

	let sourceUrl = '';
	let sourceTitle = '';
	let factCheckedAt = '';
	let reviewAfter = '';
	let skill = 'recall';
	let knowledgePoint = '';
	let answerForm = 'term';
	let difficulty: 'easy' | 'normal' | 'hard' = 'normal';
	let reviewStatus: ReviewStatus = 'needs_review';
	let reviewerNote = '';

	onMount(loadQuestions);

	$: filtered = questions.filter((question) => {
		const needle = search.trim().toLocaleLowerCase('th-TH');
		return (
			(category === 'all' || question.category === category) &&
			(status === 'all' || question.audit.reviewStatus === status) &&
			(!needle ||
				question.question.toLocaleLowerCase('th-TH').includes(needle) ||
				question.questionKey.includes(needle))
		);
	});

	async function loadQuestions() {
		loading = true;
		try {
			const response = await fetch('/api/admin/questions', {
				headers: { 'x-admin-password': password }
			});
			if (!response.ok)
				throw new Error(response.status === 401 ? 'รหัสผ่านไม่ถูกต้อง' : 'โหลดคลังคำถามไม่สำเร็จ');
			const body = await response.json();
			questions = body.questions;
			if (selected)
				selectQuestion(
					questions.find((item) => item.questionKey === selected?.questionKey) || questions[0]
				);
		} catch (error) {
			questions = [];
			errorMessage = error instanceof Error ? error.message : 'โหลดข้อมูลไม่สำเร็จ';
		} finally {
			loading = false;
		}
	}

	function selectQuestion(question?: ReviewQuestion) {
		if (!question) return;
		selected = question;
		const audit = question.audit;
		sourceUrl = audit.provenance?.sourceUrl || '';
		sourceTitle = audit.provenance?.sourceTitle || '';
		factCheckedAt = audit.provenance?.factCheckedAt?.slice(0, 10) || '';
		reviewAfter = audit.provenance?.reviewAfter?.slice(0, 10) || '';
		skill = audit.blueprint.skill;
		knowledgePoint = audit.blueprint.knowledgePoint;
		answerForm = audit.blueprint.answerForm;
		difficulty = audit.calibratedDifficulty;
		reviewStatus = audit.reviewStatus;
		reviewerNote = question.review?.quality?.reviewerNote || '';
		saved = false;
	}

	async function saveReview() {
		if (!selected) return;
		saving = true;
		saved = false;
		errorMessage = '';
		try {
			const response = await fetch('/api/admin/questions', {
				method: 'POST',
				headers: { 'content-type': 'application/json', 'x-admin-password': password },
				body: JSON.stringify({
					questionKey: selected.questionKey,
					provenance: sourceUrl
						? { sourceUrl, sourceTitle, factCheckedAt, reviewAfter: reviewAfter || undefined }
						: undefined,
					blueprint: { skill, knowledgePoint, answerForm },
					difficulty,
					quality: { reviewStatus, reviewedAt: new Date().toISOString(), reviewerNote }
				})
			});
			if (!response.ok) throw new Error((await response.json()).error || 'บันทึกไม่สำเร็จ');
			saved = true;
			await loadQuestions();
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'บันทึกไม่สำเร็จ';
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head><title>Question Review | Chi Fun Admin</title></svelte:head>

<div class="min-h-screen bg-base-100 text-base-content text-base-content/70 p-4 sm:p-6">
	<div class="max-w-7xl mx-auto flex flex-col gap-4">
		<header
			class="flex flex-wrap items-center justify-between gap-3 border-b border-base-300 pb-4"
		>
			<div>
				<h1 class="text-2xl font-black">Question Review</h1>
				<p class="text-xs text-base-content/70">ตรวจข้อเท็จจริง • Blueprint • Difficulty • Quality</p>
			</div>
			<nav class="flex gap-2">
				<a href="/admin/logic" class="btn btn-xs btn-ghost">Logic</a>
				<button class="btn btn-xs btn-ghost" on:click={loadQuestions}
					><RefreshCwIcon size={13} /> โหลดใหม่</button
				>
			</nav>
		</header>

		<div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)] gap-4">
			<section class="flex flex-col gap-3 min-w-0">
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
					<label
						class="input input-sm  bg-base-200 text-base-content flex items-center gap-2"
						><SearchIcon size={14} /><input
							class="grow"
							bind:value={search}
							placeholder="ค้นหาคำถาม"
						/></label
					>
					<select
						class="select select-sm  bg-base-200 text-base-content"
						bind:value={category}
						><option value="all">ทุกหมวด</option>{#each THAI_QUIZ_CATEGORIES as item}<option
								value={item.id}>{item.name}</option
							>{/each}</select
					>
					<select
						class="select select-sm  bg-base-200 text-base-content"
						bind:value={status}
						><option value="all">ทุกสถานะ</option><option value="needs_review">ต้องทบทวน</option
						><option value="draft">ฉบับร่าง</option><option value="approved">อนุมัติแล้ว</option
						><option value="retired">เลิกใช้</option></select
					>
				</div>
				<p class="text-xs text-base-content/70">แสดง {filtered.length} จาก {questions.length} ข้อ</p>
				<div class="flex flex-col gap-2 max-h-[72vh] overflow-y-auto pr-1">
					{#each filtered as question}
						<button
							class="text-left rounded-xl border p-3 transition-colors {selected?.questionKey ===
							question.questionKey
								? 'border-primary bg-primary/15'
								: 'border-base-300 bg-base-100 text-base-content hover:border-base-300'}"
							on:click={() => selectQuestion(question)}
						>
							<div class="flex justify-between gap-2">
								<span class="text-xs font-mono text-base-content/70">{question.questionKey}</span><span
									class="badge badge-sm {question.audit.score >= 80
										? 'badge-success text-success-content'
										: question.audit.score >= 60
										? 'badge-warning text-warning-content'
										: 'badge-error text-error-content'}">{question.audit.score}</span
								>
							</div>
							<p class="font-bold text-sm mt-1">{question.question}</p>
							<p class="text-[11px] text-base-content/70 mt-1">
								👍 {question.feedback.up} • 👎 {question.feedback.down} • {question.feedback
									.attempts
									? `${Math.round(
											(question.feedback.correct / question.feedback.attempts) * 100
									  )}% ถูก (${question.feedback.attempts})`
									: 'ยังไม่มีสถิติ'} • {question.audit.findings.length} ประเด็น
							</p>
						</button>
					{/each}
				</div>
			</section>

			{#if selected}
				<section class="card bg-base-200 text-base-content shadow-xl h-fit lg:sticky lg:top-4">
					<div class="card-body p-5 gap-4">
						<h2 class="card-title text-base"><Edit3Icon size={17} /> แก้ไข Metadata</h2>
						<div class="rounded-xl bg-base-300 text-base-content p-3 text-sm">
							<strong>{selected.question}</strong>
							<p class="mt-2 text-success-content">คำตอบ: {selected.choices[selected.correctIndex]}</p>
						</div>
						{#if selected.audit.findings.length}<div
								class="alert alert-warning text-warning-content text-xs"
							>
								<div class="flex flex-col">
									{#each selected.audit.findings as finding}<span>• {finding.messageTh}</span
										>{/each}
								</div>
							</div>{/if}
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
							<input
								class="input input-sm "
								bind:value={sourceTitle}
								placeholder="ชื่อแหล่งอ้างอิง"
							/>
							<input
								class="input input-sm "
								bind:value={sourceUrl}
								placeholder="https://…"
							/>
							<label class="text-xs"
								>ตรวจข้อเท็จจริง<input
									class="input input-sm  w-full mt-1"
									type="date"
									bind:value={factCheckedAt}
								/></label
							>
							<label class="text-xs"
								>ทบทวนอีกครั้ง<input
									class="input input-sm  w-full mt-1"
									type="date"
									bind:value={reviewAfter}
								/></label
							>
							<select class="select select-sm " bind:value={skill}
								><option value="recall">จำ</option><option value="understand">เข้าใจ</option><option
									value="apply">ประยุกต์</option
								><option value="compare">เปรียบเทียบ</option></select
							>
							<select class="select select-sm " bind:value={answerForm}
								><option value="person">บุคคล</option><option value="place">สถานที่</option><option
									value="date">เวลา</option
								><option value="term">คำ/แนวคิด</option><option value="number">จำนวน</option><option
									value="work">ผลงาน</option
								><option value="other">อื่น ๆ</option></select
							>
							<input
								class="input input-sm "
								bind:value={knowledgePoint}
								placeholder="จุดความรู้ที่วัด"
							/>
							<select class="select select-sm " bind:value={difficulty}
								><option value="easy">ง่าย</option><option value="normal">ปกติ</option><option
									value="hard">ยาก</option
								></select
							>
						</div>
						<select class="select select-sm " bind:value={reviewStatus}
							><option value="needs_review">ต้องทบทวน</option><option value="draft">ฉบับร่าง</option
							><option value="approved">อนุมัติแล้ว</option><option value="retired">เลิกใช้</option
							></select
						>
						<textarea
							class="textarea "
							bind:value={reviewerNote}
							placeholder="บันทึกการทบทวนด้วยภาษาที่ชัดเจนและเป็นกลาง"
						/>
						{#if errorMessage}<p class="text-error-content text-xs">{errorMessage}</p>{/if}
						<button
							class="btn btn-primary text-primary-content"
							disabled={saving}
							on:click={saveReview}
							>{#if saved}<CheckCircleIcon size={16} /> บันทึกแล้ว{:else}{saving
									? 'กำลังบันทึก…'
									: 'บันทึกการทบทวน'}{/if}</button
						>
					</div>
				</section>
			{/if}
		</div>
	</div>
</div>
