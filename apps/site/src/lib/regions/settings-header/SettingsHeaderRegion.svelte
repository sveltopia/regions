<script lang="ts">
  import { LayoutRegion } from '@sveltopia/regions';
  import { settingsHeaderSchema, type SettingsHeaderData } from './settingsHeaderSchema';
  import RegionIndicator from '$lib/components/RegionIndicator.svelte';
</script>

<LayoutRegion name="settingsHeader" schema={settingsHeaderSchema}>
  {#snippet children(data: Record<string, unknown> | undefined)}
    {@const typedData = data as unknown as SettingsHeaderData}
    <RegionIndicator label="Settings Header Region" color="blue">
      <div class="space-y-2">
        <h2 class="mt-0 text-2xl font-semibold">{typedData.title}</h2>
        <p class="text-muted-foreground">{typedData.description}</p>
      </div>
    </RegionIndicator>
  {/snippet}
</LayoutRegion>
