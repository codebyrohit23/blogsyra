// import { logger } from '@/common/utils/index.js';
// import { redisConfig } from '@/config';
// import { LogMetadata } from '@/types/index.js';
// import { createClient, RedisClientType } from 'redis';

// // let redisClient: RedisClientType | null = null;

// interface RedisStats {
//   connected: boolean;
//   totalConnections: number;
//   totalErrors: number;
//   lastError?: string;
//   uptime: number;
// }

// export class RedisManager {
//   private client: RedisClientType | null = null;
//   private isInitialized = false;
//   private isShuttingDown = false;
//   private stats: RedisStats = {
//     connected: false,
//     totalConnections: 0,
//     totalErrors: 0,
//     uptime: 0,
//   };

//   private startTime = Date.now();
//   async init(): Promise<RedisClientType> {
//     if (this.client && this.isInitialized) return this.client;
//     if (this.isShuttingDown) throw new Error('Redis is shutting down');
//     this.client = createClient({
//       socket: {
//         host: redisConfig.HOST,
//         port: redisConfig.PORT,
//         connectTimeout: 10000,
//         reconnectStrategy: (retries) => {
//           return Math.min(retries * 50, 30000);
//         },
//       },
//       password: redisConfig.PASSWORD,
//       database: redisConfig.DB,
//     });

//     this.client.on('connect', () => {
//       logger.info('✅ Redis connected');
//       this.stats.connected = true;
//       this.stats.totalConnections++;
//     });

//     this.client.on('ready', () => {
//       logger.info('🚀 Redis ready for operations');
//       this.isInitialized = true;
//     });

//     this.client.on('error', (err) => {
//       logger.error('❌ Redis error:', err);
//       this.stats.totalErrors++;
//       this.stats.lastError = err.message;
//       this.stats.connected = false;
//     });

//     this.client.on('end', () => {
//       logger.warn('🔌 Redis connection ended');
//       this.stats.connected = false;
//       this.isInitialized = false;
//     });

//     this.client.on('reconnecting', () => {
//       logger.info('🔄 Redis reconnecting...');
//       this.stats.connected = false;
//     });

//     try {
//       await this.client.connect();
//       return this.client;
//     } catch (error) {
//       logger.error('Failed to connect to Redis:', error as LogMetadata);
//       this.stats.totalErrors++;
//       this.stats.lastError = error instanceof Error ? error.message : String(error);
//       throw error;
//     }
//   }

//   getClient(): RedisClientType {
//     if (!this.client || !this.isInitialized) {
//       throw new Error('Redis client not initialized. Call init() first.');
//     }
//     return this.client;
//   }

//   async healthCheck(): Promise<{ healthy: boolean; message: string; stats: RedisStats }> {
//     try {
//       if (!this.client || !this.isInitialized) {
//         return {
//           healthy: false,
//           message: 'Redis client not initialized',
//           stats: this.getStats(),
//         };
//       }

//       // Test with a simple ping
//       const pong = await this.client.ping();
//       if (pong === 'PONG') {
//         return {
//           healthy: true,
//           message: 'Redis is healthy',
//           stats: this.getStats(),
//         };
//       }

//       return {
//         healthy: false,
//         message: 'Redis ping failed',
//         stats: this.getStats(),
//       };
//     } catch (error) {
//       return {
//         healthy: false,
//         message: `Redis health check failed: ${error}`,
//         stats: this.getStats(),
//       };
//     }
//   }

//   getStats(): RedisStats {
//     return {
//       ...this.stats,
//       uptime: Date.now() - this.startTime,
//     };
//   }
//   async gracefulShutdown(): Promise<void> {
//     if (this.isShuttingDown) return;

//     this.isShuttingDown = true;
//     logger.info('🛑 Shutting down Redis client...');

//     if (this.client) {
//       try {
//         await this.client.quit();
//         logger.info('✅ Redis client closed gracefully');
//       } catch (error) {
//         logger.error('Error during Redis shutdown:', error as LogMetadata);
//         // Force disconnect if quit fails
//         await this.client.disconnect();
//       }
//     }

//     this.client = null;
//     this.isInitialized = false;
//   }
// }

// const redisManager = new RedisManager();

// process.on('SIGTERM', async () => {
//   await redisManager.gracefulShutdown();
// });

// process.on('SIGINT', async () => {
//   await redisManager.gracefulShutdown();
// });

// export const initRedis = () => redisManager.init();
// export const getRedisClient = () => redisManager.getClient();
// export const getRedisHealth = () => redisManager.healthCheck();
// export const getRedisStats = () => redisManager.getStats();

// // export async function initRedis(): Promise<RedisClientType> {
// //   if (redisClient) return redisClient;
// //   redisClient = createClient({
// //     socket: {
// //       host: redisConfig.HOST,
// //       port: redisConfig.PORT,
// //     },
// //     password: redisConfig.PASSWORD,
// //     database: redisConfig.DB,
// //   });

// //   redisClient.on('connect', () => logger.info('✅ Redis connected'));
// //   redisClient.on('error', (err) => logger.error('❌ Redis error:', err));

// //   await redisClient.connect();
// //   return redisClient;
// // }

// // export function getRedisClient(): RedisClientType {
// //   if (!redisClient) {
// //     throw new Error('Redis client not initialized. Call initRedis() first.');
// //   }
// //   return redisClient;
// // }
