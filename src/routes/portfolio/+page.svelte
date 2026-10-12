<script lang="ts">
	import ActionLink from '#lib/components/ui/ActionLink.svelte';
	import LinkCard from '#lib/components/ui/LinkCard.svelte';
	import { portfolio } from '#lib/data/portfolio.js';
</script>

<svelte:head>
	<title>{portfolio.name} · Portfolio</title>
	<meta name="description" content={portfolio.bio} />
</svelte:head>

<div class="portfolio bg-base-100 text-base-content">
	<section class="intro" aria-labelledby="portfolio-title">
		<p class="eyebrow text-primary">PERSONAL PORTFOLIO / SELECTED WORK</p>
		<h1 id="portfolio-title" class="text-base-content">{portfolio.name}<span class="text-primary">.</span></h1>
		<p class="role">{portfolio.role}</p>
		<p class="bio">{portfolio.bio}</p>
		<ActionLink href="#work">Explore my work ↘</ActionLink>
		{#if portfolio.name === 'Your name'}
			<p class="draft">Draft portfolio — personal details coming soon.</p>
		{/if}
	</section>
	<section id="work" aria-labelledby="work-title">
		<div class="section-heading"><h2 id="work-title" class="text-base-content">Selected work</h2></div>
		<div class="projects">
			{#each portfolio.projects as project, i}
				<a href={project.href} class="project bg-base-200 text-base-content">
					<div class="art text-primary" aria-hidden="true">{project.mark}</div>
					<div class="project-info"><p class="eyebrow">0{i + 1} / {project.category}</p><h3 class="text-base-content">{project.title} ↗</h3><p>{project.description}</p></div>
				</a>
			{/each}
		</div>
	</section>
	<section class="background" aria-labelledby="escape-passport-title">
		<h2 id="escape-passport-title" class="text-base-content mb-5">Playing & exploring</h2>
		<LinkCard href="/portfolio/escape-rooms" title="Escape Room Passport" description="Room visits, cities, and personal field notes from exploring escape games." eyebrow="BEYOND THE PAGE" mark="↗" />
	</section>
	<section class="background" aria-labelledby="background-title">
		<h2 id="background-title" class="text-base-content">Puzzle community</h2>
		{#each portfolio.facts as fact}
			<article><h3 class="text-base-content">{fact.title}</h3><p>{fact.description}</p><a href={fact.href} class="link link-primary">{fact.source} ↗</a></article>
		{/each}
	</section>
	<section class="contact bg-base-200 text-base-content" aria-labelledby="contact-title">
		<h2 id="contact-title" class="text-base-content">Have an interesting idea?</h2>
		<ActionLink href="/contact">Contact for work ↗</ActionLink>
		{#if portfolio.email}
			<a href="mailto:{portfolio.email}" class="link link-primary">{portfolio.email} ↗</a>
		{:else}
			<p>Contact details coming soon.</p>
		{/if}
	</section>
</div>

<style>
	.portfolio { padding: 48px 28px; text-align: left; font-family: 'Noto Sans Thai', system-ui, sans-serif; border-radius: 16px; }
	.intro { padding: 24px 0 64px; }
	.eyebrow { font-size: 11px; letter-spacing: .13em; text-transform: uppercase; }
	h1 { font-size: clamp(32px, 6vw, 62px); line-height: 1.15; margin: 24px 0; font-weight: 600; letter-spacing: -1px; overflow-wrap: anywhere; }
	.role { font-size: 20px; margin: 0 0 16px; }
	.bio { max-width: 520px; opacity: .7; line-height: 1.8; font-size: 16px; margin-bottom: 26px; }
	.draft { opacity: .5; font-size: 12px; margin-top: 18px; }
	.section-heading { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid color-mix(in srgb, currentColor 20%, transparent); padding: 28px 0; }
	.section-heading h2 { margin: 0; font-size: 24px; }
	.projects { display: grid; gap: 18px; }
	.project { display: grid; grid-template-columns: 140px 1fr; border-radius: 12px; overflow: hidden; transition: transform .2s; }
	.project:hover { transform: translateY(-3px); }
	.art { display: grid; place-items: center; font-size: 48px; border-right: 1px solid color-mix(in srgb, currentColor 15%, transparent); }
	.project-info { padding: 26px; }
	h3 { font-size: 21px; margin: 12px 0; }
	.project-info > p:last-child, .contact p { font-size: 14px; opacity: .7; line-height: 1.8; }
	.contact { padding: 30px; margin-top: 48px; border-radius: 12px; }
	.contact h2 { font-size: 24px; }
	.background { margin-top: 48px; }
	.background article { border-top: 1px solid color-mix(in srgb, currentColor 15%, transparent); padding: 20px 0; }
	.background p { font-size: 14px; line-height: 1.8; opacity: .7; }
	.background a { font-size: 12px; }
	@media(max-width: 550px) { .portfolio { padding: 24px 18px; } .project { grid-template-columns: 80px 1fr; } .art { font-size: 32px; } .project-info { padding: 18px; } }
	@media(prefers-reduced-motion: reduce) { .project { transition: none; } }
</style>
