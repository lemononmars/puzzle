<script>
 import PageHeading from '#lib/components/ui/PageHeading.svelte';
 import LinkCard from '#lib/components/ui/LinkCard.svelte';
 const games = [
 ['pakklongdice', 'Pakklong Dice', '1-10 players. Spot the pattern and solve the dice puzzle.'],
 ['pakklongboard', 'Pakklong Talat - The Board Game', '2-6 players. Collect flowers and build your flower shop.'],
 ['pakklongcard', 'Pakklong Talat - The Card Game', 'A flower market card game prototype.'],
 ['spacespy', 'Space Spy', 'Hidden roles and missions in space.'],
 ['wordwars', 'Word Wars', 'A Thai letter tile preview of the upcoming word game.']
 ];
</script>
<svelte:head><title>Board games | Chi Fun</title><meta name="description" content="Original board games and playtest prototypes from SNOWBOARD." /></svelte:head>
<PageHeading eyebrow="SNOWBOARD" title="Board games" description="Original board games and playful prototypes. Pick a game and gather around the table." />
<div class="grid gap-5 md:grid-cols-2">{#each games as [slug, title, description]}<LinkCard href={'/boardgame/' + slug} {title} {description} />{/each}</div>
<div class="mt-6"><a class="btn btn-outline" href="/boardgame/realtime">Realtime playground</a></div>
