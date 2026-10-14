<script lang="ts">
	import Head from '#lib/components/Head.svelte';
	import BookPreviewGallery from '#lib/components/BookPreviewGallery.svelte';
	import {
		MessageSquareIcon,
		MailIcon,
		ExternalLinkIcon,
		ChevronLeftIcon,
		PackageIcon,
		BookOpenIcon,
		AlertCircleIcon
	} from 'svelte-feather-icons';

	type Language = 'th' | 'en';
	let currentLang: Language = 'en';

	const product = {
		title: 'Logic Puzzle Contest 2 Book',
		price: 150,
		shipping: 30,
		shippingExtra: 10,
		refParam: 'order_logiccontestbook2',
		imgUrl: '/images/product/logic_puzzle_contest_book2_cover.jpg'
	};

	const t = {
		th: {
			backToShop: 'กลับไปหน้าร้านค้า (Shop)',
			inStock: 'สินค้าพร้อมส่ง',
			englishBadgeShort: 'คำอธิบายภาษาอังกฤษ',
			englishBadgeFull: 'คำอธิบายภาษาอังกฤษ • มีปริศนาคำภาษาไทย',
			englishNotice: 'กติกาและคำอธิบายเป็นภาษาอังกฤษ โดยรอบ Warped Words ใช้คำภาษาไทย',
			subtitlePrefix: 'รวบรวมโจทย์จากการแข่งขัน',
			priceLabel: 'ราคาสินค้า',
			shippingLabel: 'ค่าจัดส่ง',
			shippingExtraLabel: '(+฿10/เล่มถัดไป)',
			totalLabel: 'ยอดรวมเริ่มต้น (1 เล่มพร้อมส่ง)',
			orderBtn: 'สั่งซื้อผ่าน Facebook Inbox',
			errataQuestion: 'มีข้อสงสัยหรือต้องการตรวจคำตอบ?',
			errataSubtitle: 'ตรวจสอบจุดแก้ไขและข้อผิดพลาดล่าสุดได้ตลอด 24 ชม.',
			errataBtn: 'Book Errata',
			contentTitle: 'เนื้อหาภายในเล่ม (137 ปริศนา)',
			contentSubtitle:
				'รวม 137 ปริศนาใน 48 ประเภท: โจทย์จาก Logic Puzzle Contest II จำนวน 46 ข้อ, Choco Banana Bus 27 ข้อ และ Logic Showcase 64 ข้อ พร้อมเฉลย',
			logicSectionTitle: 'ประเภทปริศนา (48 ประเภท)',
			varietySectionTitle: 'เนื้อหา 6 ส่วน',
			noteTitle: 'หมายเหตุเรื่องภาษาในเล่ม:',
			noteBody:
				'หนังสือขนาด A4 พร้อมกติกาและคำอธิบายภาษาอังกฤษ รอบ Warped Words ประกอบด้วย Word Search, Fill-in, Scrabble และ Cryptic Crossword ที่ใช้คำภาษาไทย'
		},
		en: {
			backToShop: 'Back to Shop',
			inStock: 'In Stock',
			englishBadgeShort: 'English Instructions',
			englishBadgeFull: 'English instructions • Thai word puzzles included',
			englishNotice:
				'Instructions and explanations are in English. The Warped Words round uses Thai words.',
			subtitlePrefix: 'Official puzzle compilation from',
			priceLabel: 'Price',
			shippingLabel: 'Domestic Shipping',
			shippingExtraLabel: '(+฿10/additional copy)',
			totalLabel: 'Total starting from (1 copy incl. shipping)',
			orderBtn: 'Order via Facebook Inbox',
			errataQuestion: 'Questions or errata inquiries?',
			errataSubtitle: 'Check the official book errata and recent updates 24/7.',
			errataBtn: 'Book Errata',
			contentTitle: 'Book Contents (137 Puzzles)',
			contentSubtitle:
				'137 puzzles across 48 genres: 46 puzzles from Logic Puzzle Contest II, 27 new Choco Banana puzzles, and 64 Logic Showcase puzzles, with solutions.',
			logicSectionTitle: 'Puzzle Genres (48 genres)',
			varietySectionTitle: 'Six Sections to Explore',
			noteTitle: 'Language Note:',
			noteBody:
				'An A4 book with English instructions and explanations. Warped Words includes Thai Word Search, Fill-in, Scrabble, and Cryptic Crossword puzzles.'
		}
	};

	const logicTypes = [
		'Yajilin',
		'Heyawake',
		'LITS',
		'Masyu',
		'Akari',
		'Shakashaka',
		'Nonogram',
		'Snake',
		'Nurikabe',
		'Choco Banana',
		'Aqre',
		'Slitherlink',
		'Pipelink',
		'Cave',
		'Tapa',
		'Fillomino',
		'Spiral Galaxies',
		'Pentominous',
		'Word Search',
		'Fill-in',
		'Scrabble',
		'Cryptic Crossword',
		'Canal View',
		'Kurodoko',
		'Voxas',
		'Mid-L',
		'Skyscrapers',
		'Foreshadow Crossing',
		'Guide Exit',
		'Ice Walk',
		'Kurotto',
		'Tapa-like Loop',
		'Disorderly Loop',
		'Ripple Effect',
		'Statue Park',
		'Territory',
		'Balance Loop',
		'Contact',
		'Rampage',
		'Turnaround',
		'Kissing Polyomino',
		'Mirror Loop',
		'Evolmino',
		'Hasu no Mura',
		'Pattern Square',
		'Ring-Ring',
		'Alphabet Asp',
		'Pencils'
	];

	$: varietyTypes =
		currentLang === 'en'
			? [
					{
						name: 'Popular Picks',
						desc: 'Yajilin, Heyawake, LITS, Masyu, Akari, and Shakashaka.',
						count: 'Round 1'
					},
					{
						name: 'Shading Showcase',
						desc: 'Shade cells in Nonogram, Snake, Nurikabe, Choco Banana, and Aqre.',
						count: 'Round 2'
					},
					{
						name: 'Penta Party',
						desc: 'Interconnected logic puzzles with pentominoes and a metapuzzle.',
						count: 'Round 3'
					},
					{
						name: 'Warped Words',
						desc: 'Thai Word Search, Fill-in, Scrabble, and Cryptic Crossword with a twist.',
						count: 'Round 4'
					},
					{
						name: 'Choco Banana Bus',
						desc: 'A fresh collection of standard Choco Banana puzzles.',
						count: '27 puzzles'
					},
					{
						name: 'Logic Showcase',
						desc: 'Creative variants and new genres from 27 Puzzlers Club showcases.',
						count: '64 puzzles'
					}
			  ]
			: [
					{
						name: 'Popular Picks',
						desc: 'Yajilin, Heyawake, LITS, Masyu, Akari และ Shakashaka',
						count: 'รอบ 1'
					},
					{
						name: 'Shading Showcase',
						desc: 'ระบายช่องใน Nonogram, Snake, Nurikabe, Choco Banana และ Aqre',
						count: 'รอบ 2'
					},
					{
						name: 'Penta Party',
						desc: 'ปริศนาตรรกะเชื่อมต่อกันด้วยเพนโตมิโน พร้อมเมตาปริศนา',
						count: 'รอบ 3'
					},
					{
						name: 'Warped Words',
						desc: 'Word Search, Fill-in, Scrabble และ Cryptic Crossword คำภาษาไทยในรูปแบบใหม่',
						count: 'รอบ 4'
					},
					{
						name: 'Choco Banana Bus',
						desc: 'ชุดปริศนา Choco Banana มาตรฐานชุดใหม่',
						count: '27 ข้อ'
					},
					{
						name: 'Logic Showcase',
						desc: 'ปริศนารูปแบบใหม่และกติกาประยุกต์จาก 27 Showcase ใน Puzzlers Club',
						count: '64 ข้อ'
					}
			  ];
