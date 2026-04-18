// import { REDIS_TTL } from '@/shared/constants';
// import { z } from 'zod';

// export const tokenEnvSchema = z.object({
//   // TOKEN_PRIVATE_KEY: z
//   //   .string()
//   //   .min(1, 'PRIVATE_KEY is required')
//   //   .refine((val) => val.includes('BEGIN PRIVATE KEY'), 'PRIVATE_KEY must be a valid PEM'),

//   // TOKEN_PUBLIC_KEY: z
//   //   .string()
//   //   .min(1, 'PUBLIC_KEY is required')
//   //   .refine((val) => val.includes('BEGIN PUBLIC KEY'), 'PUBLIC_KEY must be a valid PEM'),

//   ACCESS_TOKEN_EXPIRES_IN: z
//     .string()
//     .transform((val) => Number(val))
//     .refine((val) => Number.isInteger(val) && val > 0, {
//       message: 'Must be a positive integer',
//     })
//     .default(REDIS_TTL.ACCESS_TOKEN),

//   REFRESH_TOKEN_EXPIRES_IN: z
//     .string()
//     .transform((val) => Number(val))
//     .refine((val) => Number.isInteger(val) && val > 0, {
//       message: 'Must be a positive integer',
//     })
//     .default(REDIS_TTL.REFRESH_TOKEN),

//   RESET_PASSWORD_TOKEN_EXPIRES_IN: z
//     .string()
//     .transform((val) => Number(val))
//     .refine((val) => Number.isInteger(val) && val > 0, {
//       message: 'Must be a positive integer',
//     })
//     .default(REDIS_TTL.RESET_PASSWORD_TOKEN),

//   EMAIL_VERIFICATION_TOKEN_EXPIRES_IN: z
//     .string()
//     .transform((val) => Number(val))
//     .refine((val) => Number.isInteger(val) && val > 0, {
//       message: 'Must be a positive integer',
//     })
//     .default(REDIS_TTL.EMAIL_VERIFICATION_TOKEN),
// });
