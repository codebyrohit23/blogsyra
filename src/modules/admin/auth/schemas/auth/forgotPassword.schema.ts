import { z } from 'zod';

export const forgotPasswordWithEmailOtpSchema = z.object({
  email: z.string().min(1, 'Email address is required').email('Invalid email address'),
});

export type forgotPasswordWithEmailOtpSchema = z.infer<typeof forgotPasswordWithEmailOtpSchema>;
