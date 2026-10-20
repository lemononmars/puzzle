<script lang="ts">
	import { onMount } from 'svelte';
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import LocalDataSettings from '#lib/components/LocalDataSettings.svelte';
	import { library, initializeLibrary, resetGame } from '#lib/progress/local.js';
	let filter = $state('all');
	let visible = $derived(
		$library.filter(
			(item) =>
				filter === 'all' || (filter === 'favorites' ? item.favorite : item.status === filter)
		)
	);
	onMount(initializeLibrary);
</script>

<svelte:head
	><title>My puzzles · Puzzle</title><meta
		name="description"
		content="Your locally saved puzzles, favorites, and private notes."
	/></svelte:head
>
<div class="text-left">
	<PageHeading
		title="ปริศนาของฉัน / My puzzles"
		eyebrow="YOUR LITTLE COLLECTION"
		description="รายการโปรด โน้ต และเกมที่เล่นค้างไว้ บันทึกเฉพาะในเครื่องนี้"
	/>
	<nav aria-label="Filter saved puzzles" class="flex flex-wrap gap-2 mb-6">
		{#each [['all', 'ทั้งหมด'], ['favorites', 'รายการโปรด'], ['in-progress', 'เล่นต่อ'], ['solved', 'แก้สำเร็จ']] as [value, label]}<button
				type="button"
				class="btn btn-sm {filter === value ? 'btn-primary text-primary-content' : 'btn-outline'}"
				aria-pressed={filter === value}
				onclick={() => (filter = value)}>{label}</button
			>{/each}
	</nav>
	{#if !visible.length}<p class="botanical-muted">
			ยังไม่มีรายการ เปิดหน้าปริศนาแล้วกด “บันทึกไว้เล่น” หรือเริ่มเกมที่รองรับการบันทึก
		</p>{/if}
	<ul class="grid gap-4 sm:grid-cols-2 list-none p-0">
		{#each visible as item}<li class="botanical-surface space-y-3">
				<a href={item.path} class="font-bold text-lg link link-hover">{item.title}</a>
				<p class="botanical-muted text-xs">
					{item.status === 'solved'
						? 'แก้สำเร็จแล้ว'
						: item.status === 'in-progress'
							? 'เล่นต่อจากที่ค้างไว้'
							: 'บันทึกไว้เล่น'}{item.favorite ? ' · Favorite' : ''}
				</p>
				{#if item.note}<p class="whitespace-pre-wrap text-sm">{item.note}</p>{/if}
				<details>
					<summary class="cursor-pointer text-xs">จัดการรายการ</summary><button
						type="button"
						class="btn btn-sm btn-ghost mt-2"
						onclick={() => resetGame(item.path)}>ลบรายการและเกมที่บันทึกนี้</button
					>
				</details>
			</li>{/each}
	</ul>
	<LocalDataSettings showLibraryLink={false} />
</div>
