# Sveltopia Regions

[![npm version](https://img.shields.io/npm/v/@sveltopia/regions.svg)](https://www.npmjs.com/package/@sveltopia/regions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-sveltopia-181717?logo=github)](https://github.com/sveltopia)

Pass content from child pages to parent layouts in SvelteKit. Server-rendered data or reactive snippets. Type-safe with optional validation.

## Documentation

- **[Full Documentation & Examples](https://regions.sveltopia.dev)** - Interactive guides and live examples
- **[Package README](./packages/regions/README.md)** - Quick start, API reference, and usage patterns

## Quick Start

```bash
npm install @sveltopia/regions
```

Generate a region with the CLI:

```bash
npx @sveltopia/regions add page-header
```

## Repository Structure

```
regions/
├── packages/regions/    # The @sveltopia/regions library
└── apps/site/           # Documentation site (regions.sveltopia.dev)
```

## Development

```bash
pnpm install
pnpm dev        # Start all apps
pnpm build      # Build all packages
pnpm test       # Run tests
```

## License

MIT
