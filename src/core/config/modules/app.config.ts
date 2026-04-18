import { env } from '../env';

export const appConfig = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  apiBaseUrl: env.API_BASE_URL,
  corsOrigin: env.CORS_ORIGIN,
  appName: env.APP_NAME,
};
