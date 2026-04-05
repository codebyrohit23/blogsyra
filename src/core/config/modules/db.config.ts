import { env } from '../env';

export const dbConfig = {
  mongoUri: env.DATABASE_URL,
  seedDatabase: env.SEED_DATABASE,
  testDatabaseUrl: env.TEST_DATABASE_URL,
};
