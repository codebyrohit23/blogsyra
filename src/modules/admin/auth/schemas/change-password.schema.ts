import { passwordSchema, zTrimmedStringSchema } from '@/shared/schemas';
import { JWT_REGEX } from '@/shared/utils';

import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().trim().min(1, 'Current Password is required'),

    password: passwordSchema,

    confirmPassword: z.string().trim().min(1, 'Confirm Password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
