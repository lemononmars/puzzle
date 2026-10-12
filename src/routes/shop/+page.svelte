<script lang="ts">
 import PageHeading from '#lib/components/ui/PageHeading.svelte';
 import Surface from '#lib/components/ui/Surface.svelte';
 import ActionLink from '#lib/components/ui/ActionLink.svelte';
 import ShopCard from '#lib/components/ShopCard.svelte';
 import { shopProductDescriptions, shopImgUrlPrefix } from '#lib/data/metadata.js';
</script>
<svelte:head><title>Puzzle · Shop</title></svelte:head>
<PageHeading eyebrow="TAKE A LITTLE CURIOSITY HOME" title="Puzzle shop" description="หนังสือปริศนาคำและตรรกะ สำหรับช่วงเวลาที่อยากพักจากหน้าจอแล้วลองคิดอะไรใหม่" />
<div class="grid md:grid-cols-3 gap-6">{#each shopProductDescriptions as p}<ShopCard url={p.url} title={p.title} description={p.description} imgUrl={p.imgUrl} imgUrlPrefix={shopImgUrlPrefix} price={p.price} shipping={p.shipping} badge={p.badge} category={p.category} />{/each}</div>
<section class="mt-10 text-left"><Surface><h2>สอบถามสินค้าและสั่งซื้อ</h2><p class="botanical-muted mb-6">ติดต่อเพื่อสอบถามหนังสือ ค่าจัดส่ง และรายละเอียดการสั่งซื้อ</p><div class="flex flex-wrap gap-4"><ActionLink href="mailto:sakulbuth@gmail.com?subject=Puzzle%20shop">ส่งอีเมล ↗</ActionLink><ActionLink href="https://m.me/codebreakerTH" secondary>Facebook Inbox ↗</ActionLink></div></Surface></section>
