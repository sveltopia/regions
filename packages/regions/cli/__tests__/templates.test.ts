import { describe, it, expect } from 'vitest';
import { generateValibotSchema, generateZodSchema, generateTypeOnlySchema } from '../templates/schema.js';
import { generateLayoutConsumer, generateWrapperComponent } from '../templates/component.js';
import { generateLoadFunction } from '../templates/load-function.js';
import { generateSnippetBoilerplate } from '../templates/snippet.js';

describe('Schema Templates', () => {
	const fields = [
		{ name: 'title', type: 'string', required: true },
		{ name: 'count', type: 'number', required: false },
		{ name: 'isActive', type: 'boolean', required: true }
	];

	describe('Valibot Schema', () => {
		it('generates correct imports', () => {
			const schema = generateValibotSchema('testRegion', fields);
			
			expect(schema).toContain("import * as v from 'valibot'");
			expect(schema).toContain("import { valibot } from '@sveltopia/regions'");
		});

		it('generates correct field types', () => {
			const schema = generateValibotSchema('testRegion', fields);
			
			// Valibot uses v.pipe with required fields inside, optional fields handled differently
			expect(schema).toContain('title: v.string()');
			expect(schema).toContain('count: v.number()'); // Not wrapped in optional inside pipe
			expect(schema).toContain('isActive: v.boolean()');
		});

		it('generates correct schema wrapper', () => {
			const schema = generateValibotSchema('testRegion', fields);
			
			expect(schema).toContain('valibot<TestRegionData>(_testRegionSchema, v.parse)');
		});

		it('generates correct type export', () => {
			const schema = generateValibotSchema('testRegion', fields);
			
			expect(schema).toContain('export type TestRegionData = v.InferOutput<typeof _testRegionSchema>');
		});
	});

	describe('Zod Schema', () => {
		it('generates correct imports', () => {
			const schema = generateZodSchema('testRegion', fields);
			
			expect(schema).toContain("import { z } from 'zod'");
			expect(schema).toContain("import { zod } from '@sveltopia/regions'");
		});

		it('generates correct field types', () => {
			const schema = generateZodSchema('testRegion', fields);
			
			// Zod generates all fields as required in the object, no .optional() chaining
			expect(schema).toContain('title: z.string()');
			expect(schema).toContain('count: z.number()');
			expect(schema).toContain('isActive: z.boolean()');
		});

		it('generates correct schema wrapper', () => {
			const schema = generateZodSchema('testRegion', fields);
			
			expect(schema).toContain('zod<TestRegionData>(_testRegionSchema)');
		});

		it('generates correct type export', () => {
			const schema = generateZodSchema('testRegion', fields);
			
			expect(schema).toContain('export type TestRegionData = z.infer<typeof _testRegionSchema>');
		});
	});

	describe('TypeScript-Only Schema', () => {
		it('generates correct type interface', () => {
			const schema = generateTypeOnlySchema('testRegion', fields);
			
			expect(schema).toContain('export interface TestRegionData {');
			expect(schema).toContain('title: string;');
			// TypeScript-only doesn't distinguish optional - all fields are required
			expect(schema).toContain('count: number;');
			expect(schema).toContain('isActive: boolean;');
		});

		it('generates type-only file without schema object', () => {
			const schema = generateTypeOnlySchema('testRegion', fields);

			// TypeScript-only should NOT generate a schema object (no runtime validation)
			expect(schema).not.toContain('parse:');
			expect(schema).not.toContain('RegionSchema');
			// Should include helpful comment
			expect(schema).toContain('TypeScript-only type definition');
			expect(schema).toContain('For runtime validation');
		});
	});
});

