<script lang="ts">
  import { setContext } from "svelte";
  import type { Snippet } from "svelte";
  import { LAYOUT_REGIONS_KEY } from "../types";
  import type { RegionContent, Regions, RegionSchemas } from "../types";

  interface Props {
    children?: Snippet;
    schemas?: RegionSchemas;
  }

  let props: Props = $props();

  // Create reactive state for regions
  let regions = $state<Regions>({});

  // Function to update a region
  function setRegion(name: string, content: RegionContent) {
    regions[name] = content;
  }

  // Function to clear a region
  function clearRegion(name: string) {
    regions[name] = null;
  }

  // Make everything available via context
  // Use getter for schemas to maintain reactivity
  const context = {
    regions,  // Direct reference for proper reactivity
    get schemas() { return props.schemas; },
    setRegion,
    clearRegion,
  };

  setContext(LAYOUT_REGIONS_KEY, context);
</script>

<!-- Just render children - no styling here -->
{@render props.children?.()}
