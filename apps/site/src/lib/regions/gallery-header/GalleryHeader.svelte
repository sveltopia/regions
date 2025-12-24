<script lang="ts">
  import { useLayoutRegions } from '@sveltopia/regions';

  let { galleryTitle, imageCount } = $props();

  useLayoutRegions({
    galleryHeader: { galleryTitle, imageCount }
  });
</script>

<!-- This component automatically sets the 'gallery-header' region when mounted -->
