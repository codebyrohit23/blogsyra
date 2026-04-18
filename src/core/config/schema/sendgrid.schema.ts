import { z } from 'zod';

export const sendGridSchema = z.object({
  SEND_GRID_API_KEY: z.string().min(1, 'SEND_GRID_API_KEY is required'),

  EMAIL_FROM: z.string().email('EMAIL_FROM address is invalid'),
});
