import { emailSchema } from '@/shared/schemas';

import { z } from 'zod';

export const forgotPasswordSchema = z
  .object({
    email: emailSchema,
  })
  .strict();

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
