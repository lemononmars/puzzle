<script lang="ts">
	import Head from '#lib/components/Head.svelte';
	import MessageSquareIcon from '@lucide/svelte/icons/message-square';
import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
import CopyIcon from '@lucide/svelte/icons/copy';
import CheckCircleIcon from '@lucide/svelte/icons/circle-check';
import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
import PackageIcon from '@lucide/svelte/icons/package';
import BookOpenIcon from '@lucide/svelte/icons/book-open';

	const product = {
		title: 'Rebus Puzzle Book',
		subtitle: 'หนังสือปริศนาอักษรแทนคำ (ภาษาไทย 100 ข้อ)',
		price: 100,
		shipping: 20,
		shippingExtra: 10,
		refParam: 'order_rebusbook',
		imgUrl: 'https://raw.githubusercontent.com/lemononmars/codebreaker/main/src/lib/images/product/rebus_book_cover.jpg',
		orderMessage: 'สวัสดีครับ สนใจสั่งซื้อ Rebus Puzzle Book จำนวน 1 เล่มครับ'
	};

	let copied = false;
	function copyOrderText() {
		if (typeof navigator !== 'undefined' && navigator.clipboard) {
			navigator.clipboard.writeText(product.orderMessage);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2500);
		}
	}
</script>

<svelte:head>
	<title>Chi Fun | Rebus Puzzle Book</title>
</svelte:head>

<Head
	title="Rebus Puzzle Book"
	description="หนังสือปริศนาอักษรแทนคำภาษาไทย 100 ข้อ พร้อมคำใบ้และเฉลยในตัว จากเพจ Code Breaker Thailand"
	url="codebreakerth.vercel.app/shop/rebusbook"
	imageUrl={product.imgUrl}
/>

