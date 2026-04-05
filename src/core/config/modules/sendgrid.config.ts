import { env } from '../env';

export const sendGridConfig = {
  from: env.EMAIL_FROM,
  apiKey: env.SEND_GRID_API_KEY,
};
