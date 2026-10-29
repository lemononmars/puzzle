<script lang="ts">
	import type { Direction } from '#lib/games/devilDice.js';
	let { direction }: { direction: Direction } = $props();
	const angles = { up: 0, right: 90, down: 180, left: 270 };
</script>

<svg
	width="22"
	height="22"
	viewBox="0 0 24 24"
	aria-hidden="true"
	style:transform={'rotate(' + angles[direction] + 'deg)'}
	><path d="M12 4 3.5 12.5H9V20h6v-7.5h5.5Z" fill="currentColor" /></svg
>
