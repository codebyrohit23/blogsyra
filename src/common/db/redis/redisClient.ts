// import { logger } from '@utils/index';
// import { redisConfig } from '@/config';
// import { LogMetadata } from '@/types';
// import Redis from 'ioredis';

// interface RedisStats {
//   connected: boolean;
//   totalConnections: number;
//   totalErrors: number;
//   lastError?: string;
//   uptime: number;
//   reconnectAttempts: number;
// }

// export class RedisManager {
//   private client: Redis | null = null;
//   private isInitialized = false;
//   private isShuttingDown = false;
//   private stats: RedisStats = {
//     connected: false,
//     totalConnections: 0,
//     totalErrors: 0,
//     uptime: 0,
//     reconnectAttempts: 0,
//   };

//   private startTime = Date.now();

//   async init(): Promise<Redis> {
//     if (this.client && this.isInitialized) return this.client;
//     if (this.isShuttingDown) throw new Error('Redis is shutting down');

//     this.client = new Redis({
//       host: redisConfig.HOST,
//       port: redisConfig.PORT,
//       password: redisConfig.PASSWORD,
//       db: redisConfig.DB,
//       connectTimeout: 10000,
//       retryStrategy: (times) => {
//         return Math.min(times * 50, 30000);
//       },
//       lazyConnect: true,
//       maxRetriesPerRequest: null,
//       enableReadyCheck: true,
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
//       logger.error('❌ Redis error:', { message: err.message });
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
//       this.stats.reconnectAttempts++;
//     });

//     try {
//       // await this.client.connect();
//       await this.client.ping();
//       return this.client;
//     } catch (error) {
//       logger.error(error, 'Failed to connect to Redis:');
//       this.stats.totalErrors++;
//       this.stats.lastError = error instanceof Error ? error.message : String(error);
//       throw error;
//     }
//   }

//   getClient(): Redis {
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
//         this.client.disconnect();
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
