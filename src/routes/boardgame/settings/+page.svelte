<script>
 // @ts-nocheck -- Imported SNOWBOARD prototype uses dynamic game state.
 import { selfInfo } from '#lib/boardgame/stores/self';
 import PageHeading from '#lib/components/ui/PageHeading.svelte';
</script>
<svelte:head><title>Board game settings | Chi Fun</title></svelte:head>
<PageHeading title="Player settings" description="Choose the name other players see in board game rooms." />
<div class="botanical-surface p-6 max-w-md"><label class="label" for="boardgame-name">Player name</label><input id="boardgame-name" class="input w-full" maxlength="40" bind:value={$selfInfo.username} /></div>
