<script lang="ts">
  import LayoutRegions from "../../components/LayoutRegions.svelte";
  import LayoutRegion from "../../components/LayoutRegion.svelte";
  import TestPageWithValidData from "./TestPageWithValidData.svelte";
  import type { RegionSchema } from "../../types";

  interface Props {
    headerSchema?: RegionSchema;
  }

  let { headerSchema }: Props = $props();
</script>

<LayoutRegions>
  <LayoutRegion name="header" schema={headerSchema}>
    {#snippet children(data: Record<string, unknown>)}
      <div data-testid="header-content">{data?.title}</div>
    {/snippet}
  </LayoutRegion>

  <TestPageWithValidData />
</LayoutRegions>
