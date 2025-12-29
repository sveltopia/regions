<script lang="ts">
  import LayoutRegions from "../../components/LayoutRegions.svelte";
  import LayoutRegion from "../../components/LayoutRegion.svelte";
  import TestPageWithUnexpectedRegion from "./TestPageWithUnexpectedRegion.svelte";
</script>

<LayoutRegions>
  <div>
    <!-- Only defines "header" region -->
    <LayoutRegion name="header">
      {#snippet children(data)}
        <div data-testid="header-content">{data?.title}</div>
      {/snippet}
    </LayoutRegion>

    <!-- This page sets "unexpectedRegion" which doesn't exist -->
    <TestPageWithUnexpectedRegion />
  </div>
</LayoutRegions>
