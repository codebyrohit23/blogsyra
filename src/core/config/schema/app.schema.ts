import { Environment } from '@/shared/constants';
import { ALPHANUMERIC_UNDERSCORE_HYPHEN_REGEX } from '@/shared/utils';

import { z } from 'zod';

export const appEnvSchema = z.object({
  NODE_ENV: z.nativeEnum(Environment).default(Environment.DEVELOPEMENT),

  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 1 && val < 65535, {
      message: 'Port must be between 1 and 65535',
    })
    .default(3000),

  APP_NAME: z
    .string()
    .min(3, 'App name must be at least 3 characters long')
    .max(50, 'App name must not exceed 50 characters')
    .regex(ALPHANUMERIC_UNDERSCORE_HYPHEN_REGEX, {
      message: 'App name can only contain letters, numbers, dashes, and underscores',
    }),

  API_BASE_URL: z.string(''),

  CORS_ORIGIN: z
    .string()
    .default('*')
    .transform((val) => (val === '*' ? val : val.split(',').map((o) => o.trim()))),
});
