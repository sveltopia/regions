<script lang="ts">
  import { LayoutRegion } from "@sveltopia/regions";
  import { footerSchema, type FooterData } from "./footerSchema";
  import RegionIndicator from "$lib/components/RegionIndicator.svelte";
  import PrevNext from "$lib/components/PrevNext.svelte";

  interface Props {
    showIndicator?: boolean;
  }

  let { showIndicator = true }: Props = $props();
</script>

<LayoutRegion name="footer" schema={footerSchema}>
  {#snippet children(data: Record<string, unknown> | undefined)}
    {@const typedData = data as FooterData}
    {#if showIndicator}
      <RegionIndicator label="Footer Region" color="neutral">
        <PrevNext prev={typedData.prev} next={typedData.next} />
      </RegionIndicator>
    {:else}
      <PrevNext prev={typedData.prev} next={typedData.next} />
    {/if}
  {/snippet}
  {#snippet fallback()}
    {#if showIndicator}
      <RegionIndicator label="Footer Region" color="neutral">
        <div class="text-sm text-muted-foreground italic">
          <p>No footer data provided - showing fallback content.</p>
        </div>
      </RegionIndicator>
    {/if}
  {/snippet}
</LayoutRegion>
