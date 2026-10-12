<script lang="ts">
   import { onMount } from 'svelte';
   import { goto } from '$app/navigation';
   import { numPuzzles } from '#lib/data/puzzles/spellingbee/index.js';

   onMount(() => {
      const randomId = Math.floor(Math.random() * numPuzzles);
      goto(`/puzzles/spellingbee/${randomId}`, { replaceState: true });
   });
</script>

<div class="container mx-auto px-4 py-12 text-center text-base-content/70 font-mono">
   กำลังโหลดปริศนา Spelling Bee...
</div>
