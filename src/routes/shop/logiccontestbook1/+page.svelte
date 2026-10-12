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
		title: 'Logic Puzzle Contest 1 Book',
		price: 150,
		shipping: 30,
		shippingExtra: 10,
		refParam: 'order_logiccontestbook1',
		imgUrl:
			'https://raw.githubusercontent.com/lemononmars/codebreaker/main/src/lib/images/product/logic_puzzle_contest_book_cover.jpg'
	};

	const t = {
		th: {
			backToShop: 'กลับไปหน้าร้านค้า (Shop)',
			inStock: 'สินค้าพร้อมส่ง',
			englishBadgeShort: 'ภาษาอังกฤษล้วน',
			englishBadgeFull: 'เนื้อหาภาษาอังกฤษล้วน (All in English)',
			englishNotice:
				'โจทย์และคำอธิบายภายในเล่มทั้งหมดเป็นภาษาอังกฤษ (All English Content) ตามมาตรฐานการแข่งขันสากล',
			subtitlePrefix: 'รวบรวมโจทย์จากการแข่งขัน',
			priceLabel: 'ราคาสินค้า',
			shippingLabel: 'ค่าจัดส่ง',
			shippingExtraLabel: '(+฿10/เล่มถัดไป)',
			totalLabel: 'ยอดรวมเริ่มต้น (1 เล่มพร้อมส่ง)',
			orderBtn: 'สั่งซื้อผ่าน Facebook Inbox',
			errataQuestion: 'มีข้อสงสัยหรือต้องการตรวจคำตอบ?',
			errataSubtitle: 'ตรวจสอบจุดแก้ไขและข้อผิดพลาดล่าสุดได้ตลอด 24 ชม.',
			errataBtn: 'Book Errata',
			contentTitle: 'เนื้อหาภายในเล่ม (85 ปริศนา)',
			contentSubtitle:
				'รวบรวมโจทย์การแข่งขันทั้งหมดจากงาน Code Breaker Logic Puzzle Contest พร้อมโจทย์พิเศษเพิ่มเติมอีกกว่า 40 ข้อ เหมาะสำหรับผู้ที่ชื่นชอบ Logic Puzzle ระดับมาตรฐานสากล',
			logicSectionTitle: '1. Logic Puzzles (รวม 68 ข้อ)',
			varietySectionTitle: '2. Variety Puzzles (รวม 17 ข้อ)',
			noteTitle: 'หมายเหตุเรื่องภาษาในเล่ม:',
			noteBody:
				'หนังสือเล่มนี้พิมพ์และนำเสนอเนื้อหา, กติกา, โจทย์ และเฉลยเป็นภาษาอังกฤษล้วน (Entirely in English) ตามแบบฉบับโจทย์แข่งระดับสากล ไม่จำเป็นต้องมีความรู้ภาษาอังกฤษระดับสูงก็เข้าใจและสนุกกับการแก้ปริศนาได้อย่างเต็มที่'
		},
		en: {
			backToShop: 'Back to Shop',
			inStock: 'In Stock',
			englishBadgeShort: 'All English Content',
			englishBadgeFull: 'Content is entirely in English',
			englishNotice:
				'All puzzles, instructions, and solutions in this book are written entirely in English.',
			subtitlePrefix: 'Official puzzle compilation from',
			priceLabel: 'Price',
			shippingLabel: 'Domestic Shipping',
			shippingExtraLabel: '(+฿10/additional copy)',
			totalLabel: 'Total starting from (1 copy incl. shipping)',
			orderBtn: 'Order via Facebook Inbox',
			errataQuestion: 'Questions or errata inquiries?',
			errataSubtitle: 'Check the official book errata and recent updates 24/7.',
			errataBtn: 'Book Errata',
			contentTitle: 'Book Contents (85 Puzzles)',
			contentSubtitle:
				'A complete collection of puzzles from the official Code Breaker Logic Puzzle Contest plus 40 bonus puzzles, totaling 85 international-standard logic puzzles.',
			logicSectionTitle: '1. Logic Puzzles (68 puzzles total)',
			varietySectionTitle: '2. Variety Puzzles (17 puzzles total)',
			noteTitle: 'Language Note:',
			noteBody:
				'This book is printed entirely in English. Puzzle rules and diagrams follow international competition standards, making them accessible to puzzle enthusiasts around the world.'
		}
	};

	const logicTypes = [
		'Choco Banana (27)',
		'Midloop (6)',
		'Territory (5)',
		'Ice Walk (4)',
		'Cave (3)',
		'Double Choco (3)',
		'Fillomino (3)',
		'Masyu (3)',
		'Ripple Effect (3)',
		'Star Battle (3)',
		'Statue Park (3)',
		'Akari (2)',
		'Battleship (2)',
		'Kakuro (2)',
		'Nurikabe (2)',
		'Pentominous (3)',
		'Shikaku (2)',
		'Slitherlink (2)',
		'Sudoku (2)',
		'Sudoku Interconnected (1)',
		'Yajilin (2)'
	];

	$: varietyTypes =
		currentLang === 'en'
			? [
					{
						name: 'Sequence',
						desc: 'Find the next character or number in the sequence',
						count: '5 puzzles'
					},
					{
						name: 'Matchsticks',
						desc: 'Move matchsticks to create valid equations',
						count: '5 puzzles'
					},
					{ name: 'Blanks', desc: 'Fill in missing letters and symbols', count: '5 puzzles' },
					{
						name: 'Instructionless',
						desc: 'Discover the hidden rules and solve the puzzle',
						count: '5 puzzles'
					},
					{
						name: 'Meta Puzzle',
						desc: 'Combine answers from previous rounds to solve the finale',
						count: '1 puzzle'
					}
			  ]
			: [
					{ name: 'Sequence', desc: 'หาอักษรตัวถัดไปในลำดับ', count: '5 ข้อ' },
					{ name: 'Matchsticks', desc: 'ขยับไม้ขีดไฟสร้างสมการ', count: '5 ข้อ' },
					{ name: 'Blanks', desc: 'เติมตัวอักษรในช่องว่าง', count: '5 ข้อ' },
					{ name: 'Instructionless', desc: 'หาวิธีกฎกติกาและแก้ปริศนาด้วยตัวเอง', count: '5 ข้อ' },
					{ name: 'Meta Puzzle', desc: 'ใช้คำตอบจากข้ออื่นมารวมไขปริศนาสุดท้าย', count: '1 ข้อ' }
			  ];
