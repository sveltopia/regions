import type { RegionSchema } from '@sveltopia/regions';

export interface SettingsHeaderData {
  title: string;
  description: string;
}

export const settingsHeaderSchema = {
  parse: (data: unknown) => data as SettingsHeaderData
} satisfies RegionSchema<SettingsHeaderData>;
