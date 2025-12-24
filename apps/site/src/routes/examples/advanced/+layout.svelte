<script lang="ts">
  import { LayoutRegion } from "@sveltopia/regions";
  import RegionIndicator from "$lib/components/RegionIndicator.svelte";

  let { children } = $props();
</script>

<div class="space-y-6">
  <!-- Shared Nav Region (inherited from parent layout) -->
  <LayoutRegion name="sharedNav">
    {#snippet children(data)}
      {#if data && Array.isArray(data.items)}
        <RegionIndicator label="Shared Navigation (Inherited)" color="blue">
          <div class="space-y-2">
            <h3 class="font-semibold">{data.title}</h3>
            <ul class="text-sm space-y-1">
              {#each data.items as item}
                <li>{item}</li>
              {/each}
            </ul>
          </div>
        </RegionIndicator>
      {/if}
    {/snippet}
  </LayoutRegion>

  <!-- Layout Info Region (will be overridden by page) -->
  <LayoutRegion name="layoutInfo">
    {#snippet children(data)}
      {#if data}
        <RegionIndicator
          label="Layout Info ({data.source})"
          color={data.source === 'parent layout' ? 'blue' : 'purple'}
        >
          <div class="space-y-1">
            <p class="font-medium">Source: {data.source}</p>
            <p class="text-sm">{data.message}</p>
          </div>
        </RegionIndicator>
      {/if}
    {/snippet}
  </LayoutRegion>

  <!-- Page-Only Region (will be added by page) -->
  <LayoutRegion name="pageOnlyRegion">
    {#snippet children(data)}
      {#if data}
        <RegionIndicator label="Page-Only Region (Added)" color="green">
          <div class="space-y-1">
            <p class="font-medium">{data.title}</p>
            <p class="text-sm">{data.description}</p>
          </div>
        </RegionIndicator>
      {/if}
    {/snippet}
  </LayoutRegion>

  <!-- Page Content -->
  <div class="rounded-lg border bg-card p-6">
    {@render children()}
  </div>
</div>
