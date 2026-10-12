<script lang="ts">
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import PuzzleCard from '#lib/components/PuzzleCard.svelte';



	const battlePuzzle = {
		type: 'battle',
		title: 'Puzzle Battle Arena',
		description: 'สังเวียนประลองปริศนาสด แข่งขันแบบเรียลไทม์ (Multiplayer)',
		icon: `<svg class="w-10 h-10 text-primary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M14.5 17.5L3 6V3h3l11.5 11.5"/>
			<path d="M13 19l6 2 3-3-2-6"/>
			<path d="M9.5 14.5L21 3h-3L6.5 14.5"/>
			<path d="M5 19l-2 3 3-2"/>
		</svg>`
	};

	const wordPuzzles = [
		{
			type: 'rebus',
			title: 'Rebus',
			description: 'ทายคำจากภาพ',
			icon: `<svg class="w-10 h-10 text-primary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<rect x="3" y="3" width="18" height="18" rx="2" />
				<circle cx="8.5" cy="8.5" r="1.5" />
				<path d="M21 15l-5-5L5 21" />
				<path d="M16 13.5l2.5-2.5 2.5 2.5" />
				<circle cx="16" cy="7" r="2" />
			</svg>`
		},
		{
			type: 'hiddenlink',
			title: 'Hidden Link',
			description: 'ถอดรหัสจุดร่วมจาก 4 คำ',
			icon: `<svg class="w-10 h-10 text-primary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
				<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
			</svg>`
		},
		{
			type: 'wordsearch',
			title: 'Word Search',
			description: 'ปริศนาหาคำศัพท์',
			icon: `<svg class="w-10 h-10 text-primary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="11" cy="11" r="8" />
				<line x1="21" y1="21" x2="16.65" y2="16.65" />
				<line x1="8" y1="8" x2="14" y2="14" />
				<line x1="14" y1="8" x2="8" y2="14" />
			</svg>`
		},
		{
			type: 'crossword',
			title: 'Crossword',
			description: 'ปริศนาอักษรไขว้',
			icon: `<svg class="w-10 h-10 text-primary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<rect x="3" y="3" width="18" height="18" rx="2" />
				<line x1="3" y1="9" x2="21" y2="9" />
				<line x1="3" y1="15" x2="21" y2="15" />
				<line x1="9" y1="3" x2="9" y2="21" />
				<line x1="15" y1="3" x2="15" y2="21" />
				<rect x="3" y="3" width="6" height="6" fill="currentColor" fill-opacity="0.15" />
				<rect x="15" y="9" width="6" height="6" fill="currentColor" fill-opacity="0.15" />
				<rect x="9" y="15" width="6" height="6" fill="currentColor" fill-opacity="0.15" />
			</svg>`
		},
		{
			type: 'alphabet',
			title: 'Alphabet',
			description: 'ทายคำจากคำใบ้ โดยเปิดตัวอักษรให้น้อยที่สุด',
			icon: `<svg class="w-10 h-10 text-primary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<rect x="3" y="3" width="8" height="8" rx="1" />
				<rect x="13" y="13" width="8" height="8" rx="1" />
				<text x="7" y="9" font-size="6" font-family="sans-serif" font-weight="black" text-anchor="middle" fill="currentColor">A</text>
				<text x="17" y="19" font-size="6" font-family="sans-serif" font-weight="black" text-anchor="middle" fill="currentColor">Z</text>
				<path d="M7 11v4h6" />
			</svg>`
		},
		{
			type: 'missingvowels',
			title: 'Missing Vowels',
			description: 'ทายคำจากพยัญชนะที่ไม่มีสระ',
			icon: `<svg class="w-10 h-10 text-primary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<line x1="4" y1="9" x2="20" y2="9"/>
				<line x1="4" y1="15" x2="20" y2="15"/>
				<line x1="10" y1="3" x2="8" y2="21"/>
				<line x1="16" y1="3" x2="14" y2="21"/>
			</svg>`
		},
		{
			type: 'cryptogram',
			title: 'Cryptogram',
			description: 'ถอดรหัสข้อความลับซ่อนคำ',
			icon: `<svg class="w-10 h-10 text-primary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
				<path d="M7 11V7a5 5 0 0 1 10 0v4"/>
			</svg>`
		}
	];

	const generatedWordPuzzles = [
		{
			type: 'crossroad',
			title: 'Crossroad',
			description: 'เติมคำเพื่อสร้างคำทั้งสี่ทิศทาง',
			icon: `<svg class="w-10 h-10 text-primary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 2v20M2 12h20M7 7l10 10M17 7L7 17"/>
			</svg>`
		},
		{
			type: 'spellingbee',
			title: 'Spelling Bee',
			description: 'ผสมคำจากตัวอักษร 7 ตัวที่กำหนด',
			icon: `<svg class="w-10 h-10 text-primary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
			</svg>`
		},
		{
			type: 'blanks',
			title: 'Blanks',
			description: 'เติมตัวอักษรที่หายไปในคำ',
			icon: `<svg class="w-10 h-10 text-primary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 20h9"/>
				<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
			</svg>`
		},
		{
			type: 'spellingquiz',
			title: 'Spelling Quiz',
			description: 'ควิซวัดความแม่นยำในการสะกดคำ',
			icon: `<svg class="w-10 h-10 text-primary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
				<polyline points="14 2 14 8 20 8"/>
				<line x1="9" y1="15" x2="15" y2="15"/>
			</svg>`
		},
		{
			type: 'wordladder',
			title: 'Word Ladder',
			description: 'เปลี่ยนคำทีละหนึ่งช่องเพื่อไปให้ถึงคำปลายทาง',
			icon: `<svg class="w-10 h-10 text-primary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<line x1="4" y1="5" x2="20" y2="5"/>
				<line x1="4" y1="5" x2="4" y2="19"/>
				<line x1="20" y1="5" x2="20" y2="19"/>
				<line x1="4" y1="10" x2="20" y2="10"/>
				<line x1="4" y1="15" x2="20" y2="15"/>
				<line x1="4" y1="19" x2="20" y2="19"/>
				<circle cx="12" cy="7.5" r="1" fill="currentColor"/>
				<circle cx="12" cy="12.5" r="1" fill="currentColor"/>
			</svg>`
		},
		{
			type: 'boggle',
			title: 'Boggle',
			description: 'ลากเส้นเชื่อมตัวอักษรเพื่อผสมคำ',
			icon: `<svg class="w-10 h-10 text-primary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<rect x="3" y="3" width="18" height="18" rx="2" />
				<circle cx="8" cy="8" r="1.5" />
				<circle cx="16" cy="8" r="1.5" />
				<circle cx="8" cy="16" r="1.5" />
				<circle cx="16" cy="16" r="1.5" />
				<path d="M8 8l8 8" />
			</svg>`
		}
	];

	const quizPuzzles = [
		{
			type: 'quiz',
			title: 'Quiz',
			description: 'ควิซความรู้รอบตัวและป๊อปคัลเจอร์ สไตล์เกมโชว์ตอบคำถามกดปุ่มแย่งตอบ พร้อมเสียงอ่าน',
			icon: `<svg class="w-10 h-10 text-secondary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="12" cy="12" r="10"/>
				<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
				<line x1="12" y1="17" x2="12.01" y2="17"/>
			</svg>`
		},
		{
			type: 'thechase',
			title: 'The Chase',
			description: 'เกมโชว์ตอบคำถาม 3 ตัวเลือก ประลองความไวบนกระดานไล่ล่า 7 ขั้น และรอบสุดท้ายกับผู้ล่า',
			icon: `<svg class="w-10 h-10 text-secondary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
			</svg>`
		},
		{
			type: 'thaimapquiz',
			title: 'Thai Map Quiz',
			description: 'ควิซทายชื่อจังหวัดและตำแหน่งบนแผนที่ไทย',
			icon: `<svg class="w-10 h-10 text-secondary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
				<line x1="8" y1="2" x2="8" y2="18"/>
				<line x1="16" y1="6" x2="16" y2="22"/>
			</svg>`
		}
	];

	const nonWordPuzzles = [
		{
			type: 'eulersquare',
			title: 'Euler Square',
			description: 'Graeco-Latin Square: Fill rows and columns with unique letter and color symbol pairs',
			icon: `<svg class="w-10 h-10 text-primary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<rect x="3" y="3" width="18" height="18" rx="2" />
				<line x1="3" y1="9" x2="21" y2="9" />
				<line x1="3" y1="15" x2="21" y2="15" />
				<line x1="9" y1="3" x2="9" y2="21" />
				<line x1="15" y1="3" x2="15" y2="21" />
				<circle cx="6" cy="6" r="1.5" fill="#ef4444" />
				<circle cx="12" cy="12" r="1.5" fill="#3b82f6" />
				<circle cx="18" cy="18" r="1.5" fill="#10b981" />
			</svg>`
		},
		{
			type: 'logicpuzzle',
			title: 'Logic Puzzles',
			description: 'คลังโจทย์โลจิคพัซเซิล',
			icon: `<svg class="w-10 h-10 text-primary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<rect x="3" y="3" width="18" height="18" rx="2" />
				<path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
			</svg>`
		},
		{
			type: 'puzzlehunt',
			title: 'Puzzle Hunt',
			description: 'แก้ชุดปริศนา',
			icon: `<svg class="w-10 h-10 text-primary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="12" cy="12" r="10" />
				<polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
			</svg>`
		}
	];

	const otherPuzzles = [
		{
			type: 'mathsticks',
			title: 'Mathsticks',
			description: 'ปริศนาย้ายไม้ขีดไฟเพื่อแก้สมการคณิตศาสตร์',
			icon: `<svg class="w-10 h-10 text-secondary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 2v20M2 12h20"/>
				<circle cx="12" cy="4" r="1.5" fill="currentColor"/>
			</svg>`
		},
		{
			type: 'mathdle',
			title: 'Mathdle',
			description: 'เกมนิรนัยทายสมการคณิตศาสตร์ประจำวัน',
			icon: `<svg class="w-10 h-10 text-secondary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<rect x="4" y="4" width="16" height="16" rx="2"/>
				<line x1="8" y1="10" x2="16" y2="10"/>
				<line x1="8" y1="14" x2="16" y2="14"/>
				<line x1="12" y1="8" x2="12" y2="16"/>
			</svg>`
		},
		{
			type: 'calendar2026',
			title: 'Calendar 2026',
			description: 'ปริศนาไปรษณียบัตรจากปฏิทิน Code Breaker 2026',
			icon: `<svg class="w-10 h-10 text-secondary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
				<line x1="16" y1="2" x2="16" y2="6"/>
				<line x1="8" y1="2" x2="8" y2="6"/>
				<line x1="3" y1="10" x2="21" y2="10"/>
				<path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
			</svg>`
		},
		{
			type: 'deduction',
			title: 'Deduction Games',
			description: 'เกมนิรนัยทายกฎลับ',
			icon: `<svg class="w-10 h-10 text-secondary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
				<polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
				<line x1="12" y1="22.08" x2="12" y2="12"/>
			</svg>`
		},
			{
			type: 'thaipuzzleline',
			title: 'ปริศนาภาษาไทย',
			description: 'แก้ปริศนาภาษาไทยผ่าน Line',
			href: 'https://line.me/R/ti/p/@231qozuo',
			icon: `<svg class="w-10 h-10 text-secondary transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
			</svg>`
		}
	];
