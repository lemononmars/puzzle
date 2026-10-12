<script lang="ts">
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import Surface from '#lib/components/ui/Surface.svelte';
	import ActionLink from '#lib/components/ui/ActionLink.svelte';
	import passport from '#lib/data/escapeRooms.json';
	import EscapeWorldMap from '#lib/components/EscapeWorldMap.svelte';
	let search = $state('');
	let city = $state('all');
	let year = $state('all');
	const cities = [...new Set(passport.rooms.map((room) => room.city))].sort();
	const years = [...new Set(passport.rooms.flatMap((room) => room.date ? [room.date.slice(0, 4)] : []))].sort().reverse();
	const ordered = [...passport.rooms].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
	const highlights = passport.rooms.filter((room) => ['Secret Subway', 'Shadow Zen', "Pharaoh's Tomb"].includes(room.title));
	let filtered = $derived(ordered.filter((room) => (city === 'all' || room.city === city)
		&& (year === 'all' || room.date?.startsWith(year))
		&& `${room.title} ${room.venue} ${room.city} ${room.note}`.toLowerCase().includes(search.toLowerCase().trim())));
	const dateLabel = (date: string) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(date));
</script>

<svelte:head>
	<title>Escape Room Passport · Sakulbuth Ekvittayaniphon</title>
	<meta name="description" content="Sakulbuth’s escape room passport: rooms played, cities visited, and personal field notes from puzzle experiences." />
</svelte:head>

<div class="text-left space-y-10">
	<a href="/portfolio" class="link link-primary text-sm">← Portfolio</a>
	<section class="passport-intro">
		<div>
			<PageHeading title="Escape Room Passport" eyebrow="PORTFOLIO / PLAYING & EXPLORING" description="Rooms I’ve played, places I’ve visited, and notes from the experience. A personal record of exploring puzzles beyond the page." />
			<p class="botanical-muted max-w-xl">This is my play history. The dates and notes describe each visit, and the room names are recorded as they appear in my passport.</p>
		</div>
		<div class="passport-stamp bg-accent text-accent-content" aria-label={`${passport.rooms.length} recorded room visits`}>
			<span class="text-5xl font-bold">{passport.rooms.length}</span><span class="botanical-eyebrow">room visits</span><span class="text-sm">{cities.length} cities · {years.at(-1)}–{years[0]}</span>
		</div>
	</section>

	<EscapeWorldMap onselect={(place) => { city = place; search = ''; year = 'all'; document.getElementById('all-visits')?.scrollIntoView({ block: 'start' }); }} />
	<section aria-labelledby="field-notes">
		<h2 id="field-notes" class="text-2xl mb-5">A few field notes</h2>
		<div class="grid md:grid-cols-3 gap-5">
			{#each highlights as room}
				<Surface><p class="botanical-eyebrow">{room.city}</p><h3 class="text-xl my-3">{room.title}</h3><p class="botanical-muted text-sm">{room.venue}</p><blockquote class="border-l-2 border-secondary pl-4 mt-5 text-secondary">“{room.note}”</blockquote></Surface>
			{/each}
		</div>
	</section>

	<section aria-labelledby="all-visits">
		<div class="flex flex-wrap items-baseline justify-between gap-3 mb-5"><h2 id="all-visits" class="text-2xl">The passport</h2><p class="botanical-muted text-sm" aria-live="polite">{filtered.length} / {passport.rooms.length} visits</p></div>
		<div class="grid sm:grid-cols-[1fr_auto_auto] gap-3 mb-6">
			<label class="block text-sm">Search rooms or venues<input type="search" class="input w-full mt-2" bind:value={search} placeholder="Room, venue, or note…" /></label>
			<label class="block text-sm">City<select class="select w-full mt-2" bind:value={city}><option value="all">All cities</option>{#each cities as place}<option value={place}>{place}</option>{/each}</select></label>
			<label class="block text-sm">Year<select class="select w-full mt-2" bind:value={year}><option value="all">All years</option>{#each years as visitYear}<option value={visitYear}>{visitYear}</option>{/each}</select></label>
		</div>
		<div class="grid md:grid-cols-2 gap-4">
			{#each filtered as room (room.id)}
				<article class="botanical-surface visit-card">
					<div class="flex flex-wrap justify-between gap-2 text-xs mb-3"><span class="text-secondary font-semibold">{room.city}</span>{#if room.date}<time datetime={room.date} class="botanical-muted">{dateLabel(room.date)}</time>{:else}<span class="botanical-muted">Date not recorded</span>{/if}</div>
					<h3 class="text-lg font-bold">{room.title}</h3><p class="botanical-muted text-sm mt-1">{room.venue}</p>
					{#if room.note}<details class="mt-4 text-sm"><summary class="cursor-pointer text-primary">My visit note</summary><p class="mt-3 leading-relaxed">{room.note}</p></details>{/if}
				</article>
			{:else}<p class="botanical-muted py-8">No visits match these filters.</p>{/each}
		</div>
	</section>

	<section aria-labelledby="mini-games"><Surface><h2 id="mini-games" class="text-2xl mb-3">Mini escape games</h2><p class="botanical-muted mb-5">Other experiences recorded separately in my passport.</p><ul class="grid sm:grid-cols-2 gap-3">{#each passport.miniGames as game}<li class="bg-base-200 text-base-content rounded-xl px-4 py-3">{game}</li>{/each}</ul></Surface></section>
	<section><Surface><h2 class="text-2xl mb-3">Let’s make a puzzle experience</h2><p class="botanical-muted mb-6">Have an idea for a puzzle hunt, activity, or interactive game?</p><ActionLink href="/contact">Contact for work ↗</ActionLink></Surface></section>
</div>

<style>
	.passport-intro { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 32px; }
	.passport-stamp { width: 210px; height: 210px; border-radius: 50%; border: 2px dashed currentColor; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 10px; transform: rotate(5deg); }
	.visit-card { padding: 24px; }
	@media (max-width: 640px) { .passport-intro { grid-template-columns: 1fr; } .passport-stamp { width: 170px; height: 170px; margin: 0 auto; } }
</style>
