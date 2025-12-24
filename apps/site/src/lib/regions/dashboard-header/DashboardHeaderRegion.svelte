<script lang="ts">
  import { LayoutRegion } from '@sveltopia/regions';
  import { dashboardHeaderSchema, type DashboardHeaderData } from './dashboardHeaderSchema';
  import RegionIndicator from '$lib/components/RegionIndicator.svelte';
</script>

<LayoutRegion name="dashboardHeader" schema={dashboardHeaderSchema}>
  {#snippet children(data: Record<string, unknown> | undefined)}
    {@const typedData = data as DashboardHeaderData}
    <RegionIndicator label="Dashboard Header Region" color="pink">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="mt-0 mb-1 text-2xl font-semibold">{typedData.title}</h2>
          <p class="text-sm text-muted-foreground">
            {typedData.userCount} active users
          </p>
        </div>
        <div
          class={`rounded px-3 py-1 text-sm font-medium ${typedData.isLive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'}`}
        >
          {typedData.isLive ? 'Live' : 'Offline'}
        </div>
      </div>
    </RegionIndicator>
  {/snippet}
</LayoutRegion>
