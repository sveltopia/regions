// Components
export { default as LayoutRegions } from "./components/LayoutRegions.svelte";
export { default as LayoutRegion } from "./components/LayoutRegion.svelte";

// Composition functions
export { useLayoutRegions } from "./useLayoutRegions.svelte";
export type { LayoutRegionsOptions } from "./useLayoutRegions.svelte";

// Helper functions for validation libraries
export { valibot, zod } from "./lib/helpers.js";

// Re-export types for convenience
export type { LayoutRegionsContext, RegionSchema, RegionSchemas, Regions, RegionContent } from "./types";

// Type augmentation for page.data.regions (users should import this in their app.d.ts)
export type {} from "./app.d.ts";
