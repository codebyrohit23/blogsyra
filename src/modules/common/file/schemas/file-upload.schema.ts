import { z } from 'zod';

export const fileUploadSchema = z.object({
  file: z
    .instanceof(File, { message: 'File is required' })
    .refine((file) => file.size > 0, 'File cannot be empty')
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Max 5MB allowed')
    .refine((file) => ['image/png', 'image/jpeg'].includes(file.type), 'Only PNG, JPEG'),
});

export type FileUploadDto = z.infer<typeof fileUploadSchema>;
