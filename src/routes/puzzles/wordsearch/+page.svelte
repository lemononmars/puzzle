

<script lang="ts">
export let data: any;


	import { dateToThaiString } from '#lib/utils/date.js';
	let wordsearches: any[] = data.wordsearches ?? ([]);

$: ({ wordsearches } = data);
</script>

<svelte:head>
	<title>Chi Fun | Word Search Puzzles</title>
</svelte:head>

<div class="container mx-auto px-4 py-6 flex flex-col gap-6 max-w-5xl">
	<div class="text-center mb-2">
		<h1 class="text-3xl lg:text-4xl font-extrabold tracking-tight text-base-content">ปริศนาหาคำศัพท์ (Word Search)</h1>
		<p class="text-xs sm:text-sm text-base-content/70 mt-1">รายการปริศนาหาคำศัพท์ทั้งหมด</p>
	</div>

	<div class="botanical-card bg-base-100 text-base-content backdrop-blur-xl border border-base-300 rounded-2xl overflow-hidden shadow-xl">
		<div class="overflow-x-auto">
			<table class="table w-full text-base-content/70">
				<thead class="bg-base-100 text-base-content text-base-content/70 border-b border-base-300 text-xs font-bold uppercase">
					<tr>
						<th class="py-3.5 px-4 text-left">ชื่อ</th>
						<th class="py-3.5 px-4 text-left">ระดับความยาก</th>
						<th class="py-3.5 px-4 text-left">วันที่</th>
						<th class="py-3.5 px-4 text-left">ผู้แต่ง</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-base-300 text-sm">
					{#each wordsearches as p}
						<tr class="hover:bg-base-100 text-base-content transition-colors">
							<td class="py-3.5 px-4 font-bold text-primary hover:text-primary">
								<a href="/puzzles/wordsearch/{p.uid}">
									{p.title}
								</a>
							</td>
							<td class="py-3.5 px-4">
								{#if p.difficulty === 1}
									<span class="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/20 text-primary border border-primary/30">ง่าย</span>
								{:else if p.difficulty === 2}
									<span class="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/20 text-warning-content border border-amber-500/30">ปานกลาง</span>
								{:else}
									<span class="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-500/20 text-error-content border border-rose-500/30">ยาก</span>
								{/if}
							</td>
							<td class="py-3.5 px-4 text-base-content/70 font-mono text-xs">{dateToThaiString(p.date)}</td>
							<td class="py-3.5 px-4 text-base-content/70">{p.author || 'ไม่มี'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
