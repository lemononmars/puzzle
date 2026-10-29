<script lang="ts">
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import DemonDieIcon from '#lib/components/DemonDieIcon.svelte';
	const collections = [
		{
			id: 'retro',
			title: 'Retro',
			count: 100,
			text: 'The original Devil Dice puzzles, recreated for Pip’s Plot.',
			face: { top: 6, north: 2, east: 3 }
		},
		{
			id: 'random',
			title: 'Random',
			count: 1000,
			text: 'New puzzles generated for Pip’s Plot. Different from Devil Dice’s original Random levels.',
			face: { top: 3, north: 2, east: 1 }
		},
		{
			id: 'puzzles/garden',
			title: 'Garden',
			count: 20,
			text: 'Pip’s Plot challenges with different dice mechanics.',
			face: { top: 2, north: 1, east: 3 }
		}
	];
</script>

<svelte:head><title>Puzzles · Pip’s Plot</title></svelte:head>
<section class="collections">
	<a class="btn btn-ghost btn-sm" href="/web-game/pips-plot">← All modes</a>
	<PageHeading title="Puzzles" />
	<nav aria-label="Puzzle collections" class="collection-grid">
		{#each collections as collection}
			<a
				class="card botanical-card collection bg-base-100 text-base-content"
				href={`/web-game/pips-plot/${collection.id}`}
			>
				<div class="die"><DemonDieIcon orientation={collection.face} /></div>
				<div>
					<h2>{collection.title}</h2>
					<span class="badge badge-primary">{collection.count.toLocaleString('en-US')} levels</span>
					<p class="botanical-muted">{collection.text}</p>
				</div>
			</a>
		{/each}
	</nav>
</section>

<style>
	.collections {
		max-width: 900px;
		margin: 0 auto;
	}
	.collection-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 20px;
	}
	.collection {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 18px;
		padding: 24px;
		text-decoration: none;
	}
	.collection:focus-visible {
		outline: 3px solid var(--color-primary);
		outline-offset: 4px;
	}
	.collection:hover {
		border-color: var(--color-primary);
	}
	.die {
		width: 76px;
		flex: none;
	}
	h2 {
		font-size: 24px;
		font-weight: 700;
		margin-bottom: 8px;
	}
	p {
		margin-top: 12px;
		font-size: 14px;
		line-height: 1.5;
	}
	@media (max-width: 640px) {
		.collection-grid {
			grid-template-columns: 1fr;
		}
		.collection {
			padding: 20px;
		}
	}
</style>