</script>

<svelte:head>
	<title>Code Breaker | Logic Puzzle Contest 2 Book</title>
</svelte:head>

<Head
	title="Logic Puzzle Contest 2 Book"
	description="137 puzzles across 48 genres from Logic Puzzle Contest II, Choco Banana Bus, and Logic Showcase. English instructions; Thai word puzzles included."
	url="codebreakerth.vercel.app/shop/logiccontestbook2"
	imageUrl={product.imgUrl}
/>

<div class="container mx-auto px-4 pt-4 sm:pt-8 pb-24 max-w-5xl">
	<!-- Top Navigation & Language Switcher Bar -->
	<div class="flex items-center justify-between flex-wrap gap-4 mb-6">
		<!-- Breadcrumbs -->
		<nav class="flex items-center gap-2 text-xs sm:text-sm text-base-content/70">
			<a href="/shop" class="flex items-center gap-1 hover:text-primary transition-colors">
				<ChevronLeftIcon size="14" />
				<span>{t[currentLang].backToShop}</span>
			</a>
			<span>/</span>
			<span class="text-base-content/70 font-medium">Logic Puzzle Contest 2 Book</span>
		</nav>

		<!-- Language Switcher -->
		<div
			class="inline-flex items-center rounded-lg bg-base-100 text-base-content border border-base-300 p-1 text-xs"
		>
			<button
				type="button"
				class="px-2.5 py-1 rounded font-bold transition-colors {currentLang === 'th'
					? 'bg-teal-500 text-base-content/70 shadow'
					: 'text-base-content/70 hover:text-base-content'}"
				on:click={() => (currentLang = 'th')}
			>
				🇹🇭 ภาษาไทย
			</button>
			<button
				type="button"
				class="px-2.5 py-1 rounded font-bold transition-colors {currentLang === 'en'
					? 'bg-teal-500 text-base-content/70 shadow'
					: 'text-base-content/70 hover:text-base-content'}"
				on:click={() => (currentLang = 'en')}
			>
				🇬🇧 English
			</button>
		</div>
	</div>

	<!-- Main Product Card -->
	<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
		<!-- Left: Image & Quick Details (7 cols) -->
		<div class="lg:col-span-7 min-w-0 space-y-6">
			<div
				class="botanical-card relative overflow-hidden rounded-2xl bg-base-100 text-base-content border border-base-300 shadow-2xl p-2 sm:p-4"
			>
				<BookPreviewGallery
					bookTitle={product.title}
					language={currentLang}
					pages={[
						{ src: product.imgUrl, cover: true },
						{ src: '/images/product/logic_contest_book2_page-22.jpg', page: 22 },
						{ src: '/images/product/logic_contest_book2_page-28.jpg', page: 28 },
						{ src: '/images/product/logic_contest_book2_page-37.jpg', page: 37 },
						{ src: '/images/product/logic_contest_book2_back-cover.jpg', backCover: true }
					]}
				/>
				<div class="flex flex-wrap items-center gap-2 mt-3">
					<span
						class="badge badge-accent text-accent-content font-bold text-xs h-auto px-3 py-1 leading-4"
					>
						137 {currentLang === 'en' ? 'Puzzles' : 'ปริศนา'}
					</span>
					<span
						class="badge badge-info text-info-content font-bold text-xs h-auto px-3 py-1 leading-4 max-w-full whitespace-normal shadow-sm"
					>
						{t[currentLang].englishBadgeShort}
					</span>
					<span
						class="badge badge-outline bg-base-100 text-base-content text-base-content/70 text-xs h-auto px-3 py-1 leading-4"
					>
						{currentLang === 'en' ? 'A4 Book' : 'หนังสือขนาด A4'}
					</span>
				</div>
			</div>

			<!-- Errata Notice Banner -->
			<div
				class="p-4 rounded-xl bg-base-100 text-base-content border border-primary/30 flex items-center justify-between gap-4 text-left"
			>
				<div class="flex items-center gap-3">
					<div class="p-2 rounded-lg bg-teal-500/10 text-primary shrink-0">
						<AlertCircleIcon size="20" />
					</div>
					<div>
						<div class="text-xs font-bold text-base-content">{t[currentLang].errataQuestion}</div>
						<div class="text-[11px] text-base-content/70">{t[currentLang].errataSubtitle}</div>
					</div>
				</div>
				<a
					href="/shop/logiccontestbook2/errata"
					class="btn btn-xs btn-outline btn-accent text-accent-content shrink-0"
				>
					<span>{t[currentLang].errataBtn}</span>
					<ExternalLinkIcon size="12" class="ml-1" />
				</a>
			</div>
		</div>

		<!-- Right: Pricing, CTA & Order Guide (5 cols) -->
		<div class="lg:col-span-5 space-y-6">
			<div
				class="botanical-card p-6 sm:p-7 rounded-2xl bg-base-100 text-base-content border border-base-300 shadow-2xl text-left space-y-5"
			>
				<div>
					<div class="flex flex-wrap items-center gap-2 mb-2">
						<span class="badge badge-accent text-accent-content font-bold text-xs">
							{t[currentLang].inStock}
						</span>
						<span
							class="badge badge-info text-info-content font-bold text-xs px-3 py-1.5 h-auto max-w-full whitespace-normal leading-snug text-left shadow-sm"
						>
							{t[currentLang].englishBadgeFull}
						</span>
					</div>
					<h1 class="text-2xl sm:text-3xl font-extrabold text-base-content">
						{product.title}
					</h1>
					<p class="text-xs sm:text-sm text-base-content/70 mt-1">
						{t[currentLang].subtitlePrefix}

					<a
						href={`mailto:sakulbuth@gmail.com?subject=${encodeURIComponent(
							product.title + ' - Order'
						)}`}
						class="btn btn-outline btn-block gap-2 text-sm"
					>
						<MailIcon size="17" />
						{currentLang === 'en' ? 'Contact by Email' : 'ติดต่อทางอีเมล'}
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Content Details: Puzzle Genres & Variety Breakdown -->

	<div class="botanical-card p-6 sm:p-8 rounded-2xl bg-base-100 text-base-content border border-base-300 text-left space-y-6">
		<div>
			<h2 class="text-lg sm:text-xl font-bold text-base-content flex items-center gap-2 mb-2">
				<BookOpenIcon size="20" class="text-primary" />
				<span>{t[currentLang].contentTitle}</span>
			</h2>
			<p class="text-xs sm:text-sm text-base-content/70 leading-relaxed">
				{t[currentLang].contentSubtitle}
			</p>
		</div>

		<!-- Category 1: Logic Puzzles -->
		<div class="space-y-3">
			<h3 class="text-sm font-bold text-primary flex items-center gap-2">
				<span class="w-2 h-2 rounded-full bg-teal-400" />
				<span>{t[currentLang].logicSectionTitle}</span>
			</h3>
			<div class="flex flex-wrap gap-2">
				{#each logicTypes as type}
					<span
						class="badge badge-outline bg-base-100 text-base-content text-base-content/70 border-base-300 text-xs py-2 px-2.5"
					>
						{type}
					</span>
				{/each}
			</div>
		</div>

		<!-- Category 2: Variety Puzzles -->
		<div class="space-y-3 pt-2">
			<h3 class="text-sm font-bold text-primary flex items-center gap-2">
				<span class="w-2 h-2 rounded-full bg-emerald-400" />
				<span>{t[currentLang].varietySectionTitle}</span>
			</h3>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
				{#each varietyTypes as v}
					<div class="p-3 rounded-xl bg-base-100 text-base-content border border-base-300">
						<div class="flex items-center justify-between mb-1">
							<span class="font-bold text-xs text-base-content">{v.name}</span>
							<span class="badge badge-sm badge-ghost text-[10px]">{v.count}</span>
						</div>
						<p class="text-[11px] text-base-content/70">{v.desc}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Language Notice Box -->
		<div class="pt-4 border-t border-base-300 text-xs text-base-content/70 space-y-1">
			<p class="font-semibold text-base-content/70">{t[currentLang].noteTitle}</p>
			<p class="leading-relaxed">
				{t[currentLang].noteBody}
			</p>
		</div>
	</div>
</div>
