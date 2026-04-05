// import { RedisClientType } from 'redis';
// import { getRedisClient } from './redisClient.old.js';
// import { logger } from '@utils/index';

// export class RedisService {
//   private client: RedisClientType | null = null;
//   private modulePrefix: string;

//   constructor(moduleName: string) {
//     this.modulePrefix = `${moduleName}:`;
//   }

//   // Lazy initialization - gets client when needed
//   private getClient(): RedisClientType {
//     if (!this.client) {
//       this.client = getRedisClient();
//     }
//     return this.client;
//   }

//   private formatKey(key: string): string {
//     return `${this.modulePrefix}${key}`;
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

//   async set(key: string, value: unknown, ttl?: number): Promise<void> {
//     const client = this.getClient();
//     const namespacedKey = this.formatKey(key);
//     const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

//     if (ttl) {
//       await client.set(namespacedKey, stringValue, { EX: ttl });
//     } else {
//       await client.set(namespacedKey, stringValue);
//     }
//   }

//   async get<T = string>(key: string): Promise<T | null> {
//     const client = this.getClient();
//     const namespacedKey = this.formatKey(key);
//     const data = await client.get(namespacedKey);
//     if (!data) return null;

//     try {
//       return JSON.parse(data) as T;
//     } catch {
//       return data as T;
//     }
//   }

//   async del(key: string): Promise<void> {
//     const client = this.getClient();
//     await client.del(this.formatKey(key));
//   }

//   async exists(key: string): Promise<boolean> {
//     const client = this.getClient();
//     const result = await client.exists(this.formatKey(key));
//     return result === 1;
//   }

//   async mget<T = string>(keys: string[]): Promise<(T | null)[]> {
//     return this.executeWithRetry(async () => {
//       const client = this.getClient();
//       const namespacedKeys = keys.map((key) => this.formatKey(key));
//       const values = await client.mGet(namespacedKeys);

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
//       const pipeline = client.multi();

//       Object.entries(keyValuePairs).forEach(([key, value]) => {
//         const namespacedKey = this.formatKey(key);
//         const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

//         if (ttl) {
//           pipeline.set(namespacedKey, stringValue, { EX: ttl });
//         } else {
//           pipeline.set(namespacedKey, stringValue);
//         }
//       });

//       await pipeline.exec();
//     });
//   }

//   async increment(key: string, by = 1): Promise<number> {
//     return this.executeWithRetry(async () => {
//       const client = this.getClient();
//       return await client.incrBy(this.formatKey(key), by);
//     });
//   }

//   async expire(key: string, ttl: number): Promise<boolean> {
//     return this.executeWithRetry(async () => {
//       const client = this.getClient();
//       const result = await client.expire(this.formatKey(key), ttl);
//       return result === 1;
//     });
//   }

//   async ttl(key: string): Promise<number> {
//     return this.executeWithRetry(async () => {
//       const client = this.getClient();
//       return await client.ttl(this.formatKey(key));
//     });
//   }

//   async keys(pattern: string): Promise<string[]> {
//     return this.executeWithRetry(async () => {
//       const client = this.getClient();
//       const namespacedPattern = this.formatKey(pattern);
//       const keys = await client.keys(namespacedPattern);
//       return keys.map((key) => key.replace(this.modulePrefix, ''));
//     });
//   }

//   async flushModule(): Promise<void> {
//     return this.executeWithRetry(async () => {
//       const client = this.getClient();
//       const keys = await client.keys(this.formatKey('*'));
//       if (keys.length > 0) {
//         await client.del(keys);
//       }
//     });
//   }
// }
