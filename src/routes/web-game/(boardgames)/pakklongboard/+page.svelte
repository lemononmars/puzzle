<script>
	import Lobby from '#lib/boardgame/components/Lobby.svelte';
	const gameInfo = {
		title: 'Pakklong Talat - The Board Game',
		slug: 'pakklongboard'
	};
</script>

<Lobby {...gameInfo} />

<p class="text-center mt-6">
	<a class="btn btn-outline" href="/web-game/pakklongboard/rules">Read the rulebook</a>
</p>
