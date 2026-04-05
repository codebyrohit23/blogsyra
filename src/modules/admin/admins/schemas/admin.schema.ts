import { z } from 'zod';

import { isValidTimezone, LANGUAGE_CODE_REGEX } from '@/shared/utils';
import { emailSchema, passwordSchema, zObjectId, zTrimmedStringSchema } from '@/shared/schemas';
import { DEFAULT_LANGUAGE, DEFAULT_TIMEZONE } from '@/shared/constants';
import { AccountStatus } from '@/shared/constants/enums';

const adminBaseSchema = z.object({
  name: zTrimmedStringSchema(2, 50, 'Name must be between 2-50 characters'),

  email: emailSchema,

  password: passwordSchema,

  roleId: zObjectId('Invalid role').optional(),

  avatar: zObjectId('Invalid image').optional(),

  timezone: z
    .string()
    .refine(isValidTimezone, {
      message: 'Invalid timezone',
    })
    .default(DEFAULT_TIMEZONE),

  status: z.nativeEnum(AccountStatus),

  language: zTrimmedStringSchema(2, 50, 'Language must be between 2-10 characters')
    .regex(LANGUAGE_CODE_REGEX, "Invalid language code format (e.g., 'en' or 'en-US').")
    .default(DEFAULT_LANGUAGE),

  notes: zTrimmedStringSchema(1, 500, 'Notes cannot exceed 500 characters.').optional(),
});

export const createAdminSchema = adminBaseSchema.omit({ status: true }).strict();

export const updateAdminSchema = adminBaseSchema
  .omit({ email: true, password: true })
  .strict()
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type CreateAdminDto = z.infer<typeof createAdminSchema>;
export type UpdateAdminDto = z.infer<typeof updateAdminSchema>;
