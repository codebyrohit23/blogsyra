import { config } from '@/core/config';
import Redis from 'ioredis';

export const queueRedisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  db: config.redis.db,
  connectTimeout: 10000,
  maxRetriesPerRequest: null,
});
