import Redis from 'ioredis';
import { getRedisClient } from './redis-client.js';
import { logger } from '@/core/logger';
import { REDIS_TTL } from '@/shared/constants';

export class RedisService {
  // private client: Redis;

  // constructor() {
  //   this.client = getRedisClient(); // initialize once
  // }

  private get client(): Redis {
    return getRedisClient();
  }
  /**
   * Executes Redis operations with retries.
   * Retry only if explicitly needed (configurable)
   */
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries = 2,
    delay = 200
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        logger.warn(
          `Redis operation failed (attempt ${attempt}/${maxRetries}): ${lastError.message}`
        );
        if (attempt === maxRetries) break;
        await new Promise((res) => setTimeout(res, delay * attempt));
      }
    }

    throw lastError!;
  }

  /** Safe set with optional TTL */
  async set(key: string, value: unknown, ttl: number = REDIS_TTL.DEFAULT): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await this.executeWithRetry(() => this.client.set(key, stringValue, 'EX', ttl));
  }

  /** Set without TTL */
  async setWithoutTTL(key: string, value: unknown): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await this.executeWithRetry(() => this.client.set(key, stringValue));
  }

  /** Get value and parse JSON safely */
  async get<T = string>(key: string): Promise<T | null> {
    const data = await this.executeWithRetry(() => this.client.get(key));
    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch {
      return data as T;
    }
  }

  /** Delete key */
  async del(key: string): Promise<void> {
    await this.executeWithRetry(() => this.client.del(key));
  }

  /** Check existence */
  async exists(key: string): Promise<boolean> {
    const result = await this.executeWithRetry(() => this.client.exists(key));
    return result === 1;
  }

  /** Multi-get safely, JSON parse each key */
  async mget<T = string>(keys: string[]): Promise<(T | null)[]> {
    const values = await this.executeWithRetry(() => this.client.mget(...keys));
    return values.map((v) => {
      if (!v) return null;
      try {
        return JSON.parse(v) as T;
      } catch {
        return v as T;
      }
    });
  }

  /** Multi-set using pipeline with TTL support */
  async mset(keyValuePairs: Record<string, unknown>, ttl?: number): Promise<void> {
    const pipeline = this.client.pipeline();
    Object.entries(keyValuePairs).forEach(([key, value]) => {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      if (ttl) {
        pipeline.set(key, stringValue, 'EX', ttl);
      } else {
        pipeline.set(key, stringValue);
      }
    });
    await this.executeWithRetry(() => pipeline.exec());
  }

  /** Increment a numeric key */
  async increment(key: string, by = 1): Promise<number> {
    return await this.executeWithRetry(() => this.client.incrby(key, by));
  }

  /** Set TTL for an existing key */
  async expire(key: string, ttl: number): Promise<boolean> {
    const result = await this.executeWithRetry(() => this.client.expire(key, ttl));
    return result === 1;
  }

  /** Get remaining TTL */
  async ttl(key: string): Promise<number> {
    return await this.executeWithRetry(() => this.client.ttl(key));
  }

  /** Get keys by pattern safely (SCAN instead of KEYS) */
  async keys(pattern: string): Promise<string[]> {
    const results: string[] = [];
    const stream = this.client.scanStream({ match: pattern, count: 100 });
    return new Promise((resolve, reject) => {
      stream.on('data', (keys: string[]) => {
        results.push(...keys);
      });
      stream.on('end', () => resolve(results));
      stream.on('error', (err) => reject(err));
    });
  }

  /** Delete keys by pattern safely using SCAN + pipeline */
  async deleteByPattern(pattern: string): Promise<void> {
    const stream = this.client.scanStream({ match: pattern, count: 100 });
    const pipeline = this.client.pipeline();

    return new Promise((resolve, reject) => {
      stream.on('data', (keys: string[]) => {
        keys.forEach((key) => pipeline.del(key));
      });

      stream.on('end', async () => {
        try {
          await pipeline.exec();
          resolve();
        } catch (err) {
          reject(err);
        }
      });

      stream.on('error', reject);
    });
  }

  /** Flush all keys safely (avoid KEYS('*') in prod) */
  async flushAll(): Promise<void> {
    const keys = await this.keys('*');
    if (keys.length) {
      const pipeline = this.client.pipeline();
      keys.forEach((key) => pipeline.del(key));
      await this.executeWithRetry(() => pipeline.exec());
    }
  }
}

export const redisService = new RedisService();
