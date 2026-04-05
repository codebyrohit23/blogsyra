import { HAS_LOWER_CASE, HAS_NUMBER, HAS_SPECIAL_CHAR, HAS_UPPER_CASE } from '@/shared/utils';
import { zTrimmedStringSchema } from './zod-helpers';

export const passwordSchema = zTrimmedStringSchema(8, 64, 'Password must be at least 8 characters')
  .regex(HAS_UPPER_CASE, 'Password must contain at least one uppercase letter')
  .regex(HAS_LOWER_CASE, 'Password must contain at least one lowercase letter')
  .regex(HAS_NUMBER, 'Password must contain at least one number')
  .regex(HAS_SPECIAL_CHAR, 'Password must contain at least one special character')
  .refine((val) => !/\s/.test(val), {
    message: 'Password cannot contain spaces',
  });
