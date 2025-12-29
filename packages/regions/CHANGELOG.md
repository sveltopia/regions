# Changelog

All notable changes to @sveltopia/regions will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-12-28

### Added
- Initial release of @sveltopia/regions
- Three content strategies: Load Functions, Component Wrappers, and Snippets
- Three-state logic for content control (content/undefined/null)
- Optional runtime validation with Valibot and Zod
- TypeScript support with type inference
- CLI tool for scaffolding regions (`npx @sveltopia/regions add <name>`)
- Development warnings for missing/unexpected regions
- Zero runtime cost validation (dev-only)
- SSR-friendly implementation
- Full Svelte 5 support

[Unreleased]: https://github.com/sveltopia/regions/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/sveltopia/regions/releases/tag/v0.1.0
