import { z } from 'zod';

export const authEnvSchema = z.object({
  BCRYPT_SALT_ROUNDS: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 10 && val <= 15, {
      message: 'Salt rounds should be between 10 and 15',
    })
    .default(12),
});
