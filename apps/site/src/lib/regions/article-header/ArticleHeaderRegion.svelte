<script lang="ts">
  import { LayoutRegion } from "@sveltopia/regions";
  import {
    articleHeaderSchema,
    type ArticleHeaderData,
  } from "./articleHeaderSchema";
  import RegionIndicator from "$lib/components/RegionIndicator.svelte";
</script>

<LayoutRegion name="articleHeader" schema={articleHeaderSchema}>
  {#snippet children(data: Record<string, unknown> | undefined)}
    {@const typedData = data as unknown as ArticleHeaderData}
    <RegionIndicator label="Article Header Region" color="blue">
      <div class="space-y-2">
        <h2 class="mt-0 text-2xl font-semibold">{typedData.title}</h2>
        <p class="text-muted-foreground">{typedData.description}</p>
      </div>
    </RegionIndicator>
  {/snippet}
</LayoutRegion>
