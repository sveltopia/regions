<script lang="ts">
  import { LayoutRegion } from '@sveltopia/regions';
  import { profileHeaderSchema, type ProfileHeaderData } from './profileHeaderSchema';
  import RegionIndicator from '$lib/components/RegionIndicator.svelte';
</script>

<LayoutRegion name="profileHeader" schema={profileHeaderSchema}>
  {#snippet children(data: Record<string, unknown> | undefined)}
    {@const typedData = data as unknown as ProfileHeaderData}
    <RegionIndicator label="Profile Header Region" color="orange">
      <div class="space-y-2">
        <h2 class="mt-0 text-2xl font-semibold">@{typedData.username}</h2>
        <p class="text-muted-foreground">{typedData.bio}</p>
      </div>
    </RegionIndicator>
  {/snippet}
</LayoutRegion>
