import { redisConfig } from '@/config';
import IORedis from 'ioredis';

export const queueRedis = new IORedis({
  host: redisConfig.HOST,
  port: redisConfig.PORT,
  password: redisConfig.PASSWORD,
  db: 0,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
});

export const workerRedis = new IORedis({
  host: redisConfig.HOST,
  port: redisConfig.PORT,
  password: redisConfig.PASSWORD,
  db: 0,
  maxRetriesPerRequest: null,
});

export const eventsRedis = new IORedis({
  host: redisConfig.HOST,
  port: redisConfig.PORT,
  password: redisConfig.PASSWORD,
  db: 0,
  maxRetriesPerRequest: null,
});
