<script lang="ts">
 import {brand} from "#lib/brand.js";
</script>
<footer class="footer-shell text-base-content">
 <div><a href="/" class="font-semibold text-xl">{brand.title}</a><p class="botanical-muted">ความสนุก เริ่มจากความสงสัย</p></div>
 <nav aria-label="Footer"><a href="/about">เกี่ยวกับ Chi Fun</a><a href="/puzzles">เล่นปริศนา</a><a href="/tools">สร้างปริศนา</a><a href="/shop">ร้านค้า</a><a href="/portfolio">ผลงาน</a><a href="/contact">ติดต่อร่วมงาน</a></nav>
</footer>
<style>.footer-shell { max-width: 1132px; margin: 40px auto 0; border-top: 1px solid var(--color-base-300); padding: 28px 24px 40px; display: flex; justify-content: space-between; gap: 28px; text-align: left; } p { font-size: 12px; margin-top: 8px; } nav { display: flex; flex-wrap: wrap; align-items: center; gap: 22px; font-size: 13px; } @media(max-width:1023px) { .footer-shell { padding-bottom: 115px; } } @media(max-width:650px) { .footer-shell { flex-direction: column; } }</style>
