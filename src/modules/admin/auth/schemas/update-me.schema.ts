import { DEFAULT_TIMEZONE } from '@/shared/constants';
import { zObjectId, zTrimmedStringSchema } from '@/shared/schemas';
import { isValidTimezone, LANGUAGE_CODE_REGEX } from '@/shared/utils';

import { z } from 'zod';

export const updateMeSchema = z
  .object({
    name: zTrimmedStringSchema(2, 50, 'Name must be between 2-50 characters'),

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

    notes: zTrimmedStringSchema(1, 500, 'Notes cannot exceed 500 characters.').optional(),
  })
  .strict()
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type UpdateMeDto = z.infer<typeof updateMeSchema>;
