import type { RegionSchema } from "../types";

/**
 * Wrap a Valibot schema for use with @sveltopia/regions.
 * Reduces boilerplate from 5 lines to 3 lines.
 *
 * IMPORTANT: You must pass v.parse as the second argument.
 *
 * @example
 * ```typescript
 * import * as v from 'valibot';
 * import { valibot } from '@sveltopia/regions';
 *
 * const _schema = v.object({ title: v.string() });
 * export type Data = v.InferOutput<typeof _schema>;
 * export const schema = valibot<Data>(_schema, v.parse);
 * ```
 *
 * @param schema - The Valibot schema to wrap
 * @param parse - The v.parse function from valibot
 * @returns A RegionSchema compatible with LayoutRegion
 */
export function valibot<T>(schema: any, parse: (schema: any, data: unknown) => T): RegionSchema<T> {
  return {
    parse: (data: unknown) => parse(schema, data),
  };
}

/**
 * Wrap a Zod schema for use with @sveltopia/regions.
 * Reduces boilerplate from 5 lines to 3 lines.
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { zod } from '@sveltopia/regions';
 *
 * const _schema = z.object({ title: z.string() });
 * export type Data = z.infer<typeof _schema>;
 * export const schema = zod<Data>(_schema);
 * ```
 *
 * @param schema - The Zod schema to wrap
 * @returns A RegionSchema compatible with LayoutRegion
 */
export function zod<T>(schema: any): RegionSchema<T> {
  // Zod schemas already have a .parse() method with the correct signature
  // We just need to ensure it matches our RegionSchema interface
  return schema;
}
