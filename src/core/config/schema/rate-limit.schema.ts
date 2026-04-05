import { z } from 'zod';

export const rateLimitEnvSchema = z.object({
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('900000'), // default 15 minutes

  RATE_LIMIT_MAX_REQUESTS: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('100'),
});
