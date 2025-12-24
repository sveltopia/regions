import type { FieldDefinition } from './schema.js';
import { toCamelCase, toPascalCase } from '../utils/files.js';

/**
 * Generates a Svelte wrapper component (data setter for component wrapper strategy).
 *
 * This component automatically calls useLayoutRegions() when mounted,
 * making it easy for users to set region data without boilerplate.
 *
 * Example usage (generated component):
 *   <PageHeader title="My Page" description="Welcome!" />
 *
 * Instead of user writing:
 *   useLayoutRegions(() => ({ pageHeader: { title: "My Page", description: "Welcome!" } }))
 */
export function generateWrapperComponent(
	regionName: string,
	fields: FieldDefinition[],
	validator?: 'valibot' | 'zod'
): string {
	const schemaName = `${toCamelCase(regionName)}Schema`;
	const typeName = `${toPascalCase(regionName)}Data`;
	const regionKey = toCamelCase(regionName);

	// Generate props destructuring: { title, description }
	const propsDestructure = fields.map((f) => f.name).join(', ');

	// Determine where to import the type from
	// With validator: type is in schema file (e.g., catalogHeaderSchema.ts)
	// Without validator (TS-only): type is in separate file (e.g., CatalogHeaderData.ts)
	const typeImport = validator
		? `import type { ${typeName} } from './${schemaName}';`
		: `import type { ${typeName} } from './${typeName}';`;

	return `<script lang="ts">
  import { useLayoutRegions } from '@sveltopia/regions';
  ${typeImport}

  let { ${propsDestructure} }: ${typeName} = $props();

  useLayoutRegions(() => ({
    ${regionKey}: { ${propsDestructure} }
  }));
</script>

<!-- This component automatically sets the '${regionName}' region when mounted -->
`;
}

/**
 * Generates layout consumer component (for ALL strategies).
 *
 * This is what goes in +layout.svelte to actually display the region.
 *
 * For snippet strategy:
 * - Receives a Snippet from the page component
 * - Uses simple schema to cast to Snippet<[]>
 * - Renders it directly with {@render snippet()}
 *
 * For load function and component wrapper strategies:
 * - Receives data object from page load() or wrapper component
 * - With validator: imports schema for runtime validation
 * - Without validator (TS-only): imports just the type, no schema prop
 */
export function generateLayoutConsumer(
	regionName: string,
	fields: FieldDefinition[],
	strategy?: 'snippet' | 'load-function' | 'page-component',
	validator?: 'valibot' | 'zod'
): string {
	const regionKey = toCamelCase(regionName);
	const schemaName = `${toCamelCase(regionName)}Schema`;
	const typeName = `${toPascalCase(regionName)}Data`;

	// For snippet strategy, generate Snippet<[]> pattern
	if (strategy === 'snippet') {
		return `<script lang="ts">
  import { LayoutRegion } from '@sveltopia/regions';
  import type { Snippet } from 'svelte';

  // Simple schema for snippets (no runtime validation needed)
  const ${schemaName} = {
    parse: (data: unknown) => data as Snippet<[]>
  };
</script>

<LayoutRegion name="${regionKey}" schema={${schemaName}}>
  {#snippet children(data: Record<string, unknown> | undefined)}
    {@const snippetContent = data as unknown as Snippet<[]>}
    {@render snippetContent()}
  {/snippet}
</LayoutRegion>
`;
	}

	// Generate minimal rendering logic
	const requiredFields = fields.filter((f) => !f.optional);
	const optionalFields = fields.filter((f) => f.optional);

	let renderingLogic = '    <!-- Insert your UI here -->\n';

	// Required fields (show naked expressions or each loops for arrays)
	requiredFields.forEach((field) => {
		if (field.type === 'array') {
			renderingLogic += `    {#each typedData.${field.name} as item}\n`;
			renderingLogic += `      {item}\n`;
			renderingLogic += `    {/each}\n`;
		} else {
			renderingLogic += `    {typedData.${field.name}}\n`;
		}
	});

	// Optional fields (show conditional rendering or each loops for arrays)
	optionalFields.forEach((field) => {
		if (field.type === 'array') {
			renderingLogic += `    {#if typedData.${field.name}}\n`;
			renderingLogic += `      {#each typedData.${field.name} as item}\n`;
			renderingLogic += `        {item}\n`;
			renderingLogic += `      {/each}\n`;
			renderingLogic += `    {/if}\n`;
		} else {
			renderingLogic += `    {#if typedData.${field.name}}\n`;
			renderingLogic += `      {typedData.${field.name}}\n`;
			renderingLogic += `    {/if}\n`;
		}
	});

	// TypeScript-only: no schema, just type import
	if (!validator) {
		return `<script lang="ts">
  import { LayoutRegion } from '@sveltopia/regions';
  import type { ${typeName} } from './${typeName}';
</script>

<LayoutRegion name="${regionKey}">
  {#snippet fallback()}
    <!-- Renders when no data is provided for this region -->
    <!-- Remove this fallback if you want nothing to render when data is missing -->
  {/snippet}

  {#snippet children(data: Record<string, unknown> | undefined)}
    {@const typedData = data as unknown as ${typeName}}
${renderingLogic.trimEnd()}
  {/snippet}
</LayoutRegion>
`;
	}

	// Valibot/Zod: import schema for runtime validation
	return `<script lang="ts">
  import { LayoutRegion } from '@sveltopia/regions';
  import { ${schemaName}, type ${typeName} } from './${schemaName}';
</script>

<LayoutRegion name="${regionKey}" schema={${schemaName}}>
  {#snippet fallback()}
    <!-- Renders when no data is provided for this region -->
    <!-- Remove this fallback if you want nothing to render when data is missing -->
  {/snippet}

  {#snippet children(data: Record<string, unknown> | undefined)}
    {@const typedData = data as unknown as ${typeName}}
${renderingLogic.trimEnd()}
  {/snippet}
</LayoutRegion>
`;
}
