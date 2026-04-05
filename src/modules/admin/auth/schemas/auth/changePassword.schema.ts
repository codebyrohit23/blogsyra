import { PASSWORD_REGEX } from '@/shared/utils';
import { z } from 'zod';

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(PASSWORD_REGEX, 'Password must be at least 8 characters'),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
