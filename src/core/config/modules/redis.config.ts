import { env } from '../env';

export const redisConfig = {
  host: env.REDIS_HOST,
  port: Number(env.REDIS_PORT),
  password: env.REDIS_PASSWORD,
  db: env.REDIS_DB,
  keyPrefix: env.REDIS_KEY_PREFIX,
  defaultExpireTime: env.REDIS_DEFAULT_EXPIRES_TIME,
};
