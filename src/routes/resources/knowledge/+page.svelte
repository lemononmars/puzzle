<script lang="ts">
	import { onMount } from 'svelte';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
import HashIcon from '@lucide/svelte/icons/hash';
import ChevronUpIcon from '@lucide/svelte/icons/chevron-up';

	let showScrollTop = false;

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	onMount(() => {
		const handleScroll = () => {
			showScrollTop = window.scrollY > 250;
		};
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	const categories = [
		{
			id: 'days-colors',
			title: '🗓️ วันในสัปดาห์ & สีประจำวัน (Days of the Week & Daily Colors)',
			shortTitle: '🗓️ วันในสัปดาห์ & สี',
			badges: [
				'อาทิตย์ (Sunday) • สีแดง (Red)',
				'จันทร์ (Monday) • สีเหลือง (Yellow)',
				'อังคาร (Tuesday) • สีชมพู (Pink)',
				'พุธ (Wednesday) • สีเขียว (Green)',
				'พฤหัสบดี (Thursday) • สีแสด/ส้ม (Orange)',
				'ศุกร์ (Friday) • สีฟ้า (Blue)',
				'เสาร์ (Saturday) • สีม่วง (Purple)'
			]
		},
		{
			id: 'balisanskrit-numerals',
			title: '🔢 ตัวเลขบาลี-สันสกฤต (Bali-Sanskrit Numerals)',
			shortTitle: '🔢 ตัวเลขบาลี-สันสกฤต',
			badges: [
				'1 = เอก (Eka)',
				'2 = ทวิ / โท (Dwi)',
				'3 = ตรี (Tri)',
				'4 = จตุ (Chatu)',
				'5 = ปัญจ (Pancha)',
				'6 = ฉ / สัฑ (Cha)',
				'7 = สัปต / สัตต (Sapta)',
				'8 = อัษฎ / อัฏฐ (Ashta)',
				'9 = นพ (Nawa)',
				'10 = ทศ (Dasa)'
			]
		},
		{
			id: 'compass-directions',
			title: '🧭 ทิศทั้ง 8 & ชื่อทิศภาษาไทย (8 Compass Directions & Thai Directional Names)',
			shortTitle: '🧭 ทิศทั้ง 8 (อุดร, อีสาน...)',
			badges: [
				'อุดร (เหนือ - North / N)',
				'อีสาน (ตะวันออกเฉียงเหนือ - North-East / NE)',
				'บูรพา (ตะวันออก - East / E)',
				'อาคเนย์ (ตะวันออกเฉียงใต้ - South-East / SE)',
				'ทักษิณ (ใต้ - South / S)',
				'หรดี (ตะวันตกเฉียงใต้ - South-West / SW)',
				'ประจิม (ตะวันตก - West / W)',
				'พายัพ (ตะวันตกเฉียงเหนือ - North-West / NW)'
			]
		},
		{
			id: 'zodiac-signs',
			title: '♈ 12 จักรราศี (12 Zodiac Signs & Symbols)',
			shortTitle: '♈ 12 จักรราศี',
			badges: [
				'1. เมษ (Aries) ♈',
				'2. พฤษภ (Taurus) ♉',
				'3. เมถุน (Gemini) ♊',
				'4. กรกฎ (Cancer) ♋',
				'5. สิงห์ (Leo) ♌',
				'6. กันย์ (Virgo) ♍',
				'7. ตุลย์ (Libra) ♎',
				'8. พิจิก (Scorpio) ♏',
				'9. ธนู (Sagittarius) ♐',
				'10. มังกร (Capricorn) ♑',
				'11. กุมภ์ (Aquarius) ♒',
				'12. มีน (Pisces) ♓'
			]
		},
		{
			id: 'solar-system',
			title: '🪐 ระบบสุริยะ (Solar System Planets Order)',
			shortTitle: '🪐 ระบบสุริยะ',
			badges: [
				'1. พุธ (Mercury)',
				'2. ศุกร์ (Venus)',
				'3. โลก (Earth)',
				'4. อังคาร (Mars)',
				'5. พฤหัสบดี (Jupiter)',
				'6. เสาร์ (Saturn)',
				'7. ยูเรนัส (Uranus)',
				'8. เนปจูน (Neptune)'
			]
		},
		{
			id: 'rainbow-colors',
			title: '🌈 ลำดับสีรุ้ง (7 Rainbow Colors - ROYGBIV)',
			shortTitle: '🌈 ลำดับสีรุ้ง',
			badges: [
				'1. ม่วง (Violet)',
				'2. คราม (Indigo)',
				'3. น้ำเงิน (Blue)',
				'4. เขียว (Green)',
				'5. เหลือง (Yellow)',
				'6. แสด / ส้ม (Orange)',
				'7. แดง (Red)'
			]
		},
		{
			id: 'playing-cards',
			title: '🃏 สัญลักษณ์ไพ่ป๊อก (Playing Card Suits)',
			shortTitle: '🃏 สัญลักษณ์ไพ่ป๊อก',
			badges: [
				'♠ โพดำ (Spades - Black)',
				'♥ โพแดง (Hearts - Red)',
				'♦ ข้าวหลามตัด (Diamonds - Red)',
				'♣ ดอกจิก (Clubs - Black)'
			]
		},
		{
			id: 'music-notes',
			title: '🎵 ตัวโน้ตดนตรี & Solfège (Musical Notes)',
			shortTitle: '🎵 โน้ตดนตรี',
			badges: [
				'C = โด (Do)',
				'D = เร (Re)',
				'E = มี (Mi)',
				'F = ฟา (Fa)',
				'G = ซอล (Sol)',
				'A = ลา (La)',
				'B / H = ที (Ti)'
			]
		},
		{
			id: 'zodiac-animals',
			title: '🐀 12 นักษัตร & สัตว์ประจำปี (12 Zodiac Animals)',
			shortTitle: '🐀 12 นักษัตร',
			badges: [
				'1. ชวด (Rat / หนู)',
				'2. ฉลู (Ox / วัว)',
				'3. ขาล (Tiger / เสือ)',
				'4. เถาะ (Rabbit / กระต่าย)',
				'5. มะโรง (Dragon / มังกร-งูใหญ่)',
				'6. มะเส็ง (Snake / งูเล็ก)',
				'7. มะเมีย (Horse / ม้า)',
				'8. มะแม (Goat / แพะ)',
				'9. วอก (Monkey / ลิง)',
				'10. ระกา (Rooster / ไก่)',
				'11. จอ (Dog / หมา-สุนัข)',
				'12. กุน (Pig / หมู)'
			]
		}
	];

	function scrollToSection(id: string) {
		const el = document.getElementById(id);
		if (el) {
			const yOffset = -80; // Offset for top header navbar
			const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
			window.scrollTo({ top: y, behavior: 'smooth' });
		}
	}
</script>

<svelte:head>
	<title>Chi Fun | Puzzle Knowledge & Reference Data 📚</title>
	<meta
		name="description"
		content="คลังข้อมูลอ้างอิงและสัญลักษณ์พื้นฐานภาษาไทย-อังกฤษ สำหรับแก้พัซเซิลและรหัสลับ"
	/>
</svelte:head>

<div class="flex flex-col gap-8 w-full max-w-5xl mx-auto px-4 py-8 select-none">
	<!-- Navigation -->
	<div class="flex items-center justify-between">
		<a href="/resources" class="btn btn-ghost btn-xs gap-1.5 font-bold text-base-content/70 hover:text-base-content">
			<ArrowLeftIcon size={14} />
			<span>กลับไปหน้าแหล่งทรัพยากร</span>
		</a>
	</div>

	<!-- Header -->
	<header class="text-center max-w-2xl mx-auto space-y-3">
		<div class="w-14 h-14 rounded-2xl bg-emerald-500/10 text-primary flex items-center justify-center border border-primary/30 mx-auto shadow-lg shadow-emerald-500/5">
			<BookOpenIcon size={32} />
		</div>
		<h1 class="text-3xl lg:text-4xl font-black tracking-tight text-base-content">
			Puzzle Knowledge & References 📚
		</h1>
		<p class="text-base-content/70 text-sm lg:text-base leading-relaxed">
			คลังข้อมูลอ้างอิงและสัญลักษณ์พื้นฐานภาษาไทย-อังกฤษที่มักพบบ่อยในพัซเซิลและรหัสลับ
		</p>
	</header>

	<!-- Quick Navigation Category Badges Bar at Page Top -->
	<div class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
		<div class="flex items-center gap-2 text-xs font-bold text-base-content/70 uppercase tracking-wider">
			<HashIcon size={14} class="text-primary" />
			<span>หมวดหมู่ข้อมูล (Quick Jump):</span>
		</div>
		<div class="flex flex-wrap gap-2">
			{#each categories as cat}
				<button
					on:click={() => scrollToSection(cat.id)}
					class="btn btn-xs rounded-xl bg-base-100 text-base-content border border-base-300 text-base-content/70 hover:bg-emerald-500/20 hover:text-primary hover:border-primary/30 font-semibold transition-all"
				>
					{cat.shortTitle || cat.title}
				</button>
			{/each}
		</div>
	</div>

	<!-- Compact Badge Grid per Category -->
	<div class="space-y-6">
		{#each categories as cat (cat.id)}
			<section id={cat.id} class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-3xl p-5 shadow-xl space-y-3 scroll-mt-24">
				<h2 class="text-base font-bold text-primary border-b border-base-300 pb-2 flex items-center gap-2">
					<span>{cat.title}</span>
				</h2>
				<div class="flex flex-wrap gap-2 pt-1">
					{#each cat.badges as badge}
						<span class="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-base-100 text-base-content border border-base-300 text-sm font-normal text-base-content/70 hover:border-primary/30 hover:text-primary transition-all">
							{badge}
						</span>
					{/each}
				</div>
			</section>
		{/each}
	</div>
</div>

<!-- Floating Scroll to Top Button -->
{#if showScrollTop}
	<button
		on:click={scrollToTop}
		class="fixed bottom-6 right-6 z-50 btn btn-circle bg-emerald-500 hover:bg-emerald-400 text-base-content/70 border-none shadow-2xl transition-all duration-300"
		title="Scroll to Top"
	>
		<ChevronUpIcon size={22} />
	</button>
{/if}
