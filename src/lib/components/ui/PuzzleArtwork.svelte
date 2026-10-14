<script lang="ts">
 const letters = 'PLAYIDEACLUEWORD'.split('');
 const words = ['PLAY','IDEA','CLUE','WORD'];
 let wordIndex = $state(0);
 let chosen = $state<number[]>([]);
 let result = $derived(chosen.map(index => letters[index]).join(''));
 let solved = $derived(result === words[wordIndex]);
 function pick(index:number) { const position=chosen.indexOf(index); if(position >= 0) chosen=chosen.slice(0,position); else chosen=chosen.length === 4 ? [index] : [...chosen,index]; }
 function next() { wordIndex=(wordIndex+1)%words.length; chosen=[]; }
</script>
<div class="art bg-base-300 text-base-content">
 <div class="paper bg-base-100 text-base-content">
  <div class="flex justify-between items-center"><p class="botanical-eyebrow">A TINY WARM-UP</p><span class="text-xs text-primary">{words[wordIndex]}</span></div>
  <p class="instruction">เลือกตัวอักษรให้เป็นคำ <strong>{words[wordIndex]}</strong></p>
  <div class="letters" aria-label="เลือกตัวอักษร">
   {#each letters as letter, i}<button type="button" class:highlight={chosen.includes(i)} aria-pressed={chosen.includes(i)} aria-label={`${letter}, ช่อง ${i + 1}`} onclick={() => pick(i)}>{letter}</button>{/each}
  </div>
  <p class="feedback" role="status">{solved ? 'ใช่เลย! อีกคำไหม? ✦' : chosen.length === 4 ? 'ลองเรียงใหม่อีกครั้ง ↻' : result || 'แตะตัวอักษร แล้วลองค้นพบคำแรก'}</p>
  <div class="flex justify-between gap-2 mt-3"><button class="btn btn-xs btn-ghost" onclick={() => chosen=[]}>เริ่มใหม่</button><button class="btn btn-xs btn-outline btn-primary" onclick={next}>สลับคำ ↻</button></div>
 </div>
 <div class="sticker bg-accent text-accent-content" aria-hidden="true"><strong>{solved ? 'aha!' : 'tap!'}</strong><small>follow a little clue</small></div>
</div>
<style>
 .art { min-height:390px; position:relative; display:grid; place-items:center; border-radius:180px 180px 24px 24px; padding:24px 12px; }
 .paper { width:min(290px,100%); padding:20px; border-radius:20px; transform:rotate(3deg); box-shadow:0 14px 30px #364b3e15; animation:arrive .6s ease-out; }
 .instruction { font-size:12px; margin:8px 0; } .letters { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:6px; margin:14px 0; }
 .letters button { aspect-ratio:1; min-height:44px; display:grid; place-items:center; border-radius:50%; background:var(--color-base-200); color:var(--color-base-content); font-size:22px; cursor:pointer; transition:transform .15s,background .15s; }
 .letters button:hover { transform:translateY(-3px) rotate(-5deg); } .letters .highlight { background:var(--color-primary); color:var(--color-primary-content); }
 .feedback { min-height:24px; font-size:12px; color:var(--color-primary); } small { font-size:10px; }
 .sticker { position:absolute; right:0; bottom:12px; width:92px; height:92px; border-radius:60% 40% 55% 45%; display:flex; flex-direction:column; align-items:center; justify-content:center; transform:rotate(-10deg); animation:bob 5s ease-in-out infinite; pointer-events:none; }
 strong { font-size:inherit; } .sticker strong { font-size:24px; } @keyframes bob { 50% { transform:translateY(-8px) rotate(-6deg); } } @keyframes arrive { from { opacity:0; transform:translateY(12px) rotate(0); } }
 @media(max-width:550px) { .art { min-height:350px; } .sticker { width:66px; height:66px; right:-4px; top:-22px; bottom:auto; } .sticker small { font-size:8px; } }
@media(prefers-reduced-motion:reduce) { .paper,.sticker { animation:none !important; } }
</style>
