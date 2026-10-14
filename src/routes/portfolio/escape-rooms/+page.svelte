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
		<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users need focus to scroll the wide passport table.) -->
<div class="overflow-x-auto rounded-2xl border border-base-300 bg-base-100 text-base-content" tabindex="0" role="region" aria-label="Escape room visits table">
			<table class="table table-zebra passport-table">
				<caption class="sr-only">Escape room visits, dates, venues, cities, and personal notes</caption>
				<thead><tr><th scope="col">Date</th><th scope="col">Room</th><th scope="col">Venue</th><th scope="col">City</th><th scope="col">Field note</th></tr></thead>
				<tbody>{#each filtered as room (room.id)}<tr>
					<td>{#if room.date}<time datetime={room.date}>{dateLabel(room.date)}</time>{:else}Not recorded{/if}</td>
					<th scope="row">{room.title}</th><td>{room.venue}</td><td>{room.city === 'Totonro, CA' ? 'Toronto, CA' : room.city}</td>
					<td>{#if room.note}<details><summary class="cursor-pointer text-primary">Read note</summary><p class="mt-2 leading-relaxed">{room.note}</p></details>{:else}<span class="botanical-muted">—</span>{/if}</td>
				</tr>{:else}<tr><td colspan="5" class="py-8 text-center">No visits match these filters.</td></tr>{/each}</tbody>
			</table>
		</div>
	</section>

	<section aria-labelledby="mini-games"><Surface><h2 id="mini-games" class="text-2xl mb-3">Mini escape games</h2><p class="botanical-muted mb-5">Other experiences recorded separately in my passport.</p><ul class="grid sm:grid-cols-2 gap-3">{#each passport.miniGames as game}<li class="bg-base-200 text-base-content rounded-xl px-4 py-3">{game}</li>{/each}</ul></Surface></section>
	<section><Surface><h2 class="text-2xl mb-3">Let’s make a puzzle experience</h2><p class="botanical-muted mb-6">Have an idea for a puzzle hunt, activity, or interactive game?</p><ActionLink href="/contact">Contact for work ↗</ActionLink></Surface></section>
</div>

<style>
	.passport-intro { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 32px; }
	.passport-stamp { width: 210px; height: 210px; border-radius: 50%; border: 2px dashed currentColor; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 10px; transform: rotate(5deg); }
	.passport-table { min-width:760px; }
	.passport-table td { vertical-align:top; }
	.passport-table td:first-child { white-space:nowrap; }
	.passport-table td:last-child { min-width:180px; max-width:300px; }
	@media (max-width: 640px) { .passport-intro { grid-template-columns: 1fr; } .passport-stamp { width: 170px; height: 170px; margin: 0 auto; } }
</style>
