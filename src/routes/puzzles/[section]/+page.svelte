<script lang="ts">
 import CatalogSection from '#lib/components/ui/CatalogSection.svelte';
 let { data } = $props();
</script>
<CatalogSection area="puzzles" group={data.group} />
