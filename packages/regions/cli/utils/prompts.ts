import { text, select, confirm } from '@clack/prompts';
import { existsSync } from 'fs';
import { join } from 'path';
import type { FieldDefinition } from '../templates/schema.js';

export type RegionStrategy = 'load-function' | 'page-component' | 'snippet';

/**
 * Prompts the user to choose which region strategy to use.
 *
 * Strategies:
 * - Load function: Server-side data via load(), best for SEO and zero layout shift
 * - Component wrapper: Client-side wrapper component, simple and fast
 * - Snippet: Inline snippet with full page context access, maximum flexibility
 */
export async function promptForStrategy(): Promise<RegionStrategy> {
	const strategy = await select({
		message: 'What strategy would you like to use?',
		options: [
			{
				value: 'load-function',
				label: 'Load function (+page.server.ts) - Recommended for SEO, no layout shift',
				hint: 'Server-side data, zero flash'
			},
			{
				value: 'page-component',
				label: 'Component wrapper (useLayoutRegions) - Simple, client-side',
				hint: 'Easy to use wrapper component'
			},
			{
				value: 'snippet',
				label: 'Snippet region - Advanced, full reactivity',
				hint: 'Maximum flexibility, inline in page'
			}
		]
	});

	if (typeof strategy === 'symbol') {
		process.exit(0);
	}

	return strategy as RegionStrategy;
}

/**
 * Prompts whether the load function should be server-only or universal.
 *
 * - +page.server.ts (server-only) - Recommended, runs only on server
 * - +page.ts (universal) - Runs on both server and client
 */
export async function promptForServerSide(): Promise<boolean> {
	const serverOnly = await select({
		message: 'Where should server load run?',
		options: [
			{ value: true, label: '+page.server.ts (server-only, recommended)' },
			{ value: false, label: '+page.ts (universal)' }
		]
	});

	if (typeof serverOnly === 'symbol') {
		process.exit(0);
	}

	return serverOnly as boolean;
}

/**
 * Prompts for the path where the load function should be generated.
 *
 * Allows users to:
 * - Use the default (src/routes/{region-name}-example/)
 * - Provide a custom path to their actual page route
 *
 * Returns the directory path (without filename).
 */
export async function promptForLoadFunctionPath(regionName: string): Promise<string> {
	const defaultPath = `src/routes/${regionName}-example`;

	const loadPath = await text({
		message: 'Where should we generate the load function example?',
		placeholder: defaultPath,
		initialValue: defaultPath,
		validate: (value) => {
			if (!value) return 'Path is required';
			// Basic validation - must start with src/routes
			if (!value.startsWith('src/routes')) {
				return 'Path must be inside src/routes/';
			}
			return undefined;
		}
	});

	if (typeof loadPath === 'symbol') {
		process.exit(0);
	}

	return loadPath;
}

/**
 * Prompts for the path where example files should be generated.
 *
 * Allows users to:
 * - Use the default (src/routes/{region-name}-example/)
 * - Provide a custom path to their actual page route
 *
 * Returns the directory path (without filename).
 */
export async function promptForExamplePath(strategy: RegionStrategy, regionName: string): Promise<string> {
	const defaultPath = `src/routes/${regionName}-example`;
	const strategyLabel = strategy === 'snippet' ? 'snippet' : strategy === 'page-component' ? 'wrapper component' : 'load function';

	const examplePath = await text({
		message: `Where should we generate the ${strategyLabel} example?`,
		placeholder: defaultPath,
		initialValue: defaultPath,
		validate: (value) => {
			if (!value) return 'Path is required';
			// Basic validation - must start with src/routes
			if (!value.startsWith('src/routes')) {
				return 'Path must be inside src/routes/';
			}
			return undefined;
		}
	});

	if (typeof examplePath === 'symbol') {
		process.exit(0);
	}

	return examplePath;
}

/**
 * Prompts the user to define fields for a region.
 *
 * Flow:
 * 1. Ask for comma-separated field names
 * 2. For each field:
 *    - Ask for type (string, number, boolean)
 *    - Ask if it's required (defaults to true for better UX)
 * 3. Return array of FieldDefinition objects
 *
 * Handles Ctrl+C gracefully by checking for symbol return values.
 */
