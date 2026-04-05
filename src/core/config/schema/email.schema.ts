import { z } from 'zod';

export const emailSchema = z.object({
  EMAIL_FROM: z.string().email('From email address is invalid'),

  EMAIL_APP_PASSWORD: z.string().min(1, 'API key is required'),
});

export type emailInput = z.infer<typeof emailSchema>;
