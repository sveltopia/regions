import { getContext, onMount } from "svelte";
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
 * Returns the context for advanced use cases (imperative region updates).
 *
 * @example
 * ```svelte
 * <script>
 *   import { useLayoutRegions } from '@sveltopia/regions';
 *
 *   useLayoutRegions({
 *     header: {
 *       title: 'My Page',
 *       description: 'Page description'
 *     },
 *     sidebar: sidebarSnippet
 *   });
 * </script>
 *
 * {#snippet sidebarSnippet()}
 *   <div>Sidebar content</div>
 * {/snippet}
 * ```
 */
export function useLayoutRegions(options: LayoutRegionsOptions) {
  const context = getContext<LayoutRegionsContext | undefined>(
    LAYOUT_REGIONS_KEY
  );

  if (!context) {
    console.warn("useLayoutRegions must be used within a LayoutRegions component");
    return;
  }

  // Set regions on mount and clean up on unmount
  // Note: For SSR-friendly data regions without FOUC, use load functions with page.data.regions
  // This function is primarily for snippet-based regions which can't be serialized anyway
  onMount(() => {
    for (const [key, value] of Object.entries(options)) {
      if (value !== undefined) {
        context.setRegion(key, value);
      }
    }

    // Clean up regions when component unmounts
    return () => {
      for (const key of Object.keys(options)) {
        context.clearRegion(key);
      }
    };
  });

  return context;
}
