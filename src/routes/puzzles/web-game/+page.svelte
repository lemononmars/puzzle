<script lang="ts">
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import PuzzlePreviewCard from '#lib/components/ui/PuzzlePreviewCard.svelte';
</script>

<svelte:head>
	<title>Web Game · Chi Fun</title>
	<meta name="description" content="แก้ปริศนาบนหน้าเว็บไซต์" />
</svelte:head>

<a class="link link-primary text-sm" href="/puzzles/explore">← Explore</a>
<div class="mt-5">
	<PageHeading title="Web Game" description="แก้ปริศนาบนหน้าเว็บไซต์" />
</div>
<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
	<PuzzlePreviewCard
		href="/puzzles/web-game/four-lines"
		title="Four Lines"
		image="/puzzles/four-lines/preview.png"
		imageAlt="Four Lines เวอร์ชันปัจจุบัน พร้อมวงกลมความคืบหน้าบนกระดาน"
	/>
</div>
