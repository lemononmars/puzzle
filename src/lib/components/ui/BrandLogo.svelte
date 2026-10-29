<script lang="ts">
  import { brand } from '#lib/brand.js';
  let { variant = 'horizontal', class: className = '' }: {
    variant?: 'stacked' | 'horizontal' | 'occasion';
    class?: string;
  } = $props();
  const dimensions = { stacked: [400, 430], horizontal: [660, 250], occasion: [440, 470] } as const;
</script>

<img
  src={`/images/brand/chi-fun-${variant}.svg?brand=lockups-v4`}
  alt={brand.title}
  width={dimensions[variant][0]}
  height={dimensions[variant][1]}
  class={className}
/>

<style>
  img { display:block; max-width:100%; height:auto; }
</style>
