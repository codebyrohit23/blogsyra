import { EntityStatus } from '@/shared/constants';
import { zTrimmedStringSchema } from '@/shared/schemas';
import { z } from 'zod';

const templateBaseSchema = z.object({
  name: zTrimmedStringSchema(2, 100, 'Template name must be 2-50 characters'),

  description: zTrimmedStringSchema(1, 255, 'Description cannot exceed 255 characters').optional(),

  status: z.nativeEnum(EntityStatus),

  tags: z.array(z.string()).max(5, 'A maximum of 5 tags can be provided').default([]),
});

export const createTemplateSchema = templateBaseSchema.omit({ status: true }).strict();

export const updateTemplateSchema = templateBaseSchema
  .strict()
  .omit({ name: true })
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type CreateTemplateDto = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateDto = z.infer<typeof updateTemplateSchema>;
