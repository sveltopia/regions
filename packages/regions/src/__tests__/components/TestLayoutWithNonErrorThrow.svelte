<script lang="ts">
  import { LayoutRegions, LayoutRegion } from "../../index";
  import { useLayoutRegions } from "../../useLayoutRegions.svelte";

  // Schema that throws a non-Error object (string)
  // This tests line 41: const errorMessage = error instanceof Error ? error.message : String(error);
  const stringThrowSchema = {
    parse: (data: unknown) => {
      throw "Validation failed with string error"; // Intentionally throw a string
    }
  };

  // This will trigger validation error during effect
  useLayoutRegions({
    header: {
      title: "Invalid"
    }
  });
</script>

<LayoutRegions>
  <LayoutRegion name="header" schema={stringThrowSchema}>
    {#snippet children(data: Record<string, unknown>)}
      <div>{data.title}</div>
    {/snippet}
  </LayoutRegion>
</LayoutRegions>
