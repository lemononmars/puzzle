<script lang="ts">
 import {brand} from "#lib/brand.js";
 import { page } from '$app/state';
 import { socialMetadata } from '#lib/metadata/social.js';
 let meta=$derived(socialMetadata(page.url.pathname,page.data,page.url.origin));
</script>
<svelte:head>
 <link rel="canonical" href={meta.canonical} />
 {#if meta.noindex}<meta name="robots" content="noindex, nofollow" />{/if}
 <meta property="og:site_name" content={brand.name} />
 <meta property="og:title" content={meta.title} />
 <meta property="og:description" content={meta.description} />
 <meta property="og:url" content={meta.canonical} />
 <meta property="og:type" content="website" />
 <meta property="og:image" content={meta.image} />
 <meta property="og:image:alt" content={meta.imageAlt} />
 <meta name="twitter:card" content="summary_large_image" />
 <meta name="twitter:title" content={meta.title} />
 <meta name="twitter:description" content={meta.description} />
 <meta name="twitter:image" content={meta.image} />
 <meta name="twitter:image:alt" content={meta.imageAlt} />
</svelte:head>
