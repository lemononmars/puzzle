<script lang="ts">
 let { title, description = '', eyebrow = '' }: { title: string; description?: string; eyebrow?: string } = $props();
</script>
<header class="page-heading">
 {#if eyebrow}<p class="botanical-eyebrow">{eyebrow}</p>{/if}
 <h1>{title}</h1>
 {#if description}<p class="botanical-muted">{description}</p>{/if}
</header>
<style>.page-heading { text-align: left; margin-bottom: 40px; } .page-heading > p:last-child { max-width: 650px; font-size: 16px; line-height: 1.9; }</style>
