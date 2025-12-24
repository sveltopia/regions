import * as v from 'valibot';
import { valibot } from '@sveltopia/regions';

const _breadcrumbsSchema = v.pipe(
  v.array(
    v.object({
      label: v.string(),
      href: v.string()
    })
  )
);

export type BreadcrumbsData = v.InferOutput<typeof _breadcrumbsSchema>;

export const breadcrumbsSchema = valibot<BreadcrumbsData>(_breadcrumbsSchema, v.parse);
