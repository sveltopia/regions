<script lang="ts">
  import LayoutRegions from "../../components/LayoutRegions.svelte";
  import LayoutRegion from "../../components/LayoutRegion.svelte";
  import TestPageWithValidData from "./TestPageWithValidData.svelte";
  import type { RegionSchemas } from "../../types";

  interface Props {
    schemas: RegionSchemas;
  }

  let { schemas }: Props = $props();
</script>

<LayoutRegions {schemas}>
  <LayoutRegion name="header">
    {#snippet children(data: Record<string, unknown>)}
      <div data-testid="header-content">{data?.title}</div>
    {/snippet}
  </LayoutRegion>

  <TestPageWithValidData />
</LayoutRegions>
