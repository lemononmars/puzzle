<script lang="ts">
	import land from '#lib/data/worldLand.json';
	import passport from '#lib/data/escapeRooms.json';
	let { onselect = (_city: string) => {} } = $props<{ onselect?: (city: string) => void }>();
	// Approximate city centres, rather than individual venue addresses.
	const places = [
		{ label: 'Illinois', cities: ['Champaign, IL', 'Urbana, IL', 'Chicago, IL', 'Bloomington, IL'], lat: 41, lon: -89 },
		{ label: 'Austin', cities: ['Austin, TX'], lat: 30.27, lon: -97.74 },
		{ label: 'Toronto', cities: ['Totonro, CA'], lat: 43.65, lon: -79.38 },
		{ label: 'Budapest', cities: ['Budapest'], lat: 47.5, lon: 19.04 },
		{ label: 'Bangkok', cities: ['Bangkok'], lat: 13.76, lon: 100.5 },
		{ label: 'Tokyo', cities: ['Tokyo, Japan'], lat: 35.68, lon: 139.69 }
	].map(place => ({ ...place, rooms: passport.rooms.filter(room => place.cities.includes(room.city)) }));
	let active = $state(4);
</script>

<section class="botanical-surface map-section" aria-labelledby="map-title">
	<h2 id="map-title" class="text-2xl">Puzzles around the world</h2>
	<p class="botanical-muted text-sm mt-2">Hover, focus, or tap a pin to explore my visits. Nearby Illinois cities share a pin.</p>
	<div class="map bg-base-200 text-base-content">
		<svg viewBox="0 0 720 360" preserveAspectRatio="none" aria-hidden="true"><path d={land.join(' ')} fill="currentColor" /></svg>
		{#each places as place, i}
			<button class="pin btn btn-primary" class:chosen={active === i} style:left={`${(place.lon + 180) / 3.6}%`} style:top={`${(90 - place.lat) / 1.8}%`} aria-label={`${place.label}: ${place.rooms.length} room visits`} aria-pressed={active === i} onpointerenter={() => active = i} onfocus={() => active = i} onclick={() => active = i}><span aria-hidden="true">●</span></button>
		{/each}
	</div>
	<div class="details bg-base-100 text-base-content" aria-live="polite">
		<h3 class="text-xl">{places[active].label} <span class="text-sm botanical-muted">· {places[active].rooms.length} visits</span></h3>
		<ul class="visit-list">{#each places[active].rooms as room}<li><strong>{room.title}</strong><span class="botanical-muted">{room.venue}{room.date ? ` · ${room.date}` : ''}</span>{#if room.note}<p class="text-sm">{room.note}</p>{/if}</li>{/each}</ul>
		<div class="flex flex-wrap gap-2 mt-4">{#each places[active].cities as city}<button class="btn btn-sm btn-outline btn-primary" onclick={() => onselect(city)}>Show {city === 'Totonro, CA' ? 'Toronto' : city} visits ↓</button>{/each}</div>
	</div>
	<p class="botanical-muted text-xs mt-3">Approximate locations · Toronto is recorded as “Totonro, CA” in the source. Map: <a class="link" href="https://www.naturalearthdata.com/">Natural Earth</a> (public domain).</p>
</section>

<style>
	.map-section { padding: clamp(16px, 3vw, 32px); }
	.map { position: relative; margin: 24px 0; border-radius: 20px; overflow: hidden; }
	svg { width: 100%; display: block; color: var(--color-primary); opacity: .28; }
	.pin { position: absolute; transform: translate(-50%, -50%); width: 28px; height: 28px; min-height: 28px; padding: 0; border-radius: 50%; font-size: 10px; border: 3px solid var(--color-base-100); }
	.pin.chosen { outline: 3px solid var(--color-secondary); outline-offset: 3px; }
	.pin:focus-visible { outline: 3px solid var(--color-base-content); outline-offset: 3px; }
	.details { padding: 20px; border-radius: 16px; }
	.visit-list { margin-top: 16px; max-height: 230px; overflow-y: auto; display: grid; gap: 16px; }
	.visit-list span { display: block; font-size: 12px; margin: 4px 0; }
	@media (max-width: 500px) { .map { min-height: 200px; } svg { height: 200px; } .pin { width: 22px; height: 22px; min-height: 22px; } }
</style>
