<script lang="ts">
  import { LayoutRegion } from '@sveltopia/regions';
  import { catalogHeaderSchema, type CatalogHeaderData } from './catalogHeaderSchema';
  import RegionIndicator from "$lib/components/RegionIndicator.svelte";
</script>

<LayoutRegion name="catalogHeader" schema={catalogHeaderSchema}>
  {#snippet children(data: Record<string, unknown> | undefined)}
    {@const typedData = data as unknown as CatalogHeaderData}
    <RegionIndicator label="Catalog Header Region" color="green">
      <div class="space-y-2">
        <h2 class="mt-0 text-2xl font-semibold">{typedData.catalogName}</h2>
        <p class="text-sm text-muted-foreground">{typedData.itemCount} items</p>
      </div>
    </RegionIndicator>
  {/snippet}
</LayoutRegion>
