import * as v from 'valibot';
import type { RegionSchema } from '@sveltopia/regions';

const _catalogHeaderSchema = v.pipe(
  v.object({
    catalogName: v.string(),
    itemCount: v.number()
  })
);

export type CatalogHeaderData = v.InferOutput<typeof _catalogHeaderSchema>;

export const catalogHeaderSchema = {
  parse: (data: unknown) => v.parse(_catalogHeaderSchema, data)
} satisfies RegionSchema<CatalogHeaderData>;
