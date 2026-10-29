<script lang="ts">
	import contents from '#lib/data/puzzles/puzzlehunt/contents.json';
	export let huntId: number;
	export let puzzleIndex: number;
	type Block = {
		kind: string;
		text?: string;
		items?: string[];
		lines?: string[];
		rows?: string[][];
		src?: string;
		alt?: string;
	};
	type Content = { author: string; answerLength: number; blocks: Block[] };
	$: content = (contents as Record<string, Content>)[`${huntId}-${puzzleIndex}`];
</script>

{#if content}
	<article
		class="botanical-surface p-4 sm:p-6 text-base-content puzzle-content"
		lang="th"
		aria-label="เนื้อหาปริศนา"
	>
		<p class="botanical-muted text-sm">โดย {content.author}</p>
		{#each content.blocks as block}
			{#if block.kind === 'paragraph'}
				<p>{block.text}</p>
			{:else if block.kind === 'list'}
				<ol class="list-decimal pl-6 space-y-2">
					{#each block.items ?? [] as item}<li>{item}</li>{/each}
				</ol>
			{:else if block.kind === 'verse'}
				<div class="text-center space-y-1">
					{#each block.lines ?? [] as line}<p>{line}</p>{/each}
				</div>
			{:else if block.kind === 'table'}
				<!-- svelte-ignore a11y_no_noninteractive_tabindex (keyboard access to horizontally scrolling clue tables) -->
				<div class="overflow-x-auto" tabindex="0" role="region" aria-label="ตารางคำใบ้">
					<table
						class="clue-table"
						class:arithmetic={huntId === 4 && puzzleIndex === 1}
						class:letter-grid={(huntId === 2 &&
							puzzleIndex === 3 &&
							block.rows?.[0]?.[0] === '+') ||
							(huntId === 3 && puzzleIndex === 2)}
					>
						<tbody
							>{#each block.rows ?? [] as row}<tr
									>{#each row as cell}<td>{cell}</td>{/each}</tr
								>{/each}</tbody
						>
					</table>
				</div>
			{:else if block.kind === 'image'}
				<figure class="my-2">
					<a
						href={block.src}
						target="_blank"
						rel="noreferrer"
						aria-label="เปิดภาพขนาดเต็ม: {block.alt}"
					>
						<img src={block.src} alt={block.alt} class="puzzle-art" />
					</a>
				</figure>
			{/if}
		{/each}
		{#if content.answerLength}
			<div class="answer-boxes" aria-label="คำตอบ {content.answerLength} ตัวอักษร">
				{#each Array(content.answerLength) as _}<span aria-hidden="true"></span>{/each}
			</div>
		{/if}
	</article>
{/if}

<style>
	.puzzle-content {
		display: grid;
		gap: 1.25rem;
		line-height: 1.8;
		min-width: 0;
	}
	.puzzle-art {
		display: block;
		width: auto;
		max-width: 100%;
		max-height: 780px;
		margin-inline: auto;
		object-fit: contain;
	}
	.clue-table {
		margin-inline: auto;
		border-collapse: collapse;
	}
	.clue-table td {
		padding: 0.5rem 0.75rem;
		text-align: center;
		white-space: pre-wrap;
	}
	.letter-grid td {
		border: 1px solid currentColor;
		min-width: 2.5rem;
		padding: 0.4rem;
	}
	.arithmetic td:nth-child(2) {
		text-decoration: underline;
	}
	.arithmetic td {
		padding-block: 1rem;
	}
	.answer-boxes {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		justify-content: center;
	}
	.answer-boxes span {
		width: clamp(1.4rem, 5vw, 2.6rem);
		aspect-ratio: 1;
		border: 2px solid currentColor;
	}
</style>
