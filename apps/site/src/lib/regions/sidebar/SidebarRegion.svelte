<script lang="ts">
  import { LayoutRegion } from "@sveltopia/regions";
  import { sidebarSchema, type SidebarData } from "./sidebarSchema";
  import RegionIndicator from "$lib/components/RegionIndicator.svelte";
</script>

<LayoutRegion name="sidebar" schema={sidebarSchema}>
  {#snippet children(data: Record<string, unknown> | undefined)}
    {@const typedData = data as SidebarData}
    <RegionIndicator label="Sidebar Region" color="blue">
      <h3 class="sidebar-title text-sm font-medium">When to Use</h3>
      <ul class="sidebar-list space-y-1 text-xs">
        {#each typedData.items as item}
          <li>{item}</li>
        {/each}
      </ul>
    </RegionIndicator>
  {/snippet}
  {#snippet fallback()}
    <RegionIndicator label="Sidebar Region" color="blue">
      <div class="text-sm text-muted-foreground italic">
        <p>No sidebar data provided - showing fallback content.</p>
      </div>
    </RegionIndicator>
  {/snippet}
</LayoutRegion>
