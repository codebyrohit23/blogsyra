import { z } from 'zod';

export const redisEnvSchema = z.object({
  REDIS_HOST: z.string().default('127.0.0.1'),

  REDIS_PORT: z
    .string()
    .default('6379')
    .transform((val) => parseInt(val, 10)),

  REDIS_PASSWORD: z.string().optional(),

  REDIS_DB: z
    .string()
    .default('0')
    .transform((val) => parseInt(val, 10)),

  REDIS_KEY_PREFIX: z.string().optional(),
});
