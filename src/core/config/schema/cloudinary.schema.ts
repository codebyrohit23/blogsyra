import { z } from 'zod';

export const cloudinaryEnvSchema = z.object({
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),

  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),

  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),
});

export type CloudinaryEnv = z.infer<typeof cloudinaryEnvSchema>;
