
import { z } from 'zod';
import { zId, zISODate, zSlug } from '../utils/z';

export const UserId = zId('userId');
export const BookId = zId('bookId');
export const ShelfId = zId('shelfId');

export const Achievement = z.object({
  id: zSlug,
  title: z.string(),
  description: z.string().optional(),
  earnedAt: zISODate,
});
export type Achievement = z.infer<typeof Achievement>;

export const ReadingEntry = z.object({
  bookId: BookId,
  startedAt: zISODate.optional(),
  finishedAt: zISODate.optional(),
  progress: z.number().min(0).max(1).default(0),
  lastPage: z.number().int().nonnegative().default(0),
});
export type ReadingEntry = z.infer<typeof ReadingEntry>;

export const Profile = z.object({
  userId: UserId,
  displayName: z.string().min(1),
  avatarUrl: z.string().url().optional(),
  tagline: z.string().max(160).optional(),
  createdAt: zISODate,
});
export type Profile = z.infer<typeof Profile>;

export const LibraryCard = z.object({
  userId: UserId,
  achievements: z.array(Achievement).default([]),
  reading: z.array(ReadingEntry).default([]),
  shelves: z.array(ShelfId).default([]),
});
export type LibraryCard = z.infer<typeof LibraryCard>;
