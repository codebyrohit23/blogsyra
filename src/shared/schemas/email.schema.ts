import { zTrimmedStringSchema } from './zod-helpers';

export const emailSchema = zTrimmedStringSchema(5, 255, 'Email must be between 5-255 characters')
  .email('Invalid email address')
  .transform((email) => email.toLowerCase());
