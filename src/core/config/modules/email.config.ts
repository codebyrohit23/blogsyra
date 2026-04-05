import { env } from '../env';

export const emailConfig = {
  from: env.EMAIL_FROM,
  password: env.EMAIL_APP_PASSWORD,
};
