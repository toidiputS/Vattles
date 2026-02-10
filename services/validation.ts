
import { ZodSchema, ZodError } from 'zod';

export function safeParse<T>(
  schema: ZodSchema<T>,
  data: unknown
): { ok: true; data: T } | { ok: false; error: string } {
  const res = schema.safeParse(data);
  if (res.success) {
    return { ok: true, data: res.data };
  }
  return { ok: false, error: res.error.flatten().formErrors.join('; ') };
}
