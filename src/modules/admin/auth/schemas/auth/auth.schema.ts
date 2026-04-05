// import { passwordRegex, usernameRegex } from '@/common/utils/regex.js';
// import { z } from 'zod';

// import { AdminDeviceEnum } from '../adminDeviceSession/index.js';

// export const adminLoginSchema = z.object({
//   identifier: z
//     .string()
//     .min(1, 'Email or username is required')
//     .max(100, 'Identifier cannot exceed 100 characters')
//     .refine((val) => {
//       const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
//       const isUsername = usernameRegex.test(val);
//       return isEmail || isUsername;
//     }, 'Must be a valid email or username'),

//   password: z
//     .string()
//     .min(1, 'Password is required')
//     .max(64, 'Password cannot exceed 64 characters'),

//   deviceId: z
//     .string({ required_error: 'Device ID is required' })
//     .min(3, 'Device ID must be at least 3 characters long'),

//   deviceType: z.nativeEnum(AdminDeviceEnum, {
//     required_error: 'Device type is required',
//     invalid_type_error: 'Device type must be a valid AdminDeviceType',
//   }),

//   fcmToken: z
//     .string({ required_error: 'FCM token is required' })
//     .min(10, 'FCM token must be valid'),
// });

// export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
