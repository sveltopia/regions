/**
 * Describes a single field in a region schema.
 */
export interface FieldDefinition {
	name: string;
	type: 'string' | 'number' | 'boolean' | 'array';
	optional: boolean;
	itemType?: 'string' | 'number' | 'boolean'; // For array types
}

/**
 * Generates a TypeScript-only type file (no runtime validation).
 *
 * Creates just an interface for compile-time type safety.
 * No schema object is generated since TypeScript-only means "no runtime validation".
 *
 * Users who want runtime validation should use Valibot or Zod.
 */
export function generateTypeOnlySchema(
	regionName: string,
	fields: FieldDefinition[]
): string {
	const typeName = `${toPascalCase(regionName)}Data`;

	// Generate interface fields
	const interfaceFields = fields
		.map((field) => {
			const optionalMarker = field.optional ? '?' : '';
			const fieldType = field.type === 'array' ? `${field.itemType}[]` : field.type;
			return `  ${field.name}${optionalMarker}: ${fieldType};`;
		})
		.join('\n');

	return `/**
 * TypeScript-only type definition (no runtime validation).
 * For runtime validation, regenerate this region with Valibot or Zod.
 */
export interface ${typeName} {
${interfaceFields}
}
`;
}

/**
 * Generates a Valibot validation schema as TypeScript source code.
 *
 * Uses the @sveltopia/regions valibot() helper to reduce boilerplate.
 */
export function generateValibotSchema(
	regionName: string,
	fields: FieldDefinition[]
): string {
	const schemaName = `${toCamelCase(regionName)}Schema`;
	const internalSchemaName = `_${schemaName}`;
	const typeName = `${toPascalCase(regionName)}Data`;

	// Generate field definitions
	// For each field, create either `v.string()` or `v.optional(v.string())`
	const fieldDefinitions = fields
		.map((field) => {
			const baseType = field.type === 'array'
				? `v.array(v.${field.itemType}())`
				: `v.${field.type}()`;
			const finalType = field.optional ? `v.optional(${baseType})` : baseType;
			return `    ${field.name}: ${finalType}`;
		})
		.join(',\n');

	return `import * as v from 'valibot';
import { valibot } from '@sveltopia/regions';

const ${internalSchemaName} = v.pipe(
  v.object({
${fieldDefinitions}
  })
);

export type ${typeName} = v.InferOutput<typeof ${internalSchemaName}>;

export const ${schemaName} = valibot<${typeName}>(${internalSchemaName}, v.parse);
`;
}

/**
 * Generates a Zod validation schema as TypeScript source code.
 *
 * Uses the @sveltopia/regions zod() helper to reduce boilerplate.
 */
export function generateZodSchema(regionName: string, fields: FieldDefinition[]): string {
	const schemaName = `${toCamelCase(regionName)}Schema`;
	const internalSchemaName = `_${schemaName}`;
	const typeName = `${toPascalCase(regionName)}Data`;

	// Generate field definitions
	// For Zod, optional fields use `.optional()` chained at the end
	const fieldDefinitions = fields
		.map((field) => {
			const baseType = field.type === 'array'
				? `z.array(z.${field.itemType}())`
				: `z.${field.type}()`;
			const finalType = field.optional ? `${baseType}.optional()` : baseType;
			return `  ${field.name}: ${finalType}`;
		})
		.join(',\n');

	return `import { z } from 'zod';
import { zod } from '@sveltopia/regions';

const ${internalSchemaName} = z.object({
${fieldDefinitions}
});

export type ${typeName} = z.infer<typeof ${internalSchemaName}>;

export const ${schemaName} = zod<${typeName}>(${internalSchemaName});
`;
}

/**
 * Helper function to convert kebab-case to camelCase.
 * Duplicated here to keep templates self-contained.
 */
function toCamelCase(str: string): string {
	const pascal = str
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('');
	return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Helper function to convert kebab-case to PascalCase.
 * Duplicated here to keep templates self-contained.
 */
function toPascalCase(str: string): string {
	return str
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('');
}
