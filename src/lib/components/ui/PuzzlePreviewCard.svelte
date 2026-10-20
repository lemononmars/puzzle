<script lang="ts">
 import Puzzle from "@lucide/svelte/icons/puzzle";
	let { href, title, image = '', imageAlt = '' }: { href:string; title:string; image?:string; imageAlt?:string } = $props();
</script>
<a {href} class="botanical-link-card puzzle-preview-card">
	<div class="preview bg-base-200 text-base-content">{#if image}<img src={image} alt={imageAlt || `Preview of ${title}`} loading="lazy" />{:else}<span aria-hidden="true"><Puzzle size={54} /></span>{/if}</div>
	<div class="card-copy"><h2 class="font-bold text-lg">{title}</h2></div>
</a>
<style>.puzzle-preview-card { padding:0; overflow:hidden; display:flex; flex-direction:column; }.preview { height:180px; padding:12px; display:grid; place-items:center; border-bottom:1px solid var(--color-base-300); }.preview img { width:100%; height:100%; object-fit:contain; min-height:0; }.preview span { font-size:54px; color:var(--color-primary); }.card-copy { padding:20px; }</style>
