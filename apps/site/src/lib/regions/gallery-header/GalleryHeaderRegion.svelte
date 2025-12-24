<script lang="ts">
  import { LayoutRegion } from '@sveltopia/regions';
  import { galleryHeaderSchema, type GalleryHeaderData } from './galleryHeaderSchema';
  import RegionIndicator from "$lib/components/RegionIndicator.svelte";
</script>

<LayoutRegion name="galleryHeader" schema={galleryHeaderSchema}>
  {#snippet children(data: Record<string, unknown> | undefined)}
    {@const typedData = data as unknown as GalleryHeaderData}
    <RegionIndicator label="Gallery Header Region" color="pink">
      <div class="space-y-2">
        <h2 class="mt-0 text-2xl font-semibold">{typedData.galleryTitle}</h2>
        <p class="text-sm text-muted-foreground">{typedData.imageCount} images</p>
      </div>
    </RegionIndicator>
  {/snippet}
</LayoutRegion>
