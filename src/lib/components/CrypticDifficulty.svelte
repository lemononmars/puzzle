<script lang="ts">
	import Star from '@lucide/svelte/icons/star';
	let { level }: { level: number } = $props();
</script>

<span class="inline-flex items-center gap-0.5 text-secondary" role="img" aria-label="ความยาก {level} จาก 3 ดาว" title="ความยาก {level}/3">
	{#each [1, 2, 3] as star}<span class:opacity-25={star > level}><Star size={16} fill={star <= level ? 'currentColor' : 'none'} aria-hidden="true" /></span>{/each}
</span>
