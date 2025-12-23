import { toCamelCase } from '../utils/files.js';

/**
 * Generates snippet boilerplate for the snippet region strategy.
 *
 * Unlike other strategies, this doesn't create separate files.
 * Instead, it outputs boilerplate code that users copy/paste into
 * their +page.svelte file.
 *
 * Snippets have full access to page state, props, and context,
 * making them ideal for highly interactive/reactive UI.
 *
 * @param regionName - The kebab-case or camelCase name of the region (e.g., 'page-header' or 'pageHeader')
 */
export function generateSnippetBoilerplate(regionName: string): string {
	// Convert kebab-case to camelCase for both region key and snippet name
	const regionKey = toCamelCase(regionName);
	const snippetName = regionKey + 'Snippet';

	return `<script lang="ts">
  import { useLayoutRegions } from '@sveltopia/regions';

  useLayoutRegions({
    ${regionKey}: ${snippetName}
  });
</script>

{#snippet ${snippetName}()}
  <!-- TODO: Add your ${regionName} UI here -->
  <!-- You have full access to page state, props, and context -->
  <div>
    <h1>Your content here</h1>
  </div>
{/snippet}
`;
}
