import { zTrimmedStringSchema } from '@/shared/schemas';
import { JWT_REGEX } from '@/shared/utils';

import { z } from 'zod';

export const refreshSchema = z
  .object({
    refreshToken: z
      .string()
      .trim()
      .min(1, 'Refresh token required')
      .regex(JWT_REGEX, 'Invalid token'),
  })
  .strict();

export type RefreshDto = z.infer<typeof refreshSchema>;
