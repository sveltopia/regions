import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('CLI E2E Tests', () => {
	const testDir = path.join(__dirname, '../../test-output');
	const cliPath = path.join(__dirname, '../index.ts');
	
	beforeEach(async () => {
		// Create test directory structure
		await fs.mkdir(testDir, { recursive: true });
		await fs.mkdir(path.join(testDir, 'src/lib/regions'), { recursive: true });
		await fs.mkdir(path.join(testDir, 'src/routes/example'), { recursive: true });
	});
	
	afterEach(async () => {
		// Clean up test directory
		await fs.rm(testDir, { recursive: true, force: true });
	});
	
	describe('Load Function Strategy', () => {
		it('generates files with Valibot validation', async () => {
			await execAsync(
				`npx tsx ${cliPath} add test-region`,
				{
					cwd: testDir,
					env: {
						...process.env,
						TEST_STRATEGY: 'load-function',
						TEST_VALIDATOR: 'valibot',
						TEST_FIELDS: JSON.stringify([
							{ name: 'title', type: 'string', optional: false },
							{ name: 'description', type: 'string', optional: true }
						]),
						TEST_SERVER_ONLY: 'true',
						TEST_EXAMPLE_PATH: 'src/routes/example'
					}
				}
			);
			
			// Check schema file
			const schemaPath = path.join(testDir, 'src/lib/regions/test-region/testRegionSchema.ts');
			const schemaContent = await fs.readFile(schemaPath, 'utf-8');
			
			expect(schemaContent).toContain("import * as v from 'valibot'");
			expect(schemaContent).toContain('title: v.string()');
			expect(schemaContent).toContain('description: v.optional(v.string())'); // Optional field
			expect(schemaContent).toContain('valibot<TestRegionData>(_testRegionSchema, v.parse)');
			
			// Check consumer file
			const consumerPath = path.join(testDir, 'src/lib/regions/test-region/TestRegionRegion.svelte');
			const consumerContent = await fs.readFile(consumerPath, 'utf-8');
			
			expect(consumerContent).toContain('<LayoutRegion name="testRegion"');
			expect(consumerContent).toContain('schema={testRegionSchema}');
			expect(consumerContent).toContain('typedData.title');
			expect(consumerContent).toContain('typedData.description');
			
			// Check load function
			const loadPath = path.join(testDir, 'src/routes/example/+page.server.ts');
			const loadContent = await fs.readFile(loadPath, 'utf-8');

			expect(loadContent).toContain('export const load: PageServerLoad');
			expect(loadContent).toContain('testRegion:');
			// Load function has field-specific TODOs
			expect(loadContent).toContain('TODO: Add title');

			// Check +layout.svelte
			const layoutPath = path.join(testDir, 'src/routes/example/+layout.svelte');
			const layoutContent = await fs.readFile(layoutPath, 'utf-8');
			expect(layoutContent).toContain("import TestRegionRegion from '$lib/regions/test-region/TestRegionRegion.svelte'");
			expect(layoutContent).toContain('<TestRegionRegion />');
			expect(layoutContent).toContain('{@render children()}'); // Svelte 5 syntax
		});
		
		it('generates files with Zod validation', async () => {			await execAsync(
				`npx tsx ${cliPath} add catalog-header`,
				{
					cwd: testDir,
					env: {
						...process.env,
						TEST_STRATEGY: 'load-function',
						TEST_VALIDATOR: 'zod',
						TEST_FIELDS: JSON.stringify([
							{ name: 'catalogName', type: 'string', optional: false },
							{ name: 'itemCount', type: 'number', optional: false }
						]),
						TEST_SERVER_ONLY: 'true',
						TEST_EXAMPLE_PATH: 'src/routes/example'
					}
				}
			);

			const schemaPath = path.join(testDir, 'src/lib/regions/catalog-header/catalogHeaderSchema.ts');
			const schemaContent = await fs.readFile(schemaPath, 'utf-8');

			expect(schemaContent).toContain("import { z } from 'zod'");
			expect(schemaContent).toContain('catalogName: z.string()');
			expect(schemaContent).toContain('itemCount: z.number()');
			expect(schemaContent).toContain('zod<CatalogHeaderData>(_catalogHeaderSchema)');

			// Check consumer component includes fallback snippet
			const consumerPath = path.join(testDir, 'src/lib/regions/catalog-header/CatalogHeaderRegion.svelte');
			const consumerContent = await fs.readFile(consumerPath, 'utf-8');
			expect(consumerContent).toContain('{#snippet fallback()}');
			expect(consumerContent).toContain('<!-- Renders when no data is provided for this region -->');

			// Check +layout.svelte
			const layoutPath = path.join(testDir, 'src/routes/example/+layout.svelte');
			const layoutContent = await fs.readFile(layoutPath, 'utf-8');
			expect(layoutContent).toContain("import CatalogHeaderRegion from '$lib/regions/catalog-header/CatalogHeaderRegion.svelte'");
			expect(layoutContent).toContain('<CatalogHeaderRegion />');
			expect(layoutContent).toContain('{@render children()}'); // Svelte 5 syntax
		});
		
		it('generates files with TypeScript-only validation', async () => {
			await execAsync(
				`npx tsx ${cliPath} add settings-header`,
				{
					cwd: testDir,
					env: {
						...process.env,
						TEST_STRATEGY: 'load-function',
						TEST_VALIDATOR: 'none', // Use 'none' for TypeScript-only
						TEST_FIELDS: JSON.stringify([
							{ name: 'title', type: 'string', optional: false },
							{ name: 'subtitle', type: 'string', optional: true }
						]),
						TEST_SERVER_ONLY: 'false',
						TEST_EXAMPLE_PATH: 'src/routes/example'
					}
				}
			);

			// TypeScript-only uses PascalCase + Data filename (no schema)
			const typePath = path.join(testDir, 'src/lib/regions/settings-header/SettingsHeaderData.ts');
			const typeContent = await fs.readFile(typePath, 'utf-8');

			expect(typeContent).toContain('export interface SettingsHeaderData {');
			expect(typeContent).toContain('title: string;');
			expect(typeContent).toContain('subtitle?: string;'); // Optional field with ? marker
			// TypeScript-only should NOT have a schema object
			expect(typeContent).not.toContain('RegionSchema');

			// Should generate +page.ts (not .server.ts) for universal load
			const loadPath = path.join(testDir, 'src/routes/example/+page.ts');
			const loadExists = await fs.access(loadPath).then(() => true).catch(() => false);
			expect(loadExists).toBe(true);

			// Check +layout.svelte
			const layoutPath = path.join(testDir, 'src/routes/example/+layout.svelte');
			const layoutContent = await fs.readFile(layoutPath, 'utf-8');
			expect(layoutContent).toContain("import SettingsHeaderRegion from '$lib/regions/settings-header/SettingsHeaderRegion.svelte'");
			expect(layoutContent).toContain('<SettingsHeaderRegion />');
			expect(layoutContent).toContain('{@render children()}'); // Svelte 5 syntax
		});
	});
	
	describe('Component Wrapper Strategy', () => {
		it('generates wrapper, consumer, layout, and page files with Valibot', async () => {
			await execAsync(
				`npx tsx ${cliPath} add gallery-header`,
				{
					cwd: testDir,
					env: {
						...process.env,
						TEST_STRATEGY: 'page-component',
						TEST_VALIDATOR: 'valibot',
						TEST_FIELDS: JSON.stringify([
							{ name: 'galleryTitle', type: 'string', optional: false },
							{ name: 'imageCount', type: 'number', optional: false }
						]),
						TEST_EXAMPLE_PATH: 'src/routes/example'
					}
				}
			);

			// Check schema
			const schemaPath = path.join(testDir, 'src/lib/regions/gallery-header/galleryHeaderSchema.ts');
			const schemaContent = await fs.readFile(schemaPath, 'utf-8');
			expect(schemaContent).toContain('valibot<GalleryHeaderData>');

			// Check wrapper component
			const wrapperPath = path.join(testDir, 'src/lib/regions/gallery-header/GalleryHeader.svelte');
			const wrapperContent = await fs.readFile(wrapperPath, 'utf-8');
			expect(wrapperContent).toContain('let props = $props<{ galleryTitle: string; imageCount: string }>()');
			expect(wrapperContent).toContain('useLayoutRegions({');
			expect(wrapperContent).toContain('galleryHeader: props');

			// Check consumer component
			const consumerPath = path.join(testDir, 'src/lib/regions/gallery-header/GalleryHeaderRegion.svelte');
			const consumerContent = await fs.readFile(consumerPath, 'utf-8');
			expect(consumerContent).toContain('<LayoutRegion name="galleryHeader"');
			expect(consumerContent).toContain('typedData.galleryTitle');
			expect(consumerContent).toContain('{#snippet fallback()}');
			expect(consumerContent).toContain('<!-- Renders when no data is provided for this region -->');

			// Check +layout.svelte
			const layoutPath = path.join(testDir, 'src/routes/example/+layout.svelte');
			const layoutContent = await fs.readFile(layoutPath, 'utf-8');
			expect(layoutContent).toContain("import GalleryHeaderRegion from '$lib/regions/gallery-header/GalleryHeaderRegion.svelte'");
			expect(layoutContent).toContain('<GalleryHeaderRegion />');
			expect(layoutContent).toContain('{@render children()}'); // Svelte 5 syntax

			// Check +page.svelte
			const pagePath = path.join(testDir, 'src/routes/example/+page.svelte');
			const pageContent = await fs.readFile(pagePath, 'utf-8');
			expect(pageContent).toContain("import GalleryHeader from '$lib/regions/gallery-header/GalleryHeader.svelte'");
			expect(pageContent).toContain('<GalleryHeader');
		});
	});
	
	describe('Snippet Strategy', () => {
		it('generates layout and page files (no consumer component needed)', async () => {
			await execAsync(
				`npx tsx ${cliPath} add dashboard-header`,
				{
					cwd: testDir,
					env: {
						...process.env,
						TEST_STRATEGY: 'snippet',
						TEST_EXAMPLE_PATH: 'src/routes/example'
					}
				}
			);

			// Should NOT create consumer component (snippets render directly!)
			const consumerPath = path.join(testDir, 'src/lib/regions/dashboard-header/DashboardHeaderRegion.svelte');
			const consumerExists = await fs.access(consumerPath).then(() => true).catch(() => false);
			expect(consumerExists).toBe(false);

			// Should create +layout.svelte with LayoutRegion and inline schema
			const layoutPath = path.join(testDir, 'src/routes/example/+layout.svelte');
			const layoutContent = await fs.readFile(layoutPath, 'utf-8');
			expect(layoutContent).toContain("import { LayoutRegion } from '@sveltopia/regions'");
			expect(layoutContent).toContain('const dashboardHeaderSchema = {'); // Inline schema
			expect(layoutContent).toContain('parse: (data: unknown) => data as Snippet<[]>'); // Schema parse function
			expect(layoutContent).toContain('<LayoutRegion name="dashboardHeader" schema={dashboardHeaderSchema}>'); // Schema usage
			expect(layoutContent).toContain('{#snippet children(data: Record<string, unknown> | undefined)}'); // Children snippet
			expect(layoutContent).toContain('{@const snippetContent = data as unknown as Snippet<[]>}'); // Type casting
			expect(layoutContent).toContain('{@render snippetContent()}'); // Actually render the snippet!
			expect(layoutContent).toContain('{@render children()}'); // Svelte 5 syntax for page children
			expect(layoutContent).not.toContain('DashboardHeaderRegion'); // No consumer component

			// Should create +page.svelte with snippet usage
			const pagePath = path.join(testDir, 'src/routes/example/+page.svelte');
			const pageContent = await fs.readFile(pagePath, 'utf-8');
			expect(pageContent).toContain('useLayoutRegions');
			expect(pageContent).toContain('{#snippet dashboardHeaderSnippet()}');
			expect(pageContent).toContain('let count = $state(0)'); // Example reactive state

			// Should NOT create schema file
			const schemaPath = path.join(testDir, 'src/lib/regions/dashboard-header/dashboardHeaderSchema.ts');
			const schemaExists = await fs.access(schemaPath).then(() => true).catch(() => false);
			expect(schemaExists).toBe(false);
		});
	});
	
	describe('Region Name Normalization', () => {
		it('handles kebab-case input', async () => {
			await execAsync(
				`npx tsx ${cliPath} add product-header`,
				{
					cwd: testDir,
					env: {
						...process.env,
						TEST_STRATEGY: 'load-function',
						TEST_VALIDATOR: 'valibot',
						TEST_FIELDS: JSON.stringify([
							{ name: 'productName', type: 'string', optional: false }
						]),
						TEST_SERVER_ONLY: 'true',
						TEST_EXAMPLE_PATH: 'src/routes/example'
					}
				}
			);

			// Should create files in product-header directory
			const dirExists = await fs.access(
				path.join(testDir, 'src/lib/regions/product-header')
			).then(() => true).catch(() => false);
			expect(dirExists).toBe(true);

			// Schema should use camelCase in code
			const schemaPath = path.join(testDir, 'src/lib/regions/product-header/productHeaderSchema.ts');
			const schemaContent = await fs.readFile(schemaPath, 'utf-8');
			expect(schemaContent).toContain('export const productHeaderSchema');
		});
		
		it('handles camelCase input', async () => {
			await execAsync(
				`npx tsx ${cliPath} add productHeader`,
				{
					cwd: testDir,
					env: {
						...process.env,
						TEST_STRATEGY: 'load-function',
						TEST_VALIDATOR: 'valibot',
						TEST_FIELDS: JSON.stringify([
							{ name: 'productName', type: 'string', optional: false }
						]),
						TEST_SERVER_ONLY: 'true',
						TEST_EXAMPLE_PATH: 'src/routes/example'
					}
				}
			);

			// Should still create files in product-header directory (kebab-case for filesystem)
			const dirExists = await fs.access(
				path.join(testDir, 'src/lib/regions/product-header')
			).then(() => true).catch(() => false);
			expect(dirExists).toBe(true);
		});
	});

	describe('Array Field Support', () => {
		it('generates array fields with Valibot validation', async () => {
			await execAsync(
				`npx tsx ${cliPath} add nav-items`,
				{
					cwd: testDir,
					env: {
						...process.env,
						TEST_STRATEGY: 'load-function',
						TEST_VALIDATOR: 'valibot',
						TEST_FIELDS: JSON.stringify([
							{ name: 'items', type: 'array', itemType: 'string', optional: false }
						]),
						TEST_SERVER_ONLY: 'true',
						TEST_EXAMPLE_PATH: 'src/routes/example'
					}
				}
			);

			// Check schema has array syntax
			const schemaPath = path.join(testDir, 'src/lib/regions/nav-items/navItemsSchema.ts');
			const schemaContent = await fs.readFile(schemaPath, 'utf-8');
			expect(schemaContent).toContain('v.array(v.string())');

			// Check consumer component has {#each} loop
			const consumerPath = path.join(testDir, 'src/lib/regions/nav-items/NavItemsRegion.svelte');
			const consumerContent = await fs.readFile(consumerPath, 'utf-8');
			expect(consumerContent).toContain('{#each typedData.items as item}');
			expect(consumerContent).toContain('{item}');
			expect(consumerContent).toContain('{/each}');
		});

		it('generates array fields with Zod validation', async () => {
			await execAsync(
				`npx tsx ${cliPath} add tag-list`,
				{
					cwd: testDir,
					env: {
						...process.env,
						TEST_STRATEGY: 'page-component',
						TEST_VALIDATOR: 'zod',
						TEST_FIELDS: JSON.stringify([
							{ name: 'tags', type: 'array', itemType: 'string', optional: false }
						]),
						TEST_EXAMPLE_PATH: 'src/routes/example'
					}
				}
			);

			// Check schema has array syntax
			const schemaPath = path.join(testDir, 'src/lib/regions/tag-list/tagListSchema.ts');
			const schemaContent = await fs.readFile(schemaPath, 'utf-8');
			expect(schemaContent).toContain('z.array(z.string())');

			// Check consumer component has {#each} loop
			const consumerPath = path.join(testDir, 'src/lib/regions/tag-list/TagListRegion.svelte');
			const consumerContent = await fs.readFile(consumerPath, 'utf-8');
			expect(consumerContent).toContain('{#each typedData.tags as item}');
		});

		it('generates array fields with TypeScript-only', async () => {
			await execAsync(
				`npx tsx ${cliPath} add score-list`,
				{
					cwd: testDir,
					env: {
						...process.env,
						TEST_STRATEGY: 'load-function',
						TEST_VALIDATOR: 'none',
						TEST_FIELDS: JSON.stringify([
							{ name: 'scores', type: 'array', itemType: 'number', optional: false }
						]),
						TEST_SERVER_ONLY: 'false',
						TEST_EXAMPLE_PATH: 'src/routes/example'
					}
				}
			);

			// Check type file has TypeScript array syntax (PascalCase + Data filename)
			const typePath = path.join(testDir, 'src/lib/regions/score-list/ScoreListData.ts');
			const typeContent = await fs.readFile(typePath, 'utf-8');
			expect(typeContent).toContain('scores: number[];');

			// Check consumer component has {#each} loop
			const consumerPath = path.join(testDir, 'src/lib/regions/score-list/ScoreListRegion.svelte');
			const consumerContent = await fs.readFile(consumerPath, 'utf-8');
			expect(consumerContent).toContain('{#each typedData.scores as item}');
		});
	});
});
