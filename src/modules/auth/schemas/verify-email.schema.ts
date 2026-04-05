import { emailSchema } from '@/shared/schemas';
import { z } from 'zod';

export const verifyEmailSchema = z
  .object({
    email: emailSchema,
  })
  .strict();

export type VerifyEmailDto = z.infer<typeof verifyEmailSchema>;
