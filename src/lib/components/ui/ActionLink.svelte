<script lang="ts">
 import type { Snippet } from 'svelte';
 let { href, children, secondary = false }: { href: string; children: Snippet; secondary?: boolean } = $props();
</script>
<a {href} class="btn {secondary ? 'btn-outline text-base-content' : 'btn-primary text-primary-content'}">{@render children()}</a>
