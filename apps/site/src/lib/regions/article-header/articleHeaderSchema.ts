import type { RegionSchema } from '@sveltopia/regions';

export interface ArticleHeaderData {
  title: string;
  description: string;
}

export const articleHeaderSchema = {
  parse: (data: unknown) => data as ArticleHeaderData
} satisfies RegionSchema<ArticleHeaderData>;
