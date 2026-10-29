<script lang="ts">
	import BrandLogo from '#lib/components/ui/BrandLogo.svelte';
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import Surface from '#lib/components/ui/Surface.svelte';
	import LinkCard from '#lib/components/ui/LinkCard.svelte';
	import ActionLink from '#lib/components/ui/ActionLink.svelte';
	import { brand } from '#lib/brand.js';
	const doors = [
		{
			href: '/puzzles',
			title: 'เล่นให้ร้องอ๋อ',
			description:
				'เลือกควิซ ปริศนาคำ ตรรกะ ปริศนาทำมือ และเกมที่สร้างโจทย์ใหม่ได้ ลองคิดคนเดียวหรือชวนเพื่อนมาช่วยกันไข'
		},
		{
			href: '/tools',
			title: 'สร้างปริศนาของคุณ',
			description:
				'เครื่องมือสร้างเกมค้นหาคำ ครอสเวิร์ด และกิจกรรม พร้อมตัวช่วยค้นคำและเครื่องมือสำหรับจัดเกม'
		},
		{
			href: '/resources',
			title: 'เติมไอเดียและความรู้',
			description:
				'สำรวจรหัสลับ คำสะกด คลังความรู้ กลไกปริศนา และคู่มือตรรกะ เก็บไว้เป็นเบาะแสสำหรับครั้งต่อไป'
		},
		{
			href: '/portfolio',
			title: 'รู้จักคนทำและงานเบื้องหลัง',
			description:
				'ผลงานออกแบบเกม ประดิษฐ์ปริศนา บันทึกห้องหลบหนี และเว็บไซต์ของ Sakulbuth Ekvittayaniphon หรือ lemononmars'
		}
	];
</script>

<svelte:head
	><title>เกี่ยวกับ Chi Fun · ไขสนุก</title><meta
		name="description"
		content={brand.description}
	/></svelte:head
>
<div class="text-left space-y-6">
	<PageHeading
		title="Chi Fun / ไขสนุก"
		eyebrow="A LITTLE CURIOSITY, A LOT OF AHA!"
		description="พื้นที่สำหรับคนที่สนุกกับการลองคิด เชื่อมเบาะแส และค้นพบคำตอบด้วยตัวเอง"
	/>
	<Surface
		><section class="identity" aria-labelledby="name-meaning">
			<div class="symbol bg-base-200 text-base-content">
				<BrandLogo variant="stacked" />
			</div>
			<div class="space-y-4">
				<h2 id="name-meaning" class="text-xl font-bold">ชื่อที่ชวนให้ “ไข” อย่างสนุก</h2>
				<p>
					<strong>Chi Fun คือ ไขสนุก</strong> — เอาคำว่า “ไข” ในการไขปริศนา มาจับคู่กับ
					<span lang="en">Fun</span> หรือความสนุก ชื่อนี้ชวนให้มองการหาคำตอบเป็นการเล่นกับความสงสัย ลองผิดได้
					เปลี่ยนมุมมองได้ และเพลิดเพลินกับจังหวะที่อะไร ๆ เริ่มเชื่อมกัน
				</p>
				<p>
					คำว่า <span lang="en">Chi</span> ยังโยงกับอักษรกรีก <span lang="el">χ</span>
					ซึ่งเป็นต้นทางของสัญลักษณ์ <strong>Chi Key</strong> สองเส้นที่ตัดกันถูกออกแบบให้เป็นกุญแจ เหมือนการนำเบาะแสมาประกอบกันจนไขทางไปสู่คำตอบได้
				</p>
				<p class="botanical-muted">
					ไม่ต้องเก่งก่อนถึงจะเริ่มได้ แค่มีความสงสัยสักนิด แล้วลองเปิดประตูดู
				</p>
			</div>
		</section></Surface
	>
	<section aria-labelledby="offerings">
		<h2 id="offerings" class="text-xl font-bold mb-5">มีอะไรให้ลองบ้าง?</h2>
		<div class="grid gap-5 sm:grid-cols-2">
			{#each doors as door}<LinkCard {...door} />{/each}
		</div>
	</section>
	<Surface
		><section class="space-y-4" aria-labelledby="behind-site">
			<h2 id="behind-site" class="text-xl font-bold">จากความชอบปริศนา สู่พื้นที่ให้ลองเล่น</h2>
			<p>
				Chi Fun สร้างและดูแลโดย <strong>Sakulbuth Ekvittayaniphon</strong> หรือ
				<strong>lemononmars</strong> เป็นที่รวมปริศนาที่อยากชวนเล่น เครื่องมือที่อยากใช้ และเรื่องเกี่ยวกับเกมกับปริศนาที่อยากแบ่งปัน
			</p>
			<p>
				ถ้าอยากชวนกันทำปริศนาตามธีม กิจกรรมกลุ่ม บอร์ดเกม หรือเว็บไซต์ที่มีไอเดียสนุก ๆ
				ลองแวะมาคุยกันได้ ส่วนใครอยากพาปริศนาออกจากหน้าจอ ก็มีหนังสือให้เลือกในร้านด้วย
			</p>
			<div class="flex flex-wrap gap-3">
				<ActionLink href="/puzzles">เริ่มไขสนุก</ActionLink><ActionLink href="/contact" secondary
					>ติดต่อร่วมงาน</ActionLink
				><a href="/shop" class="btn btn-ghost">ร้านหนังสือปริศนา</a>
			</div>
		</section></Surface
	>
</div>

<style>
	.identity {
		display: grid;
		grid-template-columns: 200px minmax(0, 1fr);
		gap: 32px;
		align-items: center;
		line-height: 1.85;
	}
	.symbol {
		border-radius: 24px;
		padding: 16px;
	}
	@media (max-width: 640px) {
		.identity {
			grid-template-columns: 1fr;
			gap: 20px;
		}
		.symbol {
			width: 150px;
		}
	}
</style>
