<script lang="ts">
  import LayoutRegions from "../../components/LayoutRegions.svelte";
  import LayoutRegion from "../../components/LayoutRegion.svelte";
  import TestPageWithoutSidebar from "./TestPageWithoutSidebar.svelte";
</script>

<LayoutRegions>
  <!-- Sidebar with fallback - page won't set it -->
  <LayoutRegion name="sidebar">
    {#snippet fallback()}
      <div>Sidebar Fallback Content</div>
    {/snippet}
  </LayoutRegion>

  <TestPageWithoutSidebar />
</LayoutRegions>
