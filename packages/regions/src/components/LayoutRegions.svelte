<script lang="ts">
  import { setContext, onMount } from "svelte";
  import { dev } from "$app/environment";
  import type { Snippet } from "svelte";
  import { LAYOUT_REGIONS_KEY } from "../types";
  import type { RegionContent, Regions, RegionSchemas, WarningsConfig, LayoutRegionsContext } from "../types";

  interface Props {
    children?: Snippet;
    schemas?: RegionSchemas;
    /** Configure dev mode warnings. Set to false to disable all warnings. */
    warnings?: WarningsConfig | false;
  }

  let props: Props = $props();

  // Default warnings config
  // Note: "unused" is disabled by default because catch-all layouts
  // (defining all possible regions) are a common valid pattern
  const defaultWarnings: WarningsConfig = {
    unused: false,
    missing: true,
    unexpected: true,
  };

  // Resolve warnings config
  const warningsConfig: WarningsConfig = $derived(
    props.warnings === false
      ? { unused: false, missing: false, unexpected: false }
      : { ...defaultWarnings, ...props.warnings }
  );

  // Create reactive state for regions
  let regions = $state<Regions>({});

  // Track defined regions (registered by LayoutRegion components)
  // Using Record instead of Set for better reactivity compatibility
  let definedRegionsMap = $state<Record<string, boolean>>({});
  let requiredRegionsMap = $state<Record<string, boolean>>({});

  // Expose as Sets for the public API
  const definedRegions = {
    has: (name: string) => name in definedRegionsMap,
    add: (name: string) => { definedRegionsMap[name] = true; },
    delete: (name: string) => { delete definedRegionsMap[name]; },
    [Symbol.iterator]: function* () { yield* Object.keys(definedRegionsMap); }
  } as Set<string>;

  const requiredRegions = {
    has: (name: string) => name in requiredRegionsMap,
    add: (name: string) => { requiredRegionsMap[name] = true; },
    delete: (name: string) => { delete requiredRegionsMap[name]; },
    [Symbol.iterator]: function* () { yield* Object.keys(requiredRegionsMap); }
  } as Set<string>;

  // Function to update a region
  function setRegion(name: string, content: RegionContent) {
    // Warn about unexpected regions (only in dev mode)
    if (dev && warningsConfig.unexpected && !definedRegions.has(name)) {
      console.warn(
        `[regions] Unexpected region "${name}"\n\n` +
        `The page is setting a region that no layout is using.\n` +
        `Check that <LayoutRegion name="${name}" /> exists in your layout.`
      );
    }
    regions[name] = content;
  }

  // Function to clear a region
  function clearRegion(name: string) {
    regions[name] = null;
  }

  // Register a region definition
  function registerRegion(name: string, required: boolean) {
    definedRegions.add(name);
    if (required) {
      requiredRegions.add(name);
    }
  }

  // Unregister a region
  function unregisterRegion(name: string) {
    definedRegions.delete(name);
    requiredRegions.delete(name);
  }

  // Make everything available via context
  const context: LayoutRegionsContext = {
    regions,
    get schemas() { return props.schemas; },
    setRegion,
    clearRegion,
    registerRegion,
    unregisterRegion,
    definedRegions,
    requiredRegions,
    get warnings() { return warningsConfig; },
  };

  setContext(LAYOUT_REGIONS_KEY, context);

  // Dev mode warnings for missing required regions
  // Check after a short delay to give page components time to set regions
  onMount(() => {
    if (!dev) return;

    const checkTimeout = setTimeout(() => {
      // Check for missing required regions
      if (warningsConfig.missing) {
        for (const name of requiredRegions) {
          if (regions[name] === undefined || regions[name] === null) {
            console.warn(
              `[regions] Missing required region "${name}"\n\n` +
              `The layout expects this region to be set, but the page didn't provide it.\n` +
              `Add it with: useLayoutRegions({ ${name}: ... })`
            );
          }
        }
      }

      // Check for unused regions
      if (warningsConfig.unused) {
        for (const name of definedRegions) {
          if (regions[name] === undefined) {
            console.warn(
              `[regions] Unused region "${name}"\n\n` +
              `This region is defined in the layout but no page is setting it.\n` +
              `Consider removing it or adding a fallback.`
            );
          }
        }
      }
    }, 100); // Small delay to allow page to set regions

    return () => clearTimeout(checkTimeout);
  });
</script>

<!-- Just render children - no styling here -->
{@render props.children?.()}
