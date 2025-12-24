<script lang="ts">
  import { LayoutRegion } from '@sveltopia/regions';
  import type { Snippet } from 'svelte';

  // For snippet-based regions, we don't need a schema - just accept any snippet
  const statsHeaderSchema = {
    parse: (data: unknown) => data as Snippet<[]>
  };
</script>

<LayoutRegion name="statsHeader" schema={statsHeaderSchema}>
  {#snippet children(data: Record<string, unknown> | undefined)}
    {@const snippetContent = data as unknown as Snippet<[]>}
    {@render snippetContent()}
  {/snippet}
</LayoutRegion>