export async function promptForFields(): Promise<FieldDefinition[]> {
	const fields: FieldDefinition[] = [];

	// Step 1: Get comma-separated field names
	const fieldsInput = await text({
		message: 'What fields should this region have? (comma-separated)',
		placeholder: 'title, description, imageUrl'
	});

	// Check for Ctrl+C cancellation
	if (typeof fieldsInput === 'symbol') {
		process.exit(0);
	}

	// Split and trim field names
	const fieldNames = fieldsInput.split(',').map((f) => f.trim());

	// Step 2: For each field, ask about type and if required
	for (const fieldName of fieldNames) {
		// Ask for type
		const fieldType = await select({
			message: `Type for "${fieldName}"?`,
			options: [
				{ value: 'string', label: 'string' },
				{ value: 'number', label: 'number' },
				{ value: 'boolean', label: 'boolean' },
				{ value: 'array', label: 'array' }
			]
		});

		// Check for cancellation
		if (typeof fieldType === 'symbol') {
			process.exit(0);
		}

		// If array, ask for item type
		let itemType: 'string' | 'number' | 'boolean' | undefined;
		if (fieldType === 'array') {
			const arrayItemType = await select({
				message: `"${fieldName}" is an array. What type are the array items?`,
				options: [
					{ value: 'string', label: 'string' },
					{ value: 'number', label: 'number' },
					{ value: 'boolean', label: 'boolean' }
				]
			});

			// Check for cancellation
			if (typeof arrayItemType === 'symbol') {
				process.exit(0);
			}

			itemType = arrayItemType as 'string' | 'number' | 'boolean';
		}

		// Ask if required (inverse of optional for clearer UX)
		const isRequired = await confirm({
			message: `Is "${fieldName}" required?`,
			initialValue: true
		});

		// Check for cancellation
		if (typeof isRequired === 'symbol') {
			process.exit(0);
		}

		// Add to fields array (invert required back to optional for internal use)
		fields.push({
			name: fieldName,
			type: fieldType as 'string' | 'number' | 'boolean' | 'array',
			optional: !isRequired,
			itemType
		});
	}

	return fields;
}

/**
 * Prompts the user to choose a validation library.
 *
 * Options:
 * - None (TypeScript only - no runtime validation)
 * - Valibot (recommended - smaller bundle size)
 * - Zod (more popular, larger API surface)
 *
 * Returns 'none', 'valibot', or 'zod'.
 */
export async function promptForValidator(): Promise<'none' | 'valibot' | 'zod'> {
	const validator = await select({
		message: 'Which validator would you like to use?',
		options: [
			{ value: 'none', label: 'None (TypeScript only - no runtime validation)', hint: 'Smallest bundle' },
			{ value: 'valibot', label: 'Valibot (recommended - smaller bundle)' },
			{ value: 'zod', label: 'Zod' }
		]
	});

	// Check for cancellation
	if (typeof validator === 'symbol') {
		process.exit(0);
	}

	return validator as 'none' | 'valibot' | 'zod';
}

/**
 * Prompts the user whether to generate a wrapper component.
 *
 * Default: true (recommended for most use cases)
 *
 * If false, only the schema will be generated, and users will need to
 * call useLayoutRegions() manually.
 */
export async function promptForComponent(): Promise<boolean> {
	const shouldGenerate = await confirm({
		message: 'Generate wrapper component?',
		initialValue: true
	});

	// Check for cancellation
	if (typeof shouldGenerate === 'symbol') {
		process.exit(0);
	}

	return shouldGenerate;
}

/**
 * Prompts the user for the output directory path.
 *
 * Auto-detects project structure:
 * - Checks if `src/` directory exists
 * - Defaults to `src/lib/regions/{regionName}` or `lib/regions/{regionName}`
 *
 * Users can customize the path if they want a different location.
 */
export async function promptForOutputPath(regionName: string): Promise<string> {
	// Detect project structure
	const cwd = process.cwd();
	const srcDir = existsSync(join(cwd, 'src')) ? 'src' : '.';
	const defaultPath = join(srcDir, 'lib', 'regions', regionName);

	const outputPath = await text({
		message: 'Where should we generate the files?',
		placeholder: defaultPath,
		initialValue: defaultPath,
		validate: (value) => {
			if (!value) return 'Path is required';
			return undefined;
		}
	});

	// Check for cancellation
	if (typeof outputPath === 'symbol') {
		process.exit(0);
	}

	return outputPath;
}
