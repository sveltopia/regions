<script lang="ts">
  import { getContext, onMount, untrack } from "svelte";
  import { page } from "$app/state";
  import { dev } from "$app/environment";
  import type { Snippet } from "svelte";
  import { LAYOUT_REGIONS_KEY } from "../types";
  import type { LayoutRegionsContext, RegionSchema } from "../types";

  interface Props {
    name: string;
    children?: Snippet<[Record<string, unknown>?]>;  // Data parameter is optional
    fallback?: Snippet;
    schema?: RegionSchema;
    /** Mark this region as required. Warns in dev mode if page doesn't set it. */
    required?: boolean;
  }

  let { name, children, fallback, schema, required = false }: Props = $props();

  // Get the regions context
  const context = getContext<LayoutRegionsContext | undefined>(
    LAYOUT_REGIONS_KEY
  );

  // Register this region immediately (synchronously) so it's available
  // before any page components try to set regions.
  // Using untrack() because we intentionally capture initial values - these props shouldn't change.
  untrack(() => context?.registerRegion(name, required));

  // Unregister when component unmounts
  onMount(() => {
    return () => context?.unregisterRegion(name);
  });

  // HYBRID APPROACH: Check both page.data and context
  // 1. Try page.data.regions first (SSR-friendly for data)
  // 2. Fall back to context.regions (for snippets and client-side usage)
  // 3. page.data takes precedence if both exist
  let pageDataRegion = $derived(page.data?.regions?.[name]);
  let contextRegion = $derived(context?.regions?.[name]);
  let regionContent = $derived(pageDataRegion ?? contextRegion);

  // Validate region content in dev mode
  $effect(() => {
    if (dev && regionContent !== undefined && regionContent !== null) {
      // Get schema from prop or context
      const activeSchema = schema || context?.schemas?.[name];

      if (activeSchema && !isSnippet(regionContent)) {
        try {
          activeSchema.parse(regionContent);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(
            `❌ Region validation failed for "${name}"\n\n` +
            `Validation error:\n${errorMessage}\n\n` +
            `Tip: Check the data you're passing to useLayoutRegions({ ${name}: ... })`
          );
          throw new Error(`Region validation failed for "${name}": ${errorMessage}`);
        }
      }
    }
  });

  // Check if content is a snippet
  function isSnippet(value: unknown): value is Snippet {
    return typeof value === "function";
  }
</script>

{#if regionContent !== undefined}
  <!-- Region was explicitly set (even if null) -->
  {#if regionContent}
    {#if isSnippet(regionContent)}
      <!-- Render snippet -->
      {@render regionContent()}
    {:else if children}
      <!-- Pass data to children snippet if provided -->
      {@render children(regionContent as Record<string, unknown>)}
    {/if}
  {/if}
{:else if fallback}
  <!-- Region not set, render fallback -->
  {@render fallback()}
{/if}
