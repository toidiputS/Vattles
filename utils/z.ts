
import { z } from 'zod';

export const zId = (label = 'id') => z.string().min(1, `${label} required`).brand(label);

export const zISODate = z.string().datetime({ offset: true });

export const zTimestampMs = z.number().int().nonnegative();

export const zSlug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug-kebab-case');

export const zNonEmptyStr = (label = 'value') => z.string().min(1, `${label} required`);

export const zUrl = z.string().url();

export const zJSON = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.lazy(() => z.array(zJSON)),
  z.lazy(() => z.record(z.string(), zJSON)),
]);
