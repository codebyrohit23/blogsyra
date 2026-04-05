// import Redis from 'ioredis';
// import { getRedisClient } from './redisClient.js';
// import { logger } from '@utils/logger.js';
// import { RedisKeys } from './redisKeys.js';
// import { normalizeTTL } from '@utils/timeFormat.js';

// export class RedisService {
//   private client: Redis | null = null;

//   // Lazy initialization - gets client when needed
//   private getClient(): Redis {
//     if (!this.client) {
//       this.client = getRedisClient();
//     }
//     return this.client;
//   }

//   private async executeWithRetry<T>(
//     operation: () => Promise<T>,
//     maxRetries = 3,
//     delay = 1000
//   ): Promise<T> {
//     let lastError: Error;

//     for (let attempt = 1; attempt <= maxRetries; attempt++) {
//       try {
//         return await operation();
//       } catch (error) {
//         lastError = error instanceof Error ? error : new Error(String(error));
//         logger.warn(
//           `Redis operation failed (attempt ${attempt}/${maxRetries}): ${lastError.message}`
//         );

//         if (attempt === maxRetries) break;
//         await new Promise((resolve) => setTimeout(resolve, delay * attempt));
//       }
//     }

//     throw lastError!;
//   }

//   async set(key: string, value: unknown, ttl = RedisKeys.DEFAULT.time): Promise<void> {
//     const client = this.getClient();
//     const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

//     const ttlSeconds = normalizeTTL(ttl);

//     await client.set(key, stringValue, 'EX', ttlSeconds);
//   }

//   async setWithoutTTL(key: string, value: unknown): Promise<void> {
//     const client = this.getClient();
//     const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
//     await client.set(key, stringValue);
//   }

//   async get<T = string>(key: string): Promise<T | null> {
//     const client = this.getClient();
//     const data = await client.get(key);
//     if (!data) return null;

//     try {
//       return JSON.parse(data) as T;
//     } catch {
//       return data as T;
//     }
//   }

//   async del(key: string): Promise<void> {
//     const client = this.getClient();
//     await client.del(key);
//   }

//   async exists(key: string): Promise<boolean> {
//     const client = this.getClient();
//     const result = await client.exists(key);
//     return result === 1;
//   }

//   async mget<T = string>(keys: string[]): Promise<(T | null)[]> {
//     return this.executeWithRetry(async () => {
//       const client = this.getClient();
//       const values = await client.mget(...keys);

//       return values.map((value) => {
//         if (!value) return null;
//         try {
//           return JSON.parse(value) as T;
//         } catch {
//           return value as T;
//         }
//       });
//     });
//   }

//   async mset(keyValuePairs: Record<string, unknown>, ttl?: number): Promise<void> {
//     return this.executeWithRetry(async () => {
//       const client = this.getClient();
//       const pipeline = client.pipeline();

//       Object.entries(keyValuePairs).forEach(([key, value]) => {
//         const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

//         if (ttl) {
//           pipeline.set(key, stringValue, 'EX', ttl);
//         } else {
//           pipeline.set(key, stringValue);
//         }
//       });

//       await pipeline.exec();
//     });
//   }

//   async increment(key: string, by = 1): Promise<number> {
//     return this.executeWithRetry(async () => {
//       const client = this.getClient();
//       return await client.incrby(key, by);
//     });
//   }

//   async expire(key: string, ttl: number): Promise<boolean> {
//     return this.executeWithRetry(async () => {
//       const client = this.getClient();
//       const result = await client.expire(key, ttl);
//       return result === 1;
//     });
//   }

//   async ttl(key: string): Promise<number> {
//     return this.executeWithRetry(async () => {
//       const client = this.getClient();
//       return await client.ttl(key);
//     });
//   }

//   async keys(pattern: string): Promise<string[]> {
//     return this.executeWithRetry(async () => {
//       const client = this.getClient();
//       return await client.keys(pattern);
//     });
//   }

//   async deleteByPattern(pattern: string): Promise<void> {
//     const client = this.getClient();
//     const stream = client.scanStream({ match: pattern, count: 100 });

//     const pipeline = client.pipeline();

//     return new Promise((resolve, reject) => {
//       stream.on('data', (keys: string[]) => {
//         if (keys.length) {
//           keys.forEach((key) => pipeline.del(key));
//         }
//       });

//       stream.on('end', () => {
//         pipeline
//           .exec()
//           .then(() => resolve())
//           .catch((err) => reject(err));
//       });

//       stream.on('error', reject);
//     });
//   }

//   async flushAll(): Promise<void> {
//     return this.executeWithRetry(async () => {
//       const client = this.getClient();
//       const keys = await client.keys('*');
//       if (keys.length > 0) {
//         await client.del(...keys);
//       }
//     });
//   }
// }