<div class="container mx-auto px-4 pt-4 sm:pt-8 pb-24 max-w-5xl">
	<!-- Breadcrumbs -->
	<nav class="flex items-center gap-2 text-xs sm:text-sm text-base-content/70 mb-6">
		<a href="/shop" class="flex items-center gap-1 hover:text-primary transition-colors">
			<ChevronLeftIcon size={14} />
			<span>กลับไปหน้าร้านค้า (Shop)</span>
		</a>
		<span>/</span>
		<span class="text-base-content/70 font-medium">Rebus Puzzle Book</span>
	</nav>

	<!-- Main Product Card -->
	<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
		<!-- Left: Image Gallery & Highlights (7 cols) -->
		<div class="lg:col-span-7 space-y-6">
			<div class="botanical-card relative overflow-hidden rounded-2xl bg-base-100 text-base-content border border-base-300 shadow-2xl p-2 sm:p-4">
				<img
					src={product.imgUrl}
					alt={product.title}
					class="w-full h-auto object-contain rounded-xl max-h-[480px] mx-auto"
					on:error={(e) => {
						if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.display = 'none';
					}}
				/>
				<div class="absolute top-5 left-5 flex gap-2">
					<span class="badge badge-accent text-accent-content font-bold text-xs py-1">
						100 ข้อจุใจ
					</span>
					<span class="badge badge-outline bg-base-100 text-base-content text-base-content/70 text-xs py-1">
						เล่มพกพา A6
					</span>
				</div>
			</div>

			<!-- Product Details & Description -->
			<div class="botanical-card p-6 rounded-2xl bg-base-100 text-base-content border border-base-300 text-left space-y-4">
				<h2 class="text-lg font-bold text-base-content flex items-center gap-2">
					<BookOpenIcon size={18} class="text-primary" />
					<span>รายละเอียดสินค้า</span>
				</h2>
				<p class="text-sm text-base-content/70 leading-relaxed">
					ปริศนาอักษรแทนคำ (Rebus Puzzle) ฉบับภาษาไทย <strong>100 ข้อเต็มอิ่ม</strong> รูปแบบเดียวกับปริศนายอดนิยมบนเพจ Code Breaker Thailand จัดทำในรูปแบบหนังสือขนาด A6 พกพาสะดวก เปิดเล่นหน้าละ 1 ข้อ พร้อมคำใบ้และเฉลยในตัว สนุกได้ทั้งไขปริศนาคนเดียวหรือทายเล่นกับเพื่อนและครอบครัว
				</p>

				<!-- Specifications Grid -->
				<div class="grid grid-cols-2 gap-3 pt-2 text-xs">
					<div class="p-3 rounded-xl bg-base-100 text-base-content border border-base-300">
						<span class="text-base-content/70 block mb-1">จำนวนปริศนา</span>
						<span class="text-base-content font-semibold">100 ข้อ (หน้าละ 1 ข้อ)</span>
					</div>
					<div class="p-3 rounded-xl bg-base-100 text-base-content border border-base-300">
						<span class="text-base-content/70 block mb-1">รูปแบบรูปเล่ม</span>
						<span class="text-base-content font-semibold">หนังสือพกพา ขนาด A6</span>
					</div>
					<div class="p-3 rounded-xl bg-base-100 text-base-content border border-base-300">
						<span class="text-base-content/70 block mb-1">ระดับความยาก</span>
						<span class="text-base-content font-semibold">⭐⭐☆☆☆ (เล่นสนุก ทุกวัย)</span>
					</div>
					<div class="p-3 rounded-xl bg-base-100 text-base-content border border-base-300">
						<span class="text-base-content/70 block mb-1">คำใบ้ & เฉลย</span>
						<span class="text-base-content font-semibold">มีคำใบ้และเฉลยในเล่ม</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Right: Pricing, CTA & Order Guide (5 cols) -->
		<div class="lg:col-span-5 space-y-6">
			<!-- Purchase Panel Card -->
			<div class="botanical-card p-6 sm:p-7 rounded-2xl bg-base-100 text-base-content border border-base-300 shadow-2xl text-left space-y-5">
				<div>
					<div class="flex items-center gap-2 mb-2">
						<span class="badge badge-accent text-accent-content font-bold text-xs">In Stock</span>
						<span class="text-xs text-base-content/70">สินค้าพร้อมส่ง</span>
					</div>
					<h1 class="text-2xl sm:text-3xl font-extrabold text-base-content">
						{product.title}
					</h1>
					<p class="text-xs sm:text-sm text-base-content/70 mt-1">
						{product.subtitle}
					</p>
				</div>

				<!-- Price Box -->
				<div class="p-4 rounded-xl bg-base-100 text-base-content border border-base-300 space-y-2">
					<div class="flex items-baseline justify-between">
						<span class="text-sm text-base-content/70">ราคาสินค้า</span>
						<span class="text-2xl font-extrabold text-primary">฿{product.price}</span>
					</div>
					<div class="flex items-center justify-between text-xs text-base-content/70 pt-1 border-t border-base-300">
						<span>ค่าจัดส่ง</span>
						<span class="text-base-content/70">฿{product.shipping} <span class="text-[11px] text-base-content/70">(+฿{product.shippingExtra}/เล่มถัดไป)</span></span>
					</div>
					<div class="flex items-center justify-between text-xs font-semibold text-primary pt-1">
						<span>ยอดรวมเริ่มต้น (1 เล่มพร้อมส่ง)</span>
						<span class="text-sm">฿{product.price + product.shipping}</span>
					</div>
				</div>

				<!-- Primary Messenger CTA Button -->
				<div class="space-y-3">
					<a
						href="https://m.me/codebreakerTH?ref={product.refParam}"
						target="_blank"
						rel="noreferrer"
						class="btn btn-primary text-primary-content btn-block gap-2 font-semibold text-sm shadow-xl shadow-teal-500/20 hover:scale-[1.01] transition-transform"
					>
						<MessageSquareIcon size={17} />
						<span>สั่งซื้อผ่าน Facebook Inbox</span>
						<ExternalLinkIcon size={14} />
					</a>

					<!-- Fast-Track Message Copier -->
					<div class="p-3 rounded-xl bg-base-100 text-base-content border border-base-300 space-y-2">
						<div class="flex items-center justify-between text-xs">
							<span class="text-base-content/70 font-medium">ข้อความสั่งซื้อด่วน (กดคัดลอกได้ทันที):</span>
							{#if copied}
								<span class="text-primary font-bold flex items-center gap-1 text-[11px]">
									<CheckCircleIcon size={13} />
									<span>คัดลอกแล้ว!</span>
								</span>
							{/if}
						</div>
						<div class="flex items-center gap-2">
							<input
								type="text"
								readonly
								value={product.orderMessage}
								class="input input-sm  bg-base-100 text-base-content border-base-300 text-base-content/70 text-xs w-full focus:outline-none"
							/>
							<button
								type="button"
								on:click={copyOrderText}
								class="btn btn-sm btn-outline btn-accent text-accent-content shrink-0 gap-1 text-xs"
								title="กดเพื่อคัดลอกข้อความ"
							>
								<CopyIcon size={13} />
								<span>คัดลอก</span>
							</button>
						</div>
					</div>
				</div>

				<!-- 3-Step Buying Guide -->
				<div class="pt-4 border-t border-base-300 space-y-3">
					<h3 class="text-xs font-bold uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
						<PackageIcon size={14} class="text-primary" />
						<span>ขั้นตอนการสั่งซื้อ</span>
					</h3>
					<div class="space-y-2 text-xs text-base-content/70">
						<div class="flex items-start gap-2.5">
							<span class="w-5 h-5 rounded-full bg-teal-500/20 text-primary flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
							<span>กดปุ่มทัก Inbox ด้านบน พร้อมส่งข้อความสั่งซื้อ</span>
						</div>
						<div class="flex items-start gap-2.5">
							<span class="w-5 h-5 rounded-full bg-teal-500/20 text-primary flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
							<span>แอดมินแจ้งสรุปยอดรวมและบัญชีโอนเงิน โอนแล้วส่งสลิป</span>
						</div>
						<div class="flex items-start gap-2.5">
							<span class="w-5 h-5 rounded-full bg-teal-500/20 text-primary flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">3</span>
							<span>แจ้งชื่อที่อยู่จัดส่ง รอรับหมายเลขพัสดุ (Tracking No.)</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
