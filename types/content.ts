
import { z } from 'zod';
import { zId, zISODate, zSlug, zUrl } from '../utils/z';

export const BookType = z.enum([
  'review',
  'tutorial',
  'portfolio',
  'short-story',
  'novel',
  'reference',
  'notes',
]);
export type BookType = z.infer<typeof BookType>;

export const RichBlock = z.object({
  type: z.enum(['paragraph', 'image', 'code', 'quote', 'heading']),
  content: z.record(z.string(), z.any()),
});
export type RichBlock = z.infer<typeof RichBlock>;

export const Chapter = z.object({
  id: zSlug,
  title: z.string(),
  order: z.number().int().nonnegative(),
  blocks: z.array(RichBlock).default([]),
});
export type Chapter = z.infer<typeof Chapter>;

export const Book = z.object({
  id: zId('bookId'),
  type: BookType,
  title: z.string(),
  subtitle: z.string().optional(),
  coverUrl: zUrl.optional(),
  authorUserId: zId('userId').optional(),
  summary: z.string().max(2000).optional(),
  chapters: z.array(Chapter).default([]),
  createdAt: zISODate,
  updatedAt: zISODate,
  meta: z.record(z.string(), z.any()).default({}),
});
export type Book = z.infer<typeof Book>;
