import * as v from 'valibot';
import { valibot } from '@sveltopia/regions';

const _pageHeaderSchema = v.pipe(
  v.object({
    title: v.string(),
    description: v.optional(v.string())
  })
);

export type PageHeaderData = v.InferOutput<typeof _pageHeaderSchema>;

export const pageHeaderSchema = valibot<PageHeaderData>(_pageHeaderSchema, v.parse);
