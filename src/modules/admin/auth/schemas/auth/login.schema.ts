import { emailSchema, passwordSchema, zTrimmedStringSchema } from '@/shared/schemas';
import { z } from 'zod';
import { AdminDeviceEnum } from '../../../admin-session';

export const loginSchema = z.object({
  email: emailSchema,

  password: passwordSchema,

  deviceId: zTrimmedStringSchema(16, 128, 'Device ID must be between 16 and 128 characters'),

  deviceType: z.nativeEnum(AdminDeviceEnum, {
    required_error: 'Device type is required',
    invalid_type_error: `Device type must be one of: ${Object.values(AdminDeviceEnum).join(', ')}`,
  }),

  fcmToken: zTrimmedStringSchema(100, 255, 'FCM token must be a valid Firebase token'),
});

export type LoginRequest = z.infer<typeof loginSchema>;