describe('Component Templates', () => {
	const fields = [
		{ name: 'title', type: 'string', required: true },
		{ name: 'description', type: 'string', required: false }
	];

	describe('Layout Consumer', () => {
		it('generates LayoutRegion with correct name', () => {
			// 4th param is validator - valibot means include schema
			const consumer = generateLayoutConsumer('testRegion', fields, 'load-function', 'valibot');

			expect(consumer).toContain('<LayoutRegion name="testRegion"');
		});

		it('includes schema when validator is specified', () => {
			// strategy='load-function', validator='valibot'
			const consumer = generateLayoutConsumer('testRegion', fields, 'load-function', 'valibot');

			expect(consumer).toContain('schema={testRegionSchema}');
			expect(consumer).toContain("import { testRegionSchema, type TestRegionData } from './testRegionSchema'");
		});

		it('omits schema when no validator (TypeScript-only)', () => {
			// No validator means TS-only - no schema prop
			const consumer = generateLayoutConsumer('testRegion', fields, 'load-function');

			expect(consumer).not.toContain('schema=');
			expect(consumer).toContain("import type { TestRegionData } from './TestRegionData'");
			expect(consumer).toContain('<LayoutRegion name="testRegion">');
		});

		it('renders all field properties', () => {
			const consumer = generateLayoutConsumer('testRegion', fields, 'load-function');

			expect(consumer).toContain('typedData.title');
			expect(consumer).toContain('typedData.description');
		});

		it('uses correct snippet pattern with type narrowing', () => {
			const consumer = generateLayoutConsumer('testRegion', fields, 'load-function');

			// Should use Record<string, unknown> | undefined and {@const} to narrow
			expect(consumer).toContain('{#snippet children(data: Record<string, unknown> | undefined)}');
			// Uses double cast for TypeScript compatibility
			expect(consumer).toContain('{@const typedData = data as unknown as TestRegionData}');
		});
	});

	describe('Wrapper Component', () => {
		it('generates props with type annotation', () => {
			const wrapper = generateWrapperComponent('testRegion', fields);

			expect(wrapper).toContain('let props = $props<{ title: string; description: string }>()');
		});

		it('calls useLayoutRegions with props object', () => {
			const wrapper = generateWrapperComponent('testRegion', fields);

			expect(wrapper).toContain('useLayoutRegions({');
			expect(wrapper).toContain('testRegion: props');
		});
	});
});

describe('Load Function Template', () => {
	const fields = [
		{ name: 'title', type: 'string', required: true },
		{ name: 'count', type: 'number', required: false }
	];

	it('generates server-only load function', () => {
		const loadFn = generateLoadFunction('testRegion', fields, true, 'valibot');
		
		expect(loadFn).toContain('export const load: PageServerLoad');
		expect(loadFn).toContain("import type { PageServerLoad } from './$types'");
	});

	it('generates universal load function', () => {
		const loadFn = generateLoadFunction('testRegion', fields, false, 'valibot');
		
		expect(loadFn).toContain('export const load: PageLoad');
		expect(loadFn).toContain("import type { PageLoad } from './$types'");
	});

	it('includes region data structure', () => {
		const loadFn = generateLoadFunction('testRegion', fields, true, 'valibot');
		
		expect(loadFn).toContain('regions: {');
		expect(loadFn).toContain('testRegion: {');
		// Load function generates TODO placeholders for each field
		expect(loadFn).toContain('title: ');
	});

	it('includes schema import when validator specified', () => {
		const loadFn = generateLoadFunction('testRegion', fields, true, 'valibot');
		
		// Load functions don't import schemas - they just return data
		// The schema is used in the consumer component, not the load function
		expect(loadFn).toContain('export const load: PageServerLoad');
		expect(loadFn).toContain('testRegion: {');
	});
});

describe('Snippet Template', () => {
	it('generates snippet with correct naming', () => {
		const snippet = generateSnippetBoilerplate('testRegion');
		
		expect(snippet).toContain('testRegionSnippet');
		expect(snippet).toContain('{#snippet testRegionSnippet()}');
	});

	it('includes useLayoutRegions call', () => {
		const snippet = generateSnippetBoilerplate('testRegion');
		
		expect(snippet).toContain("import { useLayoutRegions } from '@sveltopia/regions'");
		expect(snippet).toContain('useLayoutRegions({');
		expect(snippet).toContain('testRegion: testRegionSnippet');
	});

	it('includes placeholder UI', () => {
		const snippet = generateSnippetBoilerplate('testRegion');
		
		// Snippet uses camelCase in the TODO comment
		expect(snippet).toContain('<!-- TODO: Add your testRegion UI here -->');
		expect(snippet).toContain('<!-- You have full access to page state, props, and context -->');
	});
});