</script>

<svelte:head>
	<title>Puzzle | Puzzles</title>
	<meta
		name="description"
		content="ลับสมองด้วยปริศนาหลากรูปแบบ ทั้งอักษรไขว้ Crossroad ทายศัพท์ เติมคำในช่องว่าง และอื่น ๆ อีกมากมาย"
	/>
</svelte:head>

<div class="container mx-auto px-4 pt-6 sm:pt-12 pb-24 flex flex-col gap-10 max-w-5xl">
	<PageHeading title="Puzzles" description="ลับสมองด้วยปริศนาหลากรูปแบบ" eyebrow="FIND YOUR NEXT LITTLE DISCOVERY" />

	<!-- 2. Battle Arena Section -->
	<section class="flex flex-col gap-4">
		<h2 class="text-xl sm:text-2xl font-bold tracking-tight text-primary border-b border-base-300 pb-2">
			⚔️ สังเวียนประลองสด (Puzzle Battle)
		</h2>
		<PuzzleCard
			type={battlePuzzle.type}
			title={battlePuzzle.title}
			description={battlePuzzle.description}
			icon={battlePuzzle.icon}
		/>
	</section>

	<!-- 3. Quizzes Section (Thai Quiz, The Chase, Thai Map Quiz) -->
	<section class="flex flex-col gap-4">
		<h2 class="text-xl sm:text-2xl font-bold tracking-tight text-secondary border-b border-base-300 pb-2">
			🧠 ควิซและเกมตอบคำถาม (Quizzes)
		</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
			{#each quizPuzzles as p}
				<PuzzleCard
					type={p.type}
					title={p.title}
					description={p.description}
					icon={p.icon}
				/>
			{/each}
		</div>
	</section>

	<!-- 4. Crafted Word Puzzles Section (Rebus, Word Search, Crossword, Alphabet, Missing Vowels, Cryptogram) -->
	<section class="flex flex-col gap-4">
		<h2 class="text-xl sm:text-2xl font-bold tracking-tight text-primary border-b border-base-300 pb-2">
			🔠 ปริศนาภาษาทำมือ (Crafted Word Puzzles)
		</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
			{#each wordPuzzles as p}
				<PuzzleCard
					type={p.type}
					title={p.title}
					description={p.description}
					icon={p.icon}
				/>
			{/each}
		</div>
	</section>

	<!-- 5. Generated Word Puzzles Section (Crossroad, Spelling Bee, Blanks, Spelling Quiz) -->
	<section class="flex flex-col gap-4">
		<h2 class="text-xl sm:text-2xl font-bold tracking-tight text-primary border-b border-base-300 pb-2">
			🔠 ปริศนาภาษาสร้างจากพจนานุกรม (Generated Word Puzzles)
		</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
			{#each generatedWordPuzzles as p}
				<PuzzleCard
					type={p.type}
					title={p.title}
					description={p.description}
					icon={p.icon}
				/>
			{/each}
		</div>
	</section>

	<!-- 6. Non-Word Puzzles Section -->
	<section class="flex flex-col gap-4">
		<h2 class="text-xl sm:text-2xl font-bold tracking-tight text-primary border-b border-base-300 pb-2">
			🧭 ปริศนาทั่วไปและตรรกศาสตร์ (Non-Word Puzzles)
		</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
			{#each nonWordPuzzles as p}
				<PuzzleCard
					type={p.type}
					title={p.title}
					description={p.description}
					icon={p.icon}
				/>
			{/each}
		</div>
	</section>

	<!-- 7. Other Puzzles Section -->
	<section class="flex flex-col gap-4">
		<h2 class="text-xl sm:text-2xl font-bold tracking-tight text-secondary border-b border-base-300 pb-2">
			💬 อื่นๆ (Others)
		</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
			{#each otherPuzzles as p}
				<PuzzleCard
					type={p.type}
					title={p.title}
					description={p.description}
					icon={p.icon}
					href={p.href}
				/>
			{/each}
		</div>
	</section>
</div>
