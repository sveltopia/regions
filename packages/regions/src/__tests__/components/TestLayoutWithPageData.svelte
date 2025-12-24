<script lang="ts">
  import { LayoutRegions, LayoutRegion } from "../../index";
  import { page } from "$app/state";

  // Simulate page.data.regions being set (like from a load function)
  // This tests line 27: let pageDataRegion = $derived(page.data?.regions?.[name]);
  page.data.regions = {
    header: {
      title: "Page Data Title",
      description: "This comes from page.data, not context"
    }
  };
</script>

<LayoutRegions>
  <LayoutRegion name="header">
    {#snippet children(data: Record<string, unknown>)}
      <div data-testid="header-from-page-data">
        <h1>{data.title}</h1>
        <p>{data.description}</p>
      </div>
    {/snippet}
  </LayoutRegion>

  <main>
    <p>Test page content</p>
  </main>
</LayoutRegions>
