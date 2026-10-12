<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  onMount(() => {
    goto('/resources/podcast', { replaceState: true });
  });
</script>

<div class="p-8 text-center">
  <p class="text-base-content/70 mb-4">กำลังเปิดหน้า Codebreaker Podcast...</p>
  <a href="/resources/podcast" class="btn btn-primary btn-sm">คลิกที่นี่หากไม่เปลี่ยนหน้าโดยอัตโนมัติ</a>
</div>
