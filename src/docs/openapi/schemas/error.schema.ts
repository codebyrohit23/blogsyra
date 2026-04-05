import { z } from 'zod';

export const errorResponse = z.object({
  success: z.boolean().meta({ example: false }),
  message: z.string(),
  error: z.any().nullable(),
});
