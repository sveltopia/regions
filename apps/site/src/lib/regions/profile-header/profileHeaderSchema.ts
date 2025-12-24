import type { RegionSchema } from '@sveltopia/regions';

export interface ProfileHeaderData {
  username: string;
  bio: string;
}

export const profileHeaderSchema = {
  parse: (data: unknown) => data as ProfileHeaderData
} satisfies RegionSchema<ProfileHeaderData>;
