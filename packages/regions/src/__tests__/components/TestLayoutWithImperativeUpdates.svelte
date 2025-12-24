<script lang="ts">
  import LayoutRegions from "../../components/LayoutRegions.svelte";
  import LayoutRegion from "../../components/LayoutRegion.svelte";
  import TestPageWithImperativeUpdates from "./TestPageWithImperativeUpdates.svelte";
</script>

<LayoutRegions>
  <!-- Header region with children snippet to render data -->
  <LayoutRegion name="header">
    {#snippet children(data: Record<string, unknown>)}
      <div data-testid="header-content">{data?.title}</div>
    {/snippet}
    {#snippet fallback()}
      <div data-testid="header-fallback">No Header</div>
    {/snippet}
  </LayoutRegion>

  <TestPageWithImperativeUpdates />
</LayoutRegions>
