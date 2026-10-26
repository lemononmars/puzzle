<script lang="ts">
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import { crypticClues } from '#lib/data/puzzles/crypticClue.js';
	import { page } from '$app/state';
	import CrypticDifficulty from '#lib/components/CrypticDifficulty.svelte';
	const pageSize = 20;
	const pageCount = Math.max(1, Math.ceil(crypticClues.length / pageSize));
	let requestedPage = $derived(Number(page.url.searchParams.get('page') || '1'));
	let currentPage = $derived(Math.min(pageCount, Math.max(1, Number.isSafeInteger(requestedPage) ? requestedPage : 1)));
	let visibleClues = $derived(crypticClues.slice((currentPage - 1) * pageSize, currentPage * pageSize));
</script>

<svelte:head>
	<title>Cryptic Clue / ศัพท์ซับซ้อน · Chi Fun</title>
	<meta name="description" content={`ลองไขคำใบ้ซ่อนกล ศัพท์ซับซ้อน ${crypticClues.length} ข้อภาษาไทย พร้อมคู่มือเริ่มต้น`} />
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-4 flex flex-wrap items-start justify-between gap-3">
		<PageHeading title="Cryptic / ศัพท์ซับซ้อน" />
		<a class="btn btn-sm btn-outline" href="/puzzles/cryptic/guide">คู่มือ / Guide</a>
	</div>
	<section aria-label="ปริศนาศัพท์ซับซ้อน">
		<div class="overflow-x-auto rounded-2xl border border-base-300 bg-base-100 text-base-content">
			<table class="table w-full">
				<caption class="sr-only">รายการปริศนาศัพท์ซับซ้อน</caption>
				<thead><tr><th scope="col" class="w-16">ข้อ</th><th scope="col">คำใบ้</th><th scope="col">ความยาก</th><th scope="col" class="w-24"><span class="sr-only">เปิดปริศนา</span></th></tr></thead>
				<tbody>
					{#each visibleClues as puzzle}
						<tr class="hover:bg-base-200"><th scope="row">{puzzle.id}</th><td class="whitespace-normal"><a class="link link-hover font-medium" href="/puzzles/cryptic/{puzzle.id}">{puzzle.clue} ({puzzle.boxCount})</a></td><td><CrypticDifficulty level={puzzle.difficulty} /></td><td><a class="btn btn-sm btn-ghost" href="/puzzles/cryptic/{puzzle.id}" aria-label="เล่นข้อ {puzzle.id}">เล่น</a></td></tr>
					{/each}
				</tbody>
			</table>
		</div>
		<div class="mt-4 flex flex-wrap items-center justify-between gap-3">
			<p class="botanical-muted text-sm">{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, crypticClues.length)} จาก {crypticClues.length} ข้อ · 20 ข้อต่อหน้า</p>
			<nav aria-label="หน้ารายการปริศนา" class="join">
				{#if currentPage > 1}<a class="btn btn-sm join-item" href="?page={currentPage - 1}" aria-label="หน้าก่อนหน้า">‹</a>{:else}<button class="btn btn-sm join-item" disabled aria-label="หน้าก่อนหน้า">‹</button>{/if}
				{#each Array(pageCount) as _, index}<a class="btn btn-sm join-item" class:btn-primary={currentPage === index + 1} href="?page={index + 1}" aria-label="หน้า {index + 1}" aria-current={currentPage === index + 1 ? 'page' : undefined}>{index + 1}</a>{/each}
				{#if currentPage < pageCount}<a class="btn btn-sm join-item" href="?page={currentPage + 1}" aria-label="หน้าถัดไป">›</a>{:else}<button class="btn btn-sm join-item" disabled aria-label="หน้าถัดไป">›</button>{/if}
			</nav>
		</div>
	</section>
</div>
