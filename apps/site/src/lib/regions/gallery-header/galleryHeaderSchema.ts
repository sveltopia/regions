import { z } from 'zod';
import type { RegionSchema } from '@sveltopia/regions';

const _galleryHeaderSchema = z.object({
  galleryTitle: z.string(),
  imageCount: z.number()
});

export type GalleryHeaderData = z.infer<typeof _galleryHeaderSchema>;

export const galleryHeaderSchema = _galleryHeaderSchema satisfies RegionSchema<GalleryHeaderData>;
