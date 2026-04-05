import { z } from 'zod';

export const dbEnvSchema = z.object({
  DATABASE_URL: z.string({ message: 'DATABASE_URL must be a valid URL' }),

  TEST_DATABASE_URL: z.string().url().optional(),

  SEED_DATABASE: z
    .string()
    .default('false')
    .transform((val) => val.toLowerCase() === 'true'),
});
