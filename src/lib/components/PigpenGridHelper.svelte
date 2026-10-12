<script lang="ts">
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 select-none font-mono">
	<!-- Grid 1: # (A - I) -->
	<div class="bg-base-100 text-base-content p-5 rounded-2xl border border-base-300 flex flex-col items-center gap-3">
		<h4 class="text-xs font-bold text-warning-content">1. ตาราง # (A - I)</h4>
		<svg width="180" height="180" viewBox="0 0 180 180" class="text-primary">
			<!-- # Grid lines -->
			<line x1="60" y1="10" x2="60" y2="170" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
			<line x1="120" y1="10" x2="120" y2="170" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
			<line x1="10" y1="60" x2="170" y2="60" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
			<line x1="10" y1="120" x2="170" y2="120" stroke="currentColor" stroke-width="3" stroke-linecap="round" />

			<!-- Letters A - I -->
			<text x="30" y="40" font-size="20" font-weight="bold" fill="var(--color-secondary)" text-anchor="middle" dominant-baseline="middle">A</text>
			<text x="90" y="40" font-size="20" font-weight="bold" fill="var(--color-secondary)" text-anchor="middle" dominant-baseline="middle">B</text>
			<text x="150" y="40" font-size="20" font-weight="bold" fill="var(--color-secondary)" text-anchor="middle" dominant-baseline="middle">C</text>

			<text x="30" y="90" font-size="20" font-weight="bold" fill="var(--color-secondary)" text-anchor="middle" dominant-baseline="middle">D</text>
			<text x="90" y="90" font-size="20" font-weight="bold" fill="var(--color-secondary)" text-anchor="middle" dominant-baseline="middle">E</text>
			<text x="150" y="90" font-size="20" font-weight="bold" fill="var(--color-secondary)" text-anchor="middle" dominant-baseline="middle">F</text>

			<text x="30" y="140" font-size="20" font-weight="bold" fill="var(--color-secondary)" text-anchor="middle" dominant-baseline="middle">G</text>
			<text x="90" y="140" font-size="20" font-weight="bold" fill="var(--color-secondary)" text-anchor="middle" dominant-baseline="middle">H</text>
			<text x="150" y="140" font-size="20" font-weight="bold" fill="var(--color-secondary)" text-anchor="middle" dominant-baseline="middle">I</text>
		</svg>
	</div>

	<!-- Grid 2: # with Dot (J - R) -->
	<div class="bg-base-100 text-base-content p-5 rounded-2xl border border-base-300 flex flex-col items-center gap-3">
		<h4 class="text-xs font-bold text-primary">2. ตาราง # มีจุด (J - R)</h4>
		<svg width="180" height="180" viewBox="0 0 180 180" class="text-accent-content">
			<!-- # Grid lines -->
			<line x1="60" y1="10" x2="60" y2="170" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
			<line x1="120" y1="10" x2="120" y2="170" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
			<line x1="10" y1="60" x2="170" y2="60" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
			<line x1="10" y1="120" x2="170" y2="120" stroke="currentColor" stroke-width="3" stroke-linecap="round" />

			<!-- Dots & Letters J - R -->
			<g fill="#06b6d4" text-anchor="middle" dominant-baseline="middle" font-size="18" font-weight="bold">
				<circle cx="20" cy="40" r="3" /> <text x="36" y="40">J</text>
				<circle cx="80" cy="40" r="3" /> <text x="96" y="40">K</text>
				<circle cx="140" cy="40" r="3" /> <text x="156" y="40">L</text>

				<circle cx="20" cy="90" r="3" /> <text x="36" y="90">M</text>
				<circle cx="80" cy="90" r="3" /> <text x="96" y="90">N</text>
				<circle cx="140" cy="90" r="3" /> <text x="156" y="90">O</text>

				<circle cx="20" cy="140" r="3" /> <text x="36" y="140">P</text>
				<circle cx="80" cy="140" r="3" /> <text x="96" y="140">Q</text>
				<circle cx="140" cy="140" r="3" /> <text x="156" y="140">R</text>
			</g>
		</svg>
	</div>

	<!-- Grid 3: X (S - V) -->
	<div class="bg-base-100 text-base-content p-5 rounded-2xl border border-base-300 flex flex-col items-center gap-3">
		<h4 class="text-xs font-bold text-primary">3. ตาราง X (S - V)</h4>
		<svg width="180" height="180" viewBox="0 0 180 180" class="text-success-content">
			<!-- X Grid lines -->
			<line x1="20" y1="20" x2="160" y2="160" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
			<line x1="160" y1="20" x2="20" y2="160" stroke="currentColor" stroke-width="3" stroke-linecap="round" />

			<!-- Letters S - V -->
			<text x="90" y="40" font-size="20" font-weight="bold" fill="#10b981" text-anchor="middle" dominant-baseline="middle">S</text>
			<text x="140" y="90" font-size="20" font-weight="bold" fill="#10b981" text-anchor="middle" dominant-baseline="middle">T</text>
			<text x="40" y="90" font-size="20" font-weight="bold" fill="#10b981" text-anchor="middle" dominant-baseline="middle">U</text>
			<text x="90" y="140" font-size="20" font-weight="bold" fill="#10b981" text-anchor="middle" dominant-baseline="middle">V</text>
		</svg>
	</div>

	<!-- Grid 4: X with Dot (W - Z) -->
	<div class="bg-base-100 text-base-content p-5 rounded-2xl border border-base-300 flex flex-col items-center gap-3">
		<h4 class="text-xs font-bold text-secondary">4. ตาราง X มีจุด (W - Z)</h4>
		<svg width="180" height="180" viewBox="0 0 180 180" class="text-secondary">
			<!-- X Grid lines -->
			<line x1="20" y1="20" x2="160" y2="160" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
			<line x1="160" y1="20" x2="20" y2="160" stroke="currentColor" stroke-width="3" stroke-linecap="round" />

			<!-- Dots & Letters W - Z -->
			<g fill="#a855f7" text-anchor="middle" dominant-baseline="middle" font-size="18" font-weight="bold">
				<circle cx="90" cy="25" r="3" /> <text x="90" y="45">W</text>
				<circle cx="155" cy="90" r="3" /> <text x="135" y="90">X</text>
				<circle cx="25" cy="90" r="3" /> <text x="45" y="90">Y</text>
				<circle cx="90" cy="155" r="3" /> <text x="90" y="135">Z</text>
			</g>
		</svg>
	</div>
</div>
