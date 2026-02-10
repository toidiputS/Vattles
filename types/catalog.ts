
import { z } from 'zod';
import { zId, zSlug } from '../utils/z';

export const CatalogId = zId('catalogId');

export const Classification = z.object({
  code: zSlug, // e.g., "005.1-ts"
  label: z.string(), // e.g., "Programming/TypeScript"
  path: z.array(zSlug), // hierarchy path
});
export type Classification = z.infer<typeof Classification>;

export const Tag = zSlug;

export const CatalogEntry = z.object({
  id: CatalogId,
  bookId: zId('bookId'),
  title: z.string(),
  author: z.string().optional(),
  tags: z.array(Tag).default([]),
  classification: Classification,
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
  popularity: z.number().nonnegative().default(0), // backing for trending
});
export type CatalogEntry = z.infer<typeof CatalogEntry>;
