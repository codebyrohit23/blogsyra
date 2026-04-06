import { config } from '@/core/config';
import IORedis from 'ioredis';

export const queueRedis = new IORedis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  db: 0,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
});

export const workerRedis = new IORedis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  db: 0,
  maxRetriesPerRequest: null,
});

export const eventsRedis = new IORedis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  db: 0,
  maxRetriesPerRequest: null,
});
