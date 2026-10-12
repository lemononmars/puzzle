<script lang="ts">
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import ToolCard from '#lib/components/ToolCard.svelte';
	import {
		CheckCircleIcon,
		GridIcon,
		SearchIcon,
		ColumnsIcon,
		ImageIcon,
		Edit3Icon,
		BookOpenIcon,
		TypeIcon,
		ClockIcon,
		RadioIcon
	} from 'svelte-feather-icons';

	const puzzleBuilders = [
		{
			name: 'Crossword Builder',
			path: '/tools/crossword',
			description: 'สร้างตารางอักษรไขว้ภาษาไทย',
			icon: ColumnsIcon,
			color: 'text-primary'
		},
		{
			name: 'Word Search Builder',
			path: '/tools/wordsearch',
			description: 'สร้างตารางหาคำศัพท์ภาษาไทย',
			icon: Edit3Icon,
			color: 'text-secondary'
		},
		{
			name: 'Missing Vowels Builder',
			path: '/tools/missingvowels',
			description: 'สร้างปริศนาพยัญชนะไม่มีสระ',
			icon: TypeIcon,
			color: 'text-primary'
		},
		{
			name: 'Alphabet Builder',
			path: '/tools/alphabet',
			description: 'สร้างปริศนาหาคำตามคำใบ้ภาษาไทย',
			icon: BookOpenIcon,
			color: 'text-primary'
		}
	];

	const utilities = [
		{
			name: 'Countdown',
			path: '/tools/countdown',
			description: 'สร้างคำที่ใช้ตัวอักษรมากที่สุด',
			icon: ClockIcon,
			color: 'text-secondary'
		},
		{
			name: 'Answer Checker',
			path: '/tools/check',
			description: 'สร้างหน้าเว็บสำหรับตรวจคำตอบ',
			icon: CheckCircleIcon,
			color: 'text-primary'
		},
		{
			name: 'Pentomino Solver',
			path: '/tools/pentomino',
			description: 'แก้ปริศนา pentomino ขนาด 8x8',
			icon: GridIcon,
			color: 'text-primary'
		},
		{
			name: 'Thai Word Search',
			path: '/tools/thwordsearch',
			description: 'ค้นหาคำในภาษาไทยที่ตรงกับรูปแบบ',
			icon: SearchIcon,
			color: 'text-secondary'
		},
		{
			name: 'Jigsaw Quiz',
			path: '/tools/jigsaw',
			description: 'ปริศนาเปิดแผ่นป้าย "แฟนพันธุ์แท้"',
			icon: ImageIcon,
			color: 'text-primary'
		},
		{
			name: 'Quiz Button',
			path: '/tools/button',
			description: 'ระบบปุ่มกดแย่งกันตอบสำหรับแข่งตอบคำถาม',
			icon: RadioIcon,
			color: 'text-primary'
		}
	];
</script>

<svelte:head>
	<title>Puzzle | เครื่องมือสร้างและช่วยแก้ปริศนา 🛠️</title>
	<meta name="description" content="รวมเครื่องมือสำหรับสร้างและแก้ปริศนาภาษาไทย ครบครันสำหรับนักสร้างโจทย์และผู้เล่น" />
</svelte:head>

<div class="flex flex-col gap-8 w-full max-w-5xl mx-auto px-4 py-8 select-none">
	<PageHeading title="เครื่องมือสร้างและแก้ปริศนา" description="เครื่องมือสำเร็จรูปสำหรับครู ผู้สร้างโจทย์ และนักแก้ปริศนา" eyebrow="MAKE SOMETHING CURIOUS" />

	<!-- Section 1: Builders (2 per row) -->
	<section class="space-y-4">
		<div class="flex items-center gap-2 border-b border-base-300 pb-2">
			<h2 class="text-xl font-extrabold text-primary">เครื่องมือสร้างโจทย์ (Puzzle Builders)</h2>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each puzzleBuilders as tool}
				<ToolCard {...tool} />
			{/each}
		</div>
	</section>

	<!-- Section 2: Utilities (2 per row, without Spelling Dictionary) -->
	<section class="space-y-4">
		<div class="flex items-center gap-2 border-b border-base-300 pb-2">
			<h2 class="text-xl font-extrabold text-secondary">เครื่องมือช่วยเหลือ & ยูทิลิตี้ (Utilities)</h2>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each utilities as tool}
				<ToolCard {...tool} />
			{/each}
		</div>
	</section>
</div>
