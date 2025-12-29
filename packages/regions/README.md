# @sveltopia/regions

[![npm version](https://img.shields.io/npm/v/@sveltopia/regions.svg)](https://www.npmjs.com/package/@sveltopia/regions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> **[Full Documentation & Examples →](https://regions.sveltopia.dev)**

Pass content from child pages to parent layouts in SvelteKit. Server-rendered data or reactive snippets. Type-safe with optional validation.

**Svelte 5 ready.**

## Features

Pass page-specific content (headers, breadcrumbs, sidebars) from pages to parent layouts without prop drilling.

**Three Strategies:**
- **Load Functions** - SSR-friendly data (perfect for SEO)
- **Component Wrappers** - Simple client-side props
- **Snippets** - Full reactive UI with page state

**Key Features:**
- SSR-friendly with zero layout shift
- Type-safe with TypeScript + optional runtime validation
- No prop drilling - pages set regions directly
- Mix strategies on the same page
- Zero runtime cost (validation stripped in production)

## Installation

```bash
npm install @sveltopia/regions
# or
pnpm add @sveltopia/regions
# or
yarn add @sveltopia/regions
```

**Requirements:** SvelteKit 2.12.0+, Svelte 5.0.0+

## Quick Start (CLI)

Generate everything with one command:

```bash
npx @sveltopia/regions add page-header
```

The CLI walks you through:
1. **Strategy choice** - Load Function / Component Wrapper / Snippet
2. **Field definitions** - What data this region needs
3. **Validator** - Valibot / Zod / TypeScript-only
4. **File generation** - Schema, components, and examples

Generated files are production-ready with full TypeScript support.

### Example Output (Load Function Strategy)

```bash
✔ Which strategy? › Load function (SSR, best for SEO)
✔ Fields? › title, description
✔ Validator? › Valibot

Generated:
  src/lib/regions/page-header/pageHeaderSchema.ts
  src/lib/regions/page-header/PageHeaderRegion.svelte
  src/routes/page-header-example/+page.server.ts
  src/routes/page-header-example/+page.svelte
```

**See [Full Documentation](https://regions.sveltopia.dev)** for all strategies and advanced usage.

<details>
<summary><strong>Manual Setup (Without CLI)</strong></summary>

### 1. Define Types & Layout

```typescript
// lib/types.ts
export interface HeaderData {
  title: string;
  description?: string;
}
```

```svelte
<!-- routes/+layout.svelte -->
<script lang="ts">
  import { LayoutRegions, LayoutRegion } from '@sveltopia/regions';
  import type { HeaderData } from '$lib/types';
</script>

<LayoutRegions>
  <LayoutRegion name="header">
    {#snippet children(data)}
      {#if data}
        {@const typed = data as HeaderData}
        <h1>{typed.title}</h1>
        {#if typed.description}<p>{typed.description}</p>{/if}
      {/if}
    {/snippet}
    {#snippet fallback()}
      <h1>Default Title</h1>
    {/snippet}
  </LayoutRegion>

  {@render children?.()}
</LayoutRegions>
```

### 2. Set Content from Pages

**Load Function Strategy:**
```typescript
// routes/about/+page.server.ts
import type { HeaderData } from '$lib/types';

export const load = () => ({
  regions: {
    header: {
      title: "About",
      description: "Learn more"
    } satisfies HeaderData
  }
});
```

**Component Wrapper Strategy:**
```svelte
<!-- routes/about/+page.svelte -->
<script lang="ts">
  import { useLayoutRegions } from '@sveltopia/regions';
  import type { HeaderData } from '$lib/types';

  useLayoutRegions({
    header: {
      title: "About",
      description: "Learn more"
    } satisfies HeaderData
  });
</script>
```

**Snippet Strategy:**
```svelte
<!-- routes/about/+page.svelte -->
<script lang="ts">
  import { useLayoutRegions } from '@sveltopia/regions';

  useLayoutRegions({ header: headerSnippet });
</script>

{#snippet headerSnippet()}
  <h1>About</h1>
  <p>Learn more</p>
{/snippet}
```

</details>

## Core Concepts

### Three-State Logic

Regions support three states for flexible content control:

```svelte
// 1. Content - renders the provided data/snippet
useLayoutRegions({ header: { title: "Products" } });

// 2. Undefined - renders fallback if defined
useLayoutRegions({ /* header not mentioned */ });

// 3. Null - renders nothing (suppresses fallback)
useLayoutRegions({ header: null });
```

### Schema Validation (Optional)

Add runtime validation with Valibot or Zod:

**Valibot:**
```typescript
// lib/regions/headerSchema.ts
import * as v from 'valibot';
import { valibot } from '@sveltopia/regions';

const _headerSchema = v.pipe(
  v.object({
    title: v.string(),
    category: v.union([
      v.literal('components'),
      v.literal('patterns')
    ])
  })
);

export type HeaderData = v.InferOutput<typeof _headerSchema>;

export const headerSchema = valibot<HeaderData>(_headerSchema, v.parse);
```

**Zod:**
```typescript
// lib/regions/headerSchema.ts
import { z } from 'zod';
import type { RegionSchema } from '@sveltopia/regions';

const _headerSchema = z.object({
  title: z.string(),
  category: z.enum(['components', 'patterns'])
});

export type HeaderData = z.infer<typeof _headerSchema>;

export const headerSchema = _headerSchema satisfies RegionSchema<HeaderData>;
```

**Usage in layout:**
```svelte
<script lang="ts">
  import { headerSchema, type HeaderData } from '$lib/regions/headerSchema';
</script>

<LayoutRegion name="header" schema={headerSchema}>
  {#snippet children(data)}
    {@const typed = data as HeaderData}
    <h1>{typed.title}</h1>
  {/snippet}
</LayoutRegion>
```

**Benefits:** Catches typos in enums/literals, validates external data, dev-only (zero production cost).

## TypeScript-Only (No Runtime Validation)

If you don't need runtime validation, use TypeScript interfaces for type safety:

**Define interface:**
```typescript
// lib/types.ts
export interface PageHeaderData {
  title: string;
  description?: string;
}
```

**Layout with type assertion:**
```svelte
<script lang="ts">
  import { LayoutRegions, LayoutRegion } from '@sveltopia/regions';
  import type { PageHeaderData } from '$lib/types';
</script>

<LayoutRegions>
  <LayoutRegion name="page-header">
    {#snippet children(data)}
      {#if data}
        {@const typed = data as PageHeaderData}
        <h1>{typed.title}</h1>
        {#if typed.description}<p>{typed.description}</p>{/if}
      {/if}
    {/snippet}
  </LayoutRegion>

  {@render children?.()}
</LayoutRegions>
```

**Load function with type checking:**
```typescript
// routes/about/+page.server.ts
import type { PageHeaderData } from '$lib/types';

export const load = () => ({
  regions: {
    'page-header': {
      title: "About",
      description: "Learn more"
    } satisfies PageHeaderData
  }
});
```

**Benefits:** Compile-time type safety, zero runtime cost, no dependencies. **Trade-off:** No validation of data at runtime (typos in enum values won't be caught).

## API Reference

### Components

**`<LayoutRegions>`**
Wraps layouts to enable regions.

Props: `children?`, `schemas?`, `warnings?`

**`<LayoutRegion name>`**
Renders a specific region.

Props: `name` (required), `children?`, `fallback?`, `schema?`, `required?`

### Functions

**`useLayoutRegions(options)`**
Hook for pages to set regions.

```typescript
useLayoutRegions({
  header: { title: "Products" },  // Data
  sidebar: sidebarSnippet,         // Snippet
  footer: null                     // Suppress
});
```

Returns `LayoutRegionsContext` for imperative updates:

```typescript
const ctx = useLayoutRegions({ ... });
ctx?.setRegion('header', { title: 'New Title' });
ctx?.clearRegion('header');
```

### Types

```typescript
import type {
  LayoutRegionsOptions,
  LayoutRegionsContext,
  RegionSchema,
  RegionSchemas,
  RegionContent,
  WarningsConfig
} from '@sveltopia/regions';
```

## Development Warnings

In development mode, the library provides helpful warnings to catch common mistakes:

**Unexpected Region** (enabled by default) - Fires immediately when a page sets a region that no layout defines:
```
[regions] Unexpected region "typoSidebar"
The page is setting a region that no layout is using.
Check that <LayoutRegion name="typoSidebar" /> exists in your layout.
```

**Missing Required Region** (enabled by default) - Fires when a page doesn't set a region marked as `required`:
```svelte
<LayoutRegion name="header" required>
  ...
</LayoutRegion>
```

**Unused Region** (disabled by default) - Fires when a region is defined in the layout but no page sets it. Disabled by default because "catch-all" layouts that define all possible regions are a common valid pattern.

### Configuring Warnings

```svelte
<!-- Enable strict checking (including unused regions) -->
<LayoutRegions warnings={{ unused: true }}>
  ...
</LayoutRegions>
```

```svelte
<!-- Disable all warnings -->
<LayoutRegions warnings={false}>
  ...
</LayoutRegions>
```

Warnings have zero runtime cost in production (only run when `dev === true`).

## Comparison with Alternatives

Compare @sveltopia/regions against other SvelteKit patterns for passing content between pages and layouts:

| Feature          | @sveltopia/regions           | Props (↓) | Context/Stores | Manual Implementation |
| ---------------- | ---------------------------- | --------- | -------------- | --------------------- |
| Data Flow        | Page → Layout (↑)            | Layout → Page (↓) | Bidirectional | Page → Layout (↑) |
| SSR-Friendly     | Yes (with load functions)    | Yes       | No             | Yes (with work)       |
| No Prop Drilling | Yes                          | No        | Yes            | No                    |
| Type Safe        | Yes                          | Yes       | Partial        | Yes (with work)       |
| Dynamic Content  | Yes                          | Partial   | Yes            | Yes (with work)       |
| Validation       | Yes                          | Partial   | No             | No                    |

**Explanation:**
- **@sveltopia/regions**: Purpose-built for passing content FROM pages UP to parent layouts with three strategies and optional validation
- **Props (↓)**: Traditional component props - only work in opposite direction (layout → page), not suitable for page headers/breadcrumbs
- **Context/Stores**: Can pass data upward, but not SSR-friendly and requires manual context setup in every layout/page
- **Manual Implementation**: Build your own context-based system - flexible but requires significant boilerplate and maintenance

## Contributing

We welcome contributions! Here's how to get started:

**Development Setup:**
```bash
git clone https://github.com/sveltopia/regions.git
cd regions
pnpm install
pnpm test          # Run tests
pnpm build         # Build package
```

**Before submitting a PR:**
- Run tests: `pnpm test`
- Ensure types check: `pnpm check`
- Follow the existing code style

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## Support

- [GitHub Issues](https://github.com/sveltopia/regions/issues) - Bug reports and feature requests
- [Full Documentation](https://regions.sveltopia.dev) - Comprehensive guides and examples

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and migration guides.

## License

MIT © [Sveltopia](https://github.com/sveltopia)

See [LICENSE](./LICENSE) for details.
