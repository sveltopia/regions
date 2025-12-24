<script lang="ts">
  import { LayoutRegion } from '@sveltopia/regions';
  import { pageHeaderSchema, type PageHeaderData } from './pageHeaderSchema';
  import RegionIndicator from '$lib/components/RegionIndicator.svelte';

  interface Props {
    showIndicator?: boolean;
  }

  let { showIndicator = false }: Props = $props();
</script>

<LayoutRegion name="pageHeader" schema={pageHeaderSchema}>
  {#snippet children(data: Record<string, unknown> | undefined)}
    {@const typedData = data as PageHeaderData}
    {#if showIndicator}
      <RegionIndicator label="Page Header Region" color="purple">
        <h1 class="text-3xl font-bold">{typedData.title}</h1>
        {#if typedData.description}
          <p class="mt-2 text-muted-foreground">{typedData.description}</p>
        {/if}
      </RegionIndicator>
    {:else}
      <h1 class="text-3xl font-bold">{typedData.title}</h1>
      {#if typedData.description}
        <p class="mt-2 text-muted-foreground">{typedData.description}</p>
      {/if}
    {/if}
  {/snippet}
  {#snippet fallback()}
    {#if showIndicator}
      <RegionIndicator label="Page Header Region" color="purple">
        <div class="text-sm text-muted-foreground italic">
          <p>No page header data provided - showing fallback content.</p>
          <p class="mt-1 text-xs">
            This demonstrates the fallback feature when a page doesn't set region data.
          </p>
        </div>
      </RegionIndicator>
    {:else}
      <div class="text-sm text-muted-foreground italic">
        <p>No page header data provided - showing fallback content.</p>
        <p class="mt-1 text-xs">
          This demonstrates the fallback feature when a page doesn't set region data.
        </p>
      </div>
    {/if}
  {/snippet}
</LayoutRegion>
