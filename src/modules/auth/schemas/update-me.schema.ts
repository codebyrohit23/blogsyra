import { DEFAULT_TIMEZONE, Gender } from '@/shared/constants';
import { zObjectId, zTrimmedStringSchema } from '@/shared/schemas';
import { isValidTimezone, LANGUAGE_CODE_REGEX, YMD_REGEX } from '@/shared/utils';

import { z } from 'zod';

export const updateMeSchema = z
  .object({
    name: zTrimmedStringSchema(2, 50, 'Name must be between 2-50 characters'),

    gender: z.nativeEnum(Gender, {
      error: `Gender must be one of: ${Object.values(Gender).join(', ')}`,
    }),

    dob: z.string().trim().regex(YMD_REGEX, 'DOB must be in YYYY-MM-DD format'),

    bio: zTrimmedStringSchema(1, 1000, 'bio must be less than 1000 characters'),

    timezone: z
      .string()
      .refine(isValidTimezone, {
        message: 'Invalid timezone',
      })
      .default(DEFAULT_TIMEZONE),

    language: zTrimmedStringSchema(2, 50, 'Language must be between 2-10 characters').regex(
      LANGUAGE_CODE_REGEX,
      "Invalid language code format (e.g., 'en' or 'en-US')."
    ),

    avatar: zObjectId('Invalid avatar'),

    coverImage: zObjectId('Invalid avatar'),
  })
  .strict()
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type UpdateMeDto = z.infer<typeof updateMeSchema>;
