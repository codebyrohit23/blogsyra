import { z } from 'zod';

export const sendGridSchema = z.object({
  EMAIL_FROM: z.string().email('From email address is invalid'),

  SEND_GRID_API_KEY: z.string().min(1, 'API key is required'),
});
