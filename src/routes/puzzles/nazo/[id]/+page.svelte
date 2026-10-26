<script lang="ts">
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	let { data } = $props();
</script>
<svelte:head><title>{data.puzzle.title} · Chi Fun</title></svelte:head>
<div class="mx-auto max-w-5xl px-4 py-6">
	<a class="link mb-3 inline-block text-sm" href="/puzzles/nazo">← Nazo</a>
	<PageHeading title={data.puzzle.title} />
	<img src={data.puzzle.image} alt="ปริศนา {data.puzzle.title}" class="mx-auto max-h-[75dvh] w-full rounded-xl object-contain" />
	<p class="botanical-muted mt-4 text-center text-sm">ยังไม่เปิดตรวจคำตอบ</p>
	<nav class="mt-4 flex items-center justify-between gap-3" aria-label="เลือกปริศนา">
		{#if data.puzzle.id > 1}<a class="btn btn-outline btn-sm" href="/puzzles/nazo/{data.puzzle.id - 1}">← ข้อก่อนหน้า</a>{:else}<span></span>{/if}
		<a class="btn btn-ghost btn-sm" href="/puzzles/nazo">ทั้งหมด 29 ข้อ</a>
		{#if data.puzzle.id < 29}<a class="btn btn-outline btn-sm" href="/puzzles/nazo/{data.puzzle.id + 1}">ข้อถัดไป →</a>{:else}<span></span>{/if}
	</nav>
</div>
