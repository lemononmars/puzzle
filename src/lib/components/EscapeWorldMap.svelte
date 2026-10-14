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
			<button class="pin btn btn-primary" class:chosen={active === i} style={`--pin-x:${(place.lon + 180) / 360};--pin-y:${(90 - place.lat) / 180}`} style:left={`${(place.lon + 180) / 3.6}%`} style:top={`calc(var(--pin-y) * 200px)`} aria-label={`${place.label}: ${place.rooms.length} room visits`} aria-pressed={active === i} onpointerenter={() => active = i} onfocus={() => active = i} onclick={() => active = i}><svg class="pin-shape" viewBox="0 0 32 40" aria-hidden="true"><path d="M16 38C12 31 2 22 2 15a14 14 0 0 1 28 0c0 7-10 16-14 23Z" fill="currentColor" stroke="var(--color-base-100)" stroke-width="2"/><circle cx="16" cy="15" r="5" fill="var(--color-base-100)"/></svg></button>
		{/each}
	<div class="details bg-base-100 text-base-content" aria-live="polite">
		<h3 class="text-xl">{places[active].label} <span class="text-sm botanical-muted">· {places[active].rooms.length} visits</span></h3>
		<ul class="visit-list">{#each places[active].rooms as room}<li><strong>{room.title}</strong><span class="botanical-muted">{room.venue}{room.date ? ` · ${room.date}` : ''}</span>{#if room.note}<p class="text-sm">{room.note}</p>{/if}</li>{/each}</ul>
		<div class="flex flex-wrap gap-2 mt-4">{#each places[active].cities as city}<button class="btn btn-sm btn-outline btn-primary" onclick={() => onselect(city)}>Show {city === 'Totonro, CA' ? 'Toronto' : city} visits ↓</button>{/each}</div>
	</div>
	</div>
	<p class="botanical-muted text-xs mt-3">Approximate locations · Toronto is recorded as “Totonro, CA” in the source. Map: <a class="link" href="https://www.naturalearthdata.com/">Natural Earth</a> (public domain).</p>
</section>

<style>
	.map-section { padding: clamp(16px, 3vw, 32px); }
	.map { position: relative; margin: 24px 0; border-radius: 20px; overflow: hidden; }
	.map > svg { width: 100%; display: block; color: var(--color-primary); opacity: .28; }
	.pin { position:absolute; transform:translate(-50%,-100%); width:32px; height:40px; min-height:40px; padding:0; background:transparent; border:0; border-radius:0; color:var(--color-primary); box-shadow:none; }
	.pin:hover,.pin.chosen { background:transparent; color:var(--color-accent-content); }
	.pin.chosen .pin-shape { filter:drop-shadow(0 2px 3px #364b3e44); }
	.pin-shape { width:100%; height:100%; }
	.pin:focus-visible { outline: 3px solid var(--color-base-content); outline-offset: 3px; }
	.details { position:relative; margin:0 16px 16px; padding:20px; border-radius:16px; border:1px solid var(--color-base-300); }
	@media(min-width:900px) { .map { min-height:410px; } .map > svg { width:calc(100% - 320px); height:410px; } .details { position:absolute; right:0; top:16px; bottom:16px; width:300px; margin:0 16px 0 0; overflow-y:auto; } .pin { left:calc(var(--pin-x) * (100% - 320px)) !important; top:calc(var(--pin-y) * 410px) !important; } }
	.visit-list { margin-top: 16px; max-height: 230px; overflow-y: auto; display: grid; gap: 16px; }
	.visit-list span { display: block; font-size: 12px; margin: 4px 0; }
	@media(max-width:899px) { .map > svg { height:200px; } .pin { width:26px; height:34px; min-height:34px; } }
</style>
