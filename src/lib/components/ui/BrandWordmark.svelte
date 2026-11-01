<script lang="ts">
  import { brand } from '#lib/brand.js';
  let { size = 'compact' }: { size?: 'compact' | 'display' } = $props();
</script>

<img src="/images/brand/chi-fun-wordmark.svg?brand=sigma-v1" alt={brand.title} width="350" height="170" class:display={size === 'display'} />

<style>
 img { display:inline-block; width:115px; max-width:100%; height:auto; vertical-align:middle; }
 img.display { width:330px; }
</style>
