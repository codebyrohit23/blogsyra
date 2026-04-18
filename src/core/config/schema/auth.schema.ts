import { z } from 'zod';

export const authEnvSchema = z.object({
  JWT_PRIVATE_KEY: z
    .string()
    .min(1, 'PRIVATE_KEY is required')
    .refine((val) => val.includes('BEGIN PRIVATE KEY'), 'PRIVATE_KEY must be a valid PEM'),

  JWT_PUBLIC_KEY: z
    .string()
    .min(1, 'JWT_PUBLIC_KEY is required')
    .refine((val) => val.includes('BEGIN PUBLIC KEY'), 'JWT_PUBLIC_KEY must be a valid PEM'),

  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
});
