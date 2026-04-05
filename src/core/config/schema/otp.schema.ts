import { zTrimmedStringSchema } from '@/shared/schemas';
import { HEX_REGEX } from '@/shared/utils';
import { z } from 'zod';

export const otpEnvSchema = z.object({
  //   OTP_ENC_KEY: zTrimmedStringSchema(
  //     1,
  //     64,
  //     'OTP_ENC_KEY must be 64 hex characters (32 bytes)'
  //   ).regex(HEX_REGEX, 'OTP_ENC_KEY must be a valid hex string'),

  OTP_HMAC_SECRET: z.string().min(1, 'OTP_HMAC_SECRET is required'),
  // OTP_LENGTH: z
  //   .string()
  //   .transform(Number)
  //   .refine((val) => !isNaN(val) && val > 0, {
  //     message: 'OTP_LENGTH must be a positive number',
  //   })
  //   .default('6'),

  // MAX_ATTEMPTS: z
  //   .string()
  //   .transform(Number)
  //   .refine((val) => !isNaN(val) && val > 0, {
  //     message: 'Otp verify max attempts must be a positive number',
  //   })
  //   .default('5'),

  // FORGOT_PASSWORD_EXPIRES_IN: z.string().default('5m'),

  // EMAIL_VERIFICATION_EXPIRES_IN: z.string().default('15m'),
});
