<script lang="ts">
 import PageIcon from "./PageIcon.svelte";
 import ArrowUpRight from "@lucide/svelte/icons/arrow-up-right";
 let { href, title, description, eyebrow = '', mark = '↗', icon = '' }: { href: string; title: string; description: string; eyebrow?: string; mark?: string; icon?: string } = $props();
 // HSV palette: varied hue, fixed 70% saturation and 45% value.
 const hoverColors = ['#733222', '#736222', '#22733d', '#226273', '#3d2273', '#732262'];
 let hoverColor = $derived(hoverColors[Array.from(href).reduce((sum, character) => sum + character.charCodeAt(0), 0) % hoverColors.length]);
</script>
<a {href} class="botanical-link-card" style:--icon-hover-color={hoverColor}>
 <div class="mark text-primary" aria-hidden="true"><PageIcon {href} size={34} /></div>
 {#if eyebrow}<p class="botanical-eyebrow">{eyebrow}</p>{/if}
 <h3>{title} <span aria-hidden="true"><ArrowUpRight size={18} /></span></h3>
 <p class="botanical-muted description">{description}</p>
</a>
<style>
 .mark { font-size: 34px; margin-bottom: 20px; }
 h3 { display: flex; justify-content: space-between; gap: 16px; }
 .description { font-size: 14px; line-height: 1.8; }
 a:hover .mark, a:focus-visible .mark,
 a:hover h3 span, a:focus-visible h3 span { color: var(--icon-hover-color); }
</style>
