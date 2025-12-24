import { getContext } from "svelte";
import { LAYOUT_REGIONS_KEY } from "./types";
import type { LayoutRegionsContext, RegionContent } from "./types";

export interface LayoutRegionsOptions {
  [key: string]: RegionContent;
}

/**
 * Composition function to set layout regions from a component wrapper.
 *
 * Allows pages to provide content (data or UI snippets) to regions defined
 * in parent layouts. Automatically cleans up regions when the page unmounts.
 *
 * Pass a getter function to enable reactive updates when props change.
 *
 * Returns the context for advanced use cases (imperative region updates).
 *
 * @example
 * ```svelte
 * <script>
 *   import { useLayoutRegions } from '@sveltopia/regions';
 *   import type { HeaderData } from './headerSchema';
 *
 *   let { title, description }: HeaderData = $props();
 *
 *   // Use getter function for reactive prop tracking
 *   useLayoutRegions(() => ({
 *     header: { title, description }
 *   }));
 * </script>
 * ```
 */
export function useLayoutRegions(
  options: LayoutRegionsOptions | (() => LayoutRegionsOptions)
) {
  const context = getContext<LayoutRegionsContext | undefined>(
    LAYOUT_REGIONS_KEY
  );

  if (!context) {
    console.warn("useLayoutRegions must be used within a LayoutRegions component");
    return;
  }

  // Support both static objects and getter functions
  const getOptions = typeof options === 'function' ? options : () => options;

  // Use $effect for reactive tracking when getter is used
  // This re-runs when any reactive values inside the getter change
  $effect(() => {
    const opts = getOptions();

    for (const [key, value] of Object.entries(opts)) {
      if (value !== undefined) {
        context.setRegion(key, value);
      }
    }

    // Clean up regions when component unmounts or effect re-runs
    return () => {
      for (const key of Object.keys(opts)) {
        context.clearRegion(key);
      }
    };
  });

  return context;
}
