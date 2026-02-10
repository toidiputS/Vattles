
import { z } from 'zod';
import { zId, zISODate } from '../utils/z';

export const CommentId = zId('commentId');

export const Comment = z.object({
  id: CommentId,
  bookId: zId('bookId'),
  authorUserId: zId('userId'),
  body: z.string().min(1),
  createdAt: zISODate,
  editedAt: zISODate.optional(),
  replies: z.array(z.lazy(() => Comment)).default([]),
  upvotes: z.number().int().nonnegative().default(0),
  flags: z.array(z.string()).default([]),
});
export type Comment = z.infer<typeof Comment>;

export const ModerationAction = z.object({
  id: zId('modActionId'),
  targetCommentId: CommentId.optional(),
  targetBookId: zId('bookId').optional(),
  actorUserId: zId('userId'),
  reason: z.string(),
  createdAt: zISODate,
  action: z.enum(['hide', 'delete', 'warn', 'ban']),
});
export type ModerationAction = z.infer<typeof ModerationAction>;
