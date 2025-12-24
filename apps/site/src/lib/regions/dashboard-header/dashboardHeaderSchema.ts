import * as v from 'valibot';
import type { RegionSchema } from '@sveltopia/regions';

const _dashboardHeaderSchema = v.pipe(
  v.object({
    title: v.string(),
    userCount: v.number(),
    isLive: v.boolean()
  })
);

export type DashboardHeaderData = v.InferOutput<typeof _dashboardHeaderSchema>;

export const dashboardHeaderSchema = {
  parse: (data: unknown) => v.parse(_dashboardHeaderSchema, data)
} satisfies RegionSchema<DashboardHeaderData>;
