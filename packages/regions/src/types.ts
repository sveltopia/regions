import type { Snippet } from "svelte";

// Region content can be data, a snippet (either typed or inferred from declaration), or null
// Snippet declarations in Svelte produce functions that return SnippetReturn, so we need to accept both:
// - Snippet<any[]> for explicitly typed snippets
// - Function type for snippet declarations like {#snippet foo()}
export type RegionContent = Record<string, unknown> | Snippet<any[]> | ((...args: any[]) => any) | null;

// Collection of all regions
export type Regions = Record<string, RegionContent>;

// Validator-agnostic schema type with generic output
// Any object with a parse() method that throws on validation failure
export interface RegionSchema<T = unknown> {
  parse: (data: unknown) => T;
}

// Collection of schemas for regions
export type RegionSchemas = Record<string, RegionSchema>;

// Context interface for region management
export interface LayoutRegionsContext {
  regions: Regions;
  schemas?: RegionSchemas;
  setRegion: (name: string, content: RegionContent) => void;
  clearRegion: (name: string) => void;
}

// The context key used across all components
export const LAYOUT_REGIONS_KEY = "layout-regions-context";
