import * as v from 'valibot';
import { valibot } from '@sveltopia/regions';

const _sidebarSchema = v.pipe(
  v.object({
    items: v.array(v.string())
  })
);

export type SidebarData = v.InferOutput<typeof _sidebarSchema>;

export const sidebarSchema = valibot<SidebarData>(_sidebarSchema, v.parse);
