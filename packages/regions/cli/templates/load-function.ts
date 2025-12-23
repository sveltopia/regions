import type { FieldDefinition } from './schema.js';
import { toCamelCase } from '../utils/files.js';

/**
 * Generates a SvelteKit load function that returns region data.
 *
 * This creates boilerplate for the SSR/load function strategy where
 * region data comes from the server load function rather than client-side
 * wrapper components.
 *
 * @param regionName - The kebab-case or camelCase name of the region (e.g., 'page-header' or 'pageHeader')
 * @param fields - Array of field definitions for the region
 * @param serverOnly - If true, generates +page.server.ts, otherwise +page.ts
 */
export function generateLoadFunction(
	regionName: string,
	fields: FieldDefinition[],
	serverOnly: boolean
): string {
	const loadType = serverOnly ? 'PageServerLoad' : 'PageLoad';
	const typesImport = './$types';

	// Convert kebab-case to camelCase for the region key
	const regionKey = toCamelCase(regionName);

	// Generate example data object with TODO placeholders
	const exampleData = fields
		.map((field) => {
			let exampleValue = '';
			if (field.type === 'string') {
				exampleValue = `'TODO: Add ${field.name}'`;
			} else if (field.type === 'number') {
				exampleValue = '0';
			} else if (field.type === 'boolean') {
				exampleValue = 'false';
			}
			return `        ${field.name}: ${exampleValue}`;
		})
		.join(',\n');

	return `import type { ${loadType} } from '${typesImport}';

export const load: ${loadType} = async () => {
  return {
    regions: {
      ${regionKey}: {
${exampleData}
      }
    }
  };
};
`;
}
