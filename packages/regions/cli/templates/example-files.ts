import { toCamelCase, toPascalCase } from '../utils/files.js';
import type { FieldDefinition } from './schema.js';

/**
 * Generates +layout.svelte file for data-based strategies (load-function, page-component).
 * Imports and renders the region consumer component.
 */
export function generateExampleLayout(
	regionName: string
): string {
	const consumerName = `${toPascalCase(regionName)}Region`;

	return `<script lang="ts">
  import ${consumerName} from '$lib/regions/${regionName}/${consumerName}.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<!-- Region consumer: displays the ${regionName} region content -->
<${consumerName} />

<!-- Page content -->
{@render children()}
`;
}

/**
 * Generates +layout.svelte file for snippet strategy.
 * Creates inline schema and renders snippet with {@render}.
 */
export function generateSnippetExampleLayout(
	regionName: string
): string {
	const regionKey = toCamelCase(regionName);
	const schemaName = `${regionKey}Schema`;

	return `<script lang="ts">
  import { LayoutRegion } from '@sveltopia/regions';
  import type { Snippet } from 'svelte';

  // Simple schema for snippets (no runtime validation needed)
  const ${schemaName} = {
    parse: (data: unknown) => data as Snippet<[]>
  };

  let { children }: { children: Snippet } = $props();
</script>

<LayoutRegion name="${regionKey}" schema={${schemaName}}>
  {#snippet children(data: Record<string, unknown> | undefined)}
    {@const snippetContent = data as unknown as Snippet<[]>}
    {@render snippetContent()}
  {/snippet}
</LayoutRegion>

{@render children()}
`;
}

/**
 * Generates +page.svelte for snippet strategy.
 * Shows how to use useLayoutRegions() with a snippet.
 * Snippets have full access to page state - no field definitions needed!
 */
export function generateSnippetExamplePage(
	regionName: string
): string {
	const regionKey = toCamelCase(regionName);
	const snippetName = `${regionKey}Snippet`;

	return `<script lang="ts">
  import { useLayoutRegions } from '@sveltopia/regions';

  // Example reactive state - the snippet can access any page state
  let count = $state(0);

  useLayoutRegions({
    ${regionKey}: ${snippetName}
  });
</script>

{#snippet ${snippetName}()}
  <div>
    <h1>${regionName} Region</h1>
    <p>This snippet has full access to page state and updates reactively.</p>
    <p>Count: {count}</p>
    <button onclick={() => count++}>Increment</button>
  </div>
{/snippet}

<div class="page-content">
  <h2>Page Content</h2>
  <p>This is the page content. The snippet above is rendered in the layout's ${regionName} region.</p>
  <p>Try clicking the button in the region above - it updates reactively!</p>
</div>
`;
}

/**
 * Generates +page.svelte for component wrapper strategy.
 * Shows how to use the wrapper component.
 */
export function generateWrapperExamplePage(
	regionName: string,
	fields: FieldDefinition[]
): string {
	const wrapperName = toPascalCase(regionName);

	// Generate example props based on field types
	const exampleProps = fields.map((f) => {
		if (f.type === 'string') {
			return `${f.name}="Example ${f.name}"`;
		} else if (f.type === 'number') {
			return `${f.name}={42}`;
		} else if (f.type === 'boolean') {
			return `${f.name}={true}`;
		}
		return `${f.name}="Example value"`;
	}).join(' ');

	return `<script lang="ts">
  import ${wrapperName} from '$lib/regions/${regionName}/${wrapperName}.svelte';
</script>

<!-- Use the wrapper component to set region data -->
<${wrapperName} ${exampleProps} />

<div class="page-content">
  <h2>Page Content</h2>
  <p>This is the page content. The wrapper component above sets the ${regionName} region data.</p>
</div>
`;
}
