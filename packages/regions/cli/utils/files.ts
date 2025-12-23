import fs from 'fs';
import path from 'path';

/**
 * Ensures a directory exists, creating it (and any parent directories) if needed.
 * Uses recursive: true so it won't fail if the directory already exists.
 */
export async function ensureDirectory(dirPath: string): Promise<void> {
	await fs.promises.mkdir(dirPath, { recursive: true });
}

/**
 * Writes content to a file, ensuring the parent directory exists first.
 * This prevents "ENOENT: no such file or directory" errors.
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
	// Ensure parent directory exists
	await ensureDirectory(path.dirname(filePath));
	// Write file with UTF-8 encoding (important for TypeScript/Svelte files)
	await fs.promises.writeFile(filePath, content, 'utf-8');
}

/**
 * Checks if a file exists without throwing an error.
 * Useful for preventing overwrites or checking for existing files.
 */
export async function fileExists(filePath: string): Promise<boolean> {
	try {
		await fs.promises.access(filePath);
		return true;
	} catch {
		return false;
	}
}

/**
 * Converts a string to kebab-case.
 * Examples:
 *   "PageHeader" -> "page-header"
 *   "pageHeader" -> "page-header"
 *
 * Used for file names and region names (kebab-case is the standard for files).
 */
export function toKebabCase(str: string): string {
	return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Converts a kebab-case string to camelCase.
 * Examples:
 *   "page-header" -> "pageHeader"
 *   "simple-name" -> "simpleName"
 *
 * Used for variable names (like schema names).
 */
export function toCamelCase(str: string): string {
	const pascal = str
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join('');
	// Convert first character to lowercase
	return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Converts a kebab-case string to PascalCase.
 * Examples:
 *   "page-header" -> "PageHeader"
 *   "simple-name" -> "SimpleName"
 *
 * Used for component names and TypeScript type names.
 */
export function toPascalCase(str: string): string {
	return str
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join('');
}

/**
 * Normalizes a region name to kebab-case, accepting both camelCase and kebab-case input.
 * Examples:
 *   "pageHeader" -> "page-header"
 *   "page-header" -> "page-header"
 *   "PageHeader" -> "page-header"
 *
 * Used in CLI to accept flexible input formats from users.
 */
export function normalizeRegionName(str: string): string {
	// If already in kebab-case, return as-is
	if (str.includes('-')) {
		return str.toLowerCase();
	}
	// Convert camelCase/PascalCase to kebab-case
	return toKebabCase(str);
}
