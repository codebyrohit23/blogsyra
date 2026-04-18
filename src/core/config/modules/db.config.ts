import { env } from '../env';

export const dbConfig = {
  mongoUri: env.DATABASE_URL,
  testDatabaseUrl: env.TEST_DATABASE_URL,
};
