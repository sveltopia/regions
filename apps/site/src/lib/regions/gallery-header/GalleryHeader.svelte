<script lang="ts">
  import { useLayoutRegions } from '@sveltopia/regions';
  import type { GalleryHeaderData } from './galleryHeaderSchema';

  let { galleryTitle, imageCount }: GalleryHeaderData = $props();

  useLayoutRegions(() => ({
    galleryHeader: { galleryTitle, imageCount }
  }));
</script>

<!-- This component automatically sets the 'gallery-header' region when mounted -->
