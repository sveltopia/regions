<script lang="ts">
  import { page } from '$app/state';

  interface Props {
    title: string;
    description: string;
    ogImage?: string;
  }

  let {
    title,
    description,
    ogImage = 'https://regions.sveltopia.dev/og-image.png'
  }: Props = $props();
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:url" content="https://regions.sveltopia.dev{page.url.pathname}" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />

  <!-- Canonical URL -->
  <link rel="canonical" href="https://regions.sveltopia.dev{page.url.pathname}" />
</svelte:head>
