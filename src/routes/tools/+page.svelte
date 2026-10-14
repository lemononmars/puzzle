<script lang="ts">
 import CatalogHub from '#lib/components/ui/CatalogHub.svelte';
 import catalog from '#lib/data/catalog.json';
</script>
<CatalogHub area="tools" groups={catalog.tools} />
