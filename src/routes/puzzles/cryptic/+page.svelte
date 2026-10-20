<script lang="ts">
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import { crypticClues } from '#lib/data/puzzles/crypticClue.js';
</script>

<svelte:head>
	<title>Cryptic Clue / ศัพท์ซับซ้อน · Puzzle</title>
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
				<thead><tr><th scope="col" class="w-16">ข้อ</th><th scope="col">คำใบ้</th><th scope="col" class="w-24"><span class="sr-only">เปิดปริศนา</span></th></tr></thead>
				<tbody>
					{#each crypticClues as puzzle}
						<tr class="hover:bg-base-200"><th scope="row">{puzzle.id}</th><td class="whitespace-normal"><a class="link link-hover font-medium" href="/puzzles/cryptic/{puzzle.id}">{puzzle.clue} ({puzzle.boxCount})</a></td><td><a class="btn btn-sm btn-ghost" href="/puzzles/cryptic/{puzzle.id}" aria-label="เล่นข้อ {puzzle.id}">เล่น</a></td></tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</div>
