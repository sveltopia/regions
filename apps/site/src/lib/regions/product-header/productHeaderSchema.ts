import { z } from 'zod';
import type { RegionSchema } from '@sveltopia/regions';

const _productHeaderSchema = z.object({
  productName: z.string(),
  price: z.number(),
  inStock: z.boolean()
});

export type ProductHeaderData = z.infer<typeof _productHeaderSchema>;

export const productHeaderSchema = _productHeaderSchema satisfies RegionSchema<ProductHeaderData>;
