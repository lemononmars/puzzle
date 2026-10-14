<script lang="ts">
 import CatalogSection from '#lib/components/ui/CatalogSection.svelte';
 let { data } = $props();
</script>
<CatalogSection area="tools" group={data.group} />
