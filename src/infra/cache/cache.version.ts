import { redisService, RedisService } from './redis.service';

export class CacheVersionService {
  constructor(private readonly redis: RedisService) {}

  async get(key: string): Promise<number> {
    const raw = await this.redis.get<string>(key);
    return raw ? Number(raw) : 1;
  }

  async bump(key: string): Promise<number> {
    return this.redis.increment(key);
  }
}

export const cacheVersionService = new CacheVersionService(redisService);
