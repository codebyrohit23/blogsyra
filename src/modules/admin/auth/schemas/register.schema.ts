import { DEFAULT_TIMEZONE, Platform } from '@/shared/constants';
import { emailSchema, passwordSchema, zTrimmedStringSchema } from '@/shared/schemas';
import { isValidTimezone } from '@/shared/utils';

import { z } from 'zod';

export const registerSchema = z
  .object({
    name: zTrimmedStringSchema(2, 50, 'Name must be between 2-50 characters'),

    email: emailSchema,

    password: passwordSchema,

    confirmPassword: z.string().trim().min(1, 'Confirm Password is required'),

    deviceId: zTrimmedStringSchema(16, 128, 'Device ID must be between 16 and 128 characters'),

    platform: z.nativeEnum(Platform, {
      error: `Platform must be one of: ${Object.values(Platform).join(', ')}`,
    }),

    fcmToken: zTrimmedStringSchema(10, 255, 'FCM token must be a valid Firebase token'),

    timeZone: zTrimmedStringSchema(1, 255)
      .default(DEFAULT_TIMEZONE)
      .refine((tz) => isValidTimezone(tz), {
        message: 'Invalid timezone. Must be a valid IANA timezone (e.g., "UTC", "Asia/Kolkata")',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterDto = z.infer<typeof registerSchema>;
