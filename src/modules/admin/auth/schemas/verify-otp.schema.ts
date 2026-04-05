import { OtpPurpose } from '@/modules/common/otp';
import { emailSchema, zTrimmedStringSchema } from '@/shared/schemas';
import { NUMERIC_REGEX } from '@/shared/utils';

import { z } from 'zod';

export const verifyOtpSchema = z.object({
  email: emailSchema,
  otp: zTrimmedStringSchema(1, 6, 'OTP must be at most 6 digits').regex(NUMERIC_REGEX, {
    message: 'OTP must contain only numbers',
  }),
  purpose: z.nativeEnum(OtpPurpose),
});

export type VerifyOtpDto = z.infer<typeof verifyOtpSchema>;
