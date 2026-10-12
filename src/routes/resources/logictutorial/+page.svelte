<script lang="ts">
	import { ExternalLinkIcon, PlayCircleIcon, ArrowLeftIcon } from 'svelte-feather-icons';

	const playlistUrl = 'https://www.youtube.com/playlist?list=PLKQysr88T8R9i-hKPYRy0ql5_82Kogqn9';

	const puzzleCards = [
		{
			name: 'Akari (ปริศนาแสงไฟ)',
			title: 'Akari (ปริศนาแสงไฟ) - แนะนำปริศนา Pencil & Paper',
			url: 'https://www.youtube.com/watch?v=dHI2lgU7bpM',
			thumbnail: 'https://i.ytimg.com/vi/dHI2lgU7bpM/hqdefault.jpg'
		},
		{
			name: 'Fillomino (ปริศนาเติมให้เต็ม)',
			title: 'Fillomino (ปริศนาเติมให้เต็ม) - แนะนำปริศนา Pencil & Paper',
			url: 'https://www.youtube.com/watch?v=BPg7iApE7fw',
			thumbnail: 'https://i.ytimg.com/vi/BPg7iApE7fw/hqdefault.jpg'
		},
		{
			name: 'Hashiwokakero (ปริศนาข้ามสะพาน)',
			title: 'Hashiwokakero (ปริศนาข้ามสะพาน) - แนะนำปริศนา Pencil & Paper',
			url: 'https://www.youtube.com/watch?v=vcyr4ES2UkY',
			thumbnail: 'https://i.ytimg.com/vi/vcyr4ES2UkY/hqdefault.jpg'
		},
		{
			name: 'Kurodoku (ปริศนาแบ่งช่องมองไกล)',
			title: 'Kurodoku (ปริศนาแบ่งช่องมองไกล) - แนะนำปริศนา Pencil & Paper',
			url: 'https://www.youtube.com/watch?v=jSgZ59tjV7g',
			thumbnail: 'https://i.ytimg.com/vi/jSgZ59tjV7g/hqdefault.jpg'
		},
		{
			name: 'LITS (ปริศนาต่อเททริส)',
			title: 'LITS (ปริศนาต่อเททริส) - แนะนำปริศนา Pencil & Paper',
			url: 'https://www.youtube.com/watch?v=IifgXRP5a3k',
			thumbnail: 'https://i.ytimg.com/vi/IifgXRP5a3k/hqdefault.jpg'
		},
		{
			name: 'Norinori (ปริศนาวางสาหร่าย)',
			title: 'Norinori (ปริศนาวางสาหร่าย) - แนะนำปริศนา Pencil & Paper',
			url: 'https://www.youtube.com/watch?v=i5zzI_vQTME',
			thumbnail: 'https://i.ytimg.com/vi/i5zzI_vQTME/hqdefault.jpg'
		},
		{
			name: 'Numberlink (ปริศนาจราจร)',
			title: 'Numberlink (ปริศนาจราจร) - แนะนำปริศนา Pencil & Paper',
			url: 'https://www.youtube.com/watch?v=CtTw-lK570s',
			thumbnail: 'https://i.ytimg.com/vi/CtTw-lK570s/hqdefault.jpg'
		},
		{
			name: 'Heyawake',
			title: 'Puzzle : Heyawake',
			url: 'https://www.youtube.com/watch?v=C1Hm_IJxz2U',
			thumbnail: 'https://i.ytimg.com/vi/C1Hm_IJxz2U/hqdefault.jpg'
		},
		{
			name: 'Kakuro',
			title: 'Puzzle : Kakuro',
			url: 'https://www.youtube.com/watch?v=5vgT0uz6a5I',
			thumbnail: 'https://i.ytimg.com/vi/5vgT0uz6a5I/hqdefault.jpg'
		},
		{
			name: 'Mashu',
			title: 'Puzzle : Mashu',
			url: 'https://www.youtube.com/watch?v=oewl-MpeDvU',
			thumbnail: 'https://i.ytimg.com/vi/oewl-MpeDvU/hqdefault.jpg'
		},
		{
			name: 'Nurikabe',
			title: 'Puzzle : Nurikabe',
			url: 'https://www.youtube.com/watch?v=Hw2ICengIh0',
			thumbnail: 'https://i.ytimg.com/vi/Hw2ICengIh0/hqdefault.jpg'
		},
		{
			name: 'Ripple Effect',
			title: 'Puzzle : Ripple Effect',
			url: 'https://www.youtube.com/watch?v=PawmtACS8cc',
			thumbnail: 'https://i.ytimg.com/vi/PawmtACS8cc/hqdefault.jpg'
		},
		{
			name: 'Satogaeri',
			title: 'Puzzle : Satogaeri',
			url: 'https://www.youtube.com/watch?v=FiZnWFFlyU8',
			thumbnail: 'https://i.ytimg.com/vi/FiZnWFFlyU8/hqdefault.jpg'
		},
		{
			name: 'Shakashaka',
			title: 'Puzzle : Shakashaka',
			url: 'https://www.youtube.com/watch?v=iTFPCu8bwf4',
			thumbnail: 'https://i.ytimg.com/vi/iTFPCu8bwf4/hqdefault.jpg'
		},
		{
			name: 'Shikaku',
			title: 'Puzzle : Shikaku',
			url: 'https://www.youtube.com/watch?v=iSSbgpamdU8',
			thumbnail: 'https://i.ytimg.com/vi/iSSbgpamdU8/hqdefault.jpg'
		},
		{
			name: 'Skyscraper',
			title: 'Puzzle : Skyscraper',
			url: 'https://www.youtube.com/watch?v=7JOYPPuCIO8',
			thumbnail: 'https://i.ytimg.com/vi/7JOYPPuCIO8/hqdefault.jpg'
		},
		{
			name: 'Slitherlink',
			title: 'Puzzle : Slitherlink',
			url: 'https://www.youtube.com/watch?v=3xOfAXGlXLE',
			thumbnail: 'https://i.ytimg.com/vi/3xOfAXGlXLE/hqdefault.jpg'
		},
		{
			name: 'Star Battle',
			title: 'Puzzle : Star Battle',
			url: 'https://www.youtube.com/watch?v=lMSu0SERRlM',
			thumbnail: 'https://i.ytimg.com/vi/lMSu0SERRlM/hqdefault.jpg'
		},
		{
			name: 'Sudoku',
			title: 'Puzzle : Sudoku',
			url: 'https://www.youtube.com/watch?v=FT9df3lnpBA',
			thumbnail: 'https://i.ytimg.com/vi/FT9df3lnpBA/hqdefault.jpg'
		},
		{
			name: 'Tentai Show',
			title: 'Puzzle : Tentai Show',
			url: 'https://www.youtube.com/watch?v=nWgd01iVMqM',
			thumbnail: 'https://i.ytimg.com/vi/nWgd01iVMqM/hqdefault.jpg'
		},
		{
			name: 'Yajirin',
			title: 'Puzzle : Yajirin',
			url: 'https://www.youtube.com/watch?v=KErrOKKi5vU',
			thumbnail: 'https://i.ytimg.com/vi/KErrOKKi5vU/hqdefault.jpg'
		}
	];
