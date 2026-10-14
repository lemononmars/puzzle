<script lang="ts">
	let playing = $state(false);
</script>
<div class="clip bg-base-300 text-base-content">
	{#if playing}
		<img src="https://lemononmars.github.io/manim/myprojects/media/exponential_sum.gif" alt="Manim exponential sum animation drawing a changing mathematical curve" class="w-full" />
	{:else}
		<div class="preview" aria-hidden="true"><span>∑</span><svg viewBox="0 0 300 120" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 90C70-30 90 140 150 50S230 140 290 20M10 60H290"/><circle cx="150" cy="50" r="8"/></svg></div>
	{/if}
	<button type="button" class="btn btn-sm btn-primary text-primary-content m-4" onclick={() => playing = !playing}>{playing ? 'Stop animation' : 'Play Exponential Sum ↗'}</button>
</div>
<style>.clip { border-radius:20px; overflow:hidden; }.preview { display:grid; place-items:center; min-height:230px; padding:24px; color:var(--color-primary); }.preview span { font-size:60px; }.preview svg { width:100%; max-width:340px; height:100px; }.clip img { aspect-ratio:16/9; object-fit:contain; background:#000; }</style>
