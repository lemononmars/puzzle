<script lang="ts">
	import Surface from '#lib/components/ui/Surface.svelte';
	// Copy this file to src/lib/content/mechanics/EXISTING-MECHANIC-ID.svelte.
	// The existing page supplies its title, description, and navigation.
</script>

<div class="space-y-6 text-left">
	<Surface>
		<section aria-labelledby="concept-title" class="space-y-3">
			<h2 id="concept-title" class="text-xl font-bold">แนวคิด / Concept</h2>
			<p><!-- Write your explanation here. --></p>
		</section>
	</Surface>

	<Surface>
		<section aria-labelledby="approach-title" class="space-y-3">
			<h2 id="approach-title" class="text-xl font-bold">วิธีสังเกต / What to look for</h2>
			<p><!-- Add solving advice, variations, or common mistakes. --></p>
		</section>
	</Surface>

	<Surface>
		<section aria-labelledby="example-title" class="space-y-3">
			<h2 id="example-title" class="text-xl font-bold">ตัวอย่าง / Example</h2>
			<p><!-- Add an example, image, SVG, or your own interactive component. --></p>
			<!-- Images: save to static/images/mechanics/ and use /images/mechanics/file.png.
			     Add descriptive alt text; use width/height and class="w-full h-auto".
			     SVG: use currentColor and semantic theme tokens for puzzle ink. -->
			<details>
				<summary class="cursor-pointer font-bold text-primary">คำใบ้ / Hint</summary>
				<p class="mt-3"><!-- Optional hint. Delete this details block if unnecessary. --></p>
			</details>
			<details>
				<summary class="cursor-pointer font-bold text-primary">เฉลย / Solution</summary>
				<p class="mt-3"><!-- Explain the solution here. --></p>
			</details>
		</section>
	</Surface>

	<Surface>
		<section aria-labelledby="references-title" class="space-y-3">
			<h2 id="references-title" class="text-xl font-bold">แหล่งอ้างอิง / References</h2>
			<p><!-- Add source links, image credits, and related puzzles. --></p>
		</section>
	</Surface>
</div>
