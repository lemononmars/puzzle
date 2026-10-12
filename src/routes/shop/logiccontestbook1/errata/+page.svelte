<svelte:head>
	<title>Code Breaker | Logic Puzzle Contest 1 Book - Errata</title>
</svelte:head>

<h1>Errata</h1>

<p class="px-2 mb-4">
	Found an issue? Email
	<a
		class="link"
		href="mailto:sakulbuth@gmail.com?subject=Logic%20Puzzle%20Contest%201%20Book%20-%20Errata"
		>sakulbuth@gmail.com</a
	>
	with the section and puzzle number.
</p>

<div class="flex flex-col justify-left text-left px-2">
	<ul>
		<li>
			4.13. Choco Banana - Transcription error: the solution has the correct clues but the puzzle
			misses two clues.
		</li>
		<img
			src="https://raw.githubusercontent.com/lemononmars/codebreaker/main/src/lib/images/product/4-13 Choco Banana.png"
			on:error={(e) => {
				if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.display = 'none';
			}}
			class="h-64 aspect-auto object-contain"
			alt="img"
		/><br />
		<a
			href="https://pzprxs.vercel.app/p?cbanana/10/10/i4n3q2i6g4j2i4i2i2j2i2i6i2j2g4i2q4n3i"
			target="_blank"
		>
			Online version
		</a>

		<li>
			4.14. Choco Banana - Transcription error: the solution has the correct clues but the puzzle
			has one misplaced clue (4 in the last column should be moved one cell up.)
		</li>
		<img
			src="https://raw.githubusercontent.com/lemononmars/codebreaker/main/src/lib/images/product/4-14 Choco Banana.png"
			on:error={(e) => {
				if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.display = 'none';
			}}
			class="h-64 aspect-auto object-contain"
			alt="img"
		/><br />
		<a
			href="https://pzprxs.vercel.app/p?cbanana/10/10/2m424g2g4o2w2h-18s4j4l2o42s24g2"
			target="_blank"
		>
			Online version
		</a>

		<li>
			4.23. Choco Banana (Flooded) - Uniqueness: the puzzle has been revamped. see the new version
			below.
		</li>
		<img
			src="https://raw.githubusercontent.com/lemononmars/codebreaker/main/src/lib/images/product/4-23 Choco Banana.png"
			on:error={(e) => {
				if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.display = 'none';
			}}
			class="h-64 aspect-auto object-contain"
			alt="img"
		/><br />

		<a href="https://tinyurl.com/2cjorewn" target="_blank"> Online version </a><br />
		<a
			href="https://raw.githubusercontent.com/lemononmars/codebreaker/main/src/lib/images/product/4-23 Choco Banana Sol.png"
			target="_blank"
		>
			Solution
		</a>

		<li>
			4.24. Choco Banana (Flooded) - Uniqueness: the center clues have been adjusted. see the new
			version below.
		</li>
		<img
			src="https://raw.githubusercontent.com/lemononmars/codebreaker/main/src/lib/images/product/4-24 Choco Banana.png"
			on:error={(e) => {
				if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.display = 'none';
			}}
			class="h-64 aspect-auto object-contain"
			alt="img"
		/><br />

		<a href="https://tinyurl.com/28vo3rbf" target="_blank"> Online version </a><br />
		<a
			href="https://raw.githubusercontent.com/lemononmars/codebreaker/main/src/lib/images/product/4-24 Choco Banana Sol.png"
			target="_blank"
		>
			Solution
		</a>
	</ul>
</div>
