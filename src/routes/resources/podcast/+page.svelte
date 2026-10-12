<script lang="ts">
  import { podcasts } from '#lib/data/podcasts/index.js';
</script>

<svelte:head>
  <title>Codebreaker Podcast | Codebreaker Thailand</title>
  <meta name="description" content="รายการพอดแคสต์เกี่ยวกับเกมไขปริศนา Escape Rooms บอร์ดเกม และการแก้รหัส โดย Codebreaker Thailand" />
</svelte:head>

<div class="px-4 py-8 max-w-6xl mx-auto">
  <header class="mb-8 text-center">
    <h1 class="text-3xl lg:text-4xl font-extrabold text-base-content my-2">Codebreaker Podcast</h1>
  </header>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
    {#each podcasts as item}
      <a
        href="/resources/podcast/{item.id}"
        class="bg-base-100 text-base-content border border-base-300 hover:border-primary/30 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl group"
      >
        <figure class="w-full aspect-video shrink-0 bg-base-100 text-base-content overflow-hidden border-b border-base-300">
          <img
            src={item.thumbnail || `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
            alt={item.title}
            class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        </figure>

        <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div class="space-y-2">
            <div class="flex items-center justify-between gap-4">
              <span class="badge badge-accent font-semibold text-xs">
                EPISODE {item.epNumber}
              </span>
              <span class="text-xs text-base-content/70 font-mono">{item.duration} นาที</span>
            </div>

            <h2 class="text-base font-bold text-base-content/70 group-hover:text-primary transition leading-snug">
              {item.title}
            </h2>
          </div>
        </div>
      </a>
    {/each}
  </div>
</div>
