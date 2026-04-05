import { DEFAULT_TIMEZONE, Platform } from '@/shared/constants';
import { emailSchema, passwordSchema, zTrimmedStringSchema } from '@/shared/schemas';
import { isValidTimezone } from '@/shared/utils';

import { z } from 'zod';

export const loginSchema = z.object({
  email: emailSchema,

  password: passwordSchema,

  deviceId: zTrimmedStringSchema(16, 128, 'Device ID must be between 16 and 128 characters'),

  platform: z.nativeEnum(Platform, {
    invalid_type_error: `Platform must be one of: ${Object.values(Platform).join(', ')}`,
  }),

  fcmToken: zTrimmedStringSchema(100, 255, 'FCM token must be a valid Firebase token'),

  timeZone: zTrimmedStringSchema(1, 255)
    .default(DEFAULT_TIMEZONE)
    .refine((tz) => isValidTimezone(tz), {
      message: 'Invalid timezone. Must be a valid IANA timezone (e.g., "UTC", "Asia/Kolkata")',
    }),
});

export type LoginDto = z.infer<typeof loginSchema>;
