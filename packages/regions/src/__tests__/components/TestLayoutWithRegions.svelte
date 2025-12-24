<script lang="ts">
  import LayoutRegions from "../../components/LayoutRegions.svelte";
  import LayoutRegion from "../../components/LayoutRegion.svelte";
  import TestPageWithRegions from "./TestPageWithRegions.svelte";
</script>

<LayoutRegions>
  <!-- Header region with children snippet to render data -->
  <LayoutRegion name="header">
    {#snippet children(data: Record<string, unknown>)}
      <div>{data?.title}</div>
    {/snippet}
  </LayoutRegion>

  <!-- Sidebar region that renders snippet directly -->
  <LayoutRegion name="sidebar" />

  <!-- Footer region with fallback (will be suppressed if page sets it to null) -->
  <LayoutRegion name="footer">
    {#snippet fallback()}
      <div>Footer Fallback</div>
    {/snippet}
  </LayoutRegion>

  <!-- The component wrapper that sets the regions -->
  <TestPageWithRegions />
</LayoutRegions>