</script>

<svelte:head>
	<title>Code Breaker | Logic Puzzle Contest 1 Book</title>
</svelte:head>

<Head
	title="Logic Puzzle Contest 1 Book"
	description="85 puzzles from Code Breaker Logic Puzzle Contest, with bonus puzzles and solutions. English content."
	url="codebreakerth.vercel.app/shop/logiccontestbook1"
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
			<span class="text-base-content/70 font-medium">Logic Puzzle Contest 1 Book</span>
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
				class="relative overflow-hidden rounded-2xl bg-base-100 text-base-content border border-base-300 shadow-2xl p-2 sm:p-4"
			>
				<BookPreviewGallery
					bookTitle={product.title}
					language={currentLang}
					pages={[
						{ src: product.imgUrl, cover: true },
						{ src: '/images/product/logic_contest_book1_page-8.jpg', page: 8 },
						{ src: '/images/product/logic_contest_book1_page-25.jpg', page: 25 },
						{ src: '/images/product/logic_contest_book1_page-35.jpg', page: 35 }
					]}
				/>
				<div class="flex flex-wrap items-center gap-2 mt-3">
					<span
						class="badge badge-accent text-accent-content font-bold text-xs h-auto px-3 py-1 leading-4"
					>
						85+ {currentLang === 'en' ? 'Puzzles' : 'ปริศนา'}
					</span>
					<span
						class="badge badge-info text-info-content font-bold text-xs h-auto px-3 py-1 leading-4 max-w-full whitespace-normal shadow-sm"
					>
						{t[currentLang].englishBadgeShort}
					</span>
					<span
						class="badge badge-outline bg-base-100 text-base-content text-base-content/70 text-xs h-auto px-3 py-1 leading-4"
					>
						{currentLang === 'en' ? 'A5 Book' : 'หนังสือขนาด A5'}
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
					href="/shop/logiccontestbook1/errata"
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
				class="p-6 sm:p-7 rounded-2xl bg-base-100 text-base-content border border-base-300 shadow-2xl text-left space-y-5"
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

	<div class="p-6 sm:p-8 rounded-2xl bg-base-100 text-base-content border border-base-300 text-left space-y-6">
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
