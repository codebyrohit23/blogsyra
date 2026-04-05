import { passwordSchema, zTrimmedStringSchema } from '@/shared/schemas';
import { JWT_REGEX } from '@/shared/utils';

import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    token: zTrimmedStringSchema(100, 100, 'Invalid token').regex(JWT_REGEX, 'Invalid token'),

    password: passwordSchema,

    confirmPassword: z.string().trim().min(1, 'Confirm Password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
