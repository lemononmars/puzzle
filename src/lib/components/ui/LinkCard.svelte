<script lang="ts">
 let { href, title, description, eyebrow = '', mark = '↗' }: { href: string; title: string; description: string; eyebrow?: string; mark?: string } = $props();
</script>
<a {href} class="botanical-link-card">
 <div class="mark text-primary" aria-hidden="true">{mark}</div>
 {#if eyebrow}<p class="botanical-eyebrow">{eyebrow}</p>{/if}
 <h3>{title} <span aria-hidden="true">↗</span></h3>
 <p class="botanical-muted description">{description}</p>
</a>
<style>.mark { font-size: 34px; margin-bottom: 20px; } h3 { display: flex; justify-content: space-between; gap: 16px; } .description { font-size: 14px; line-height: 1.8; }</style>
