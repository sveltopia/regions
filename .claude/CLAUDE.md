# @sveltopia/regions - Claude Code Context

## Project Overview

`@sveltopia/regions` is a SvelteKit library that enables multiple named content regions in layouts, solving SvelteKit's limitation of a single `{@render children()}` slot.

## Repository Structure

```
regions/
├── packages/regions/       # The npm package (@sveltopia/regions)
│   ├── src/
│   │   ├── components/    # Core Svelte components
│   │   └── __tests__/     # Test suites
│   ├── cli/               # CLI tool (npx @sveltopia/regions)
│   └── package.json
├── apps/site/             # Documentation & examples site
└── turbo.json             # Monorepo configuration
```

## Key Concepts

### Three Implementation Strategies
1. **Load Functions** — Pass region content via `+page.ts` load functions
2. **Component Wrappers** — Use `<Region name="...">` components
3. **Snippets** — Define `{#snippet regionName()}` blocks (Svelte 5)

### Core Exports
- `LayoutRegions.svelte` — Layout wrapper that provides region context
- `LayoutRegion.svelte` — Component for consuming/rendering a region in layouts
- `useLayoutRegions()` — Composition function for registering snippets from pages

## Testing

**Test Location:** `packages/regions/src/__tests__/`

**Run Tests:**
```bash
cd packages/regions
pnpm test           # Run all tests
pnpm test:watch     # Watch mode
```

**Testing Philosophy:**
- CLI generation tests are critical (automated workflow)
- Integration tests for core functionality
- Real-world usage proven by examples site
- Don't test async timing — test functionality

## CLI Tool

The package includes a CLI for scaffolding:

```bash
npx @sveltopia/regions add <name>    # Generate a new region
```

## Development

**This is a pnpm workspace monorepo.**

```bash
pnpm install                    # Install dependencies
pnpm dev                        # Start dev servers (all apps)
pnpm build                      # Build all packages
pnpm test                       # Run all tests
```

## Publishing Workflow

Package publishes to npm as `@sveltopia/regions`:

```bash
cd packages/regions
pnpm version patch|minor|major  # Bump version
pnpm build                      # Build package
pnpm publish --access public    # Publish to npm
```

## Git Workflow

- Feature branches: `feat/reg-XX/description`
- One branch per issue
- Squash merge to main
- Delete branches after merging

## Svelte 5 Only

This library uses Svelte 5 exclusively:
- `$props()` not `export let`
- `$state()` and `$derived()` for reactivity
- `{#snippet}` blocks for content
- `onclick` not `on:click`

## Documentation Access

Use the Svelte MCP tools for current documentation:
1. `list-sections` — Find relevant docs
2. `get-documentation` — Fetch full content
3. `svelte-autofixer` — Validate Svelte code before committing
