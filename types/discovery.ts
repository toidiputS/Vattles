
import { z } from 'zod';
import { zSlug } from '../utils/z';

export const SearchQuery = z.object({
  q: z.string().default(''),
  tags: z.array(zSlug).default([]),
  sort: z.enum(['relevance', 'popularity', 'new']).default('relevance'),
  page: z.number().int().min(1).default(1),
});
export type SearchQuery = z.infer<typeof SearchQuery>;

export const Recommendation = z.object({
  bookId: z.string(),
  reason: z.string(),
  score: z.number().finite(),
});
export type Recommendation = z.infer<typeof Recommendation>;