</script>

<svelte:head>
	<title>Code Breaker | Logic Puzzle Tutorials 🎥</title>
	<meta name="description" content="คู่มือและคลิปสอนวิธีเล่น 21 ประเภท Logic Puzzles โดย Codebreaker Thailand" />
</svelte:head>

<div class="flex flex-col gap-8 w-full max-w-6xl mx-auto px-4 py-8 select-none">
	<!-- Navigation -->
	<div class="flex items-center justify-between">
		<a href="/resources" class="btn btn-ghost btn-xs gap-1.5 font-bold">
			← กลับไปหน้าแหล่งทรัพยากร
		</a>
		<a href="/puzzles/logicpuzzle" class="btn btn-ghost btn-xs gap-1.5 font-bold text-purple-400">
			<span>เข้าสู่คลังโจทย์ Logic Puzzles →</span>
		</a>
	</div>

	<!-- Header -->
	<header class="text-center max-w-2xl mx-auto space-y-3">
		<div class="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 mx-auto">
			<PlayCircleIcon size="32" />
		</div>
		<h1 class="text-3xl lg:text-4xl font-black tracking-tight text-base-content">
			21 ปริศนา Logic Puzzle Tutorials 🎥
		</h1>
		<p class="text-base-content/70 text-sm lg:text-base leading-relaxed">
			คลิปวิดีโอสอนเทคนิคและวิธีแก้ลอจิกพัซเซิลสไตล์ญี่ปุ่นครบทั้ง 21 ประเภท โดย Codebreaker Thailand
		</p>
	</header>

	<!-- Main Playlist Banner Card -->
	<div class="bg-gradient-to-r from-amber-950/40 via-base-200 to-base-200 border border-amber-500/30 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
		<div class="space-y-2 text-center md:text-left">
			<span class="badge badge-warning font-bold text-xs">YouTube Playlist</span>
			<h2 class="text-xl font-bold text-base-content">Codebreaker Thailand - 21 Logic Puzzle Tutorials</h2>
			<p class="text-xs text-base-content/70">เข้าชมเพลย์ลิสต์ฉบับเต็มบน YouTube เพื่อรับชมวิดีโอสอนทั้งหมดทั้ง 21 ประเภท</p>
		</div>
		<a
			href={playlistUrl}
			target="_blank"
			rel="noopener"
			class="btn btn-warning gap-2 shrink-0 font-bold shadow-lg hover:scale-105 transition-transform"
		>
			<ExternalLinkIcon size="18" />
			<span>เปิดดูบน YouTube</span>
		</a>
	</div>

	<!-- 21 Logic Puzzle Cards Grid -->
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
		{#each puzzleCards as card}
			<a
				href={card.url}
				target="_blank"
				rel="noopener"
				class="card bg-base-200/80 hover:bg-base-200 border border-base-300 hover:border-amber-400/60 transition-all duration-300 hover:-translate-y-1 shadow-lg overflow-hidden group flex flex-col"
			>
				<div class="relative aspect-video w-full overflow-hidden bg-base-100 text-base-content">
					<img
						src={card.thumbnail}
						alt={card.name}
						class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
						loading="lazy"
					/>
					<div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
						<div class="w-10 h-10 rounded-full bg-red-600/90 text-base-content flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
							▶
						</div>
					</div>
				</div>
				<div class="p-3.5 flex flex-col justify-between flex-1 space-y-2">
					<h3 class="font-bold text-sm text-base-content group-hover:text-amber-400 transition-colors line-clamp-2">
						{card.name}
					</h3>
					<p class="text-xs text-base-content/70 line-clamp-1">
						{card.title}
					</p>
					<div class="pt-1 text-xs font-semibold text-amber-400 flex items-center justify-between">
						<span>ดูวิดีโอสอน</span>
						<ExternalLinkIcon size="14" />
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>
