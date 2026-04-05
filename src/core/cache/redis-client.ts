import Redis from 'ioredis';
import { logger } from '@/core/logger';
import { config } from '@/core/config';

interface RedisStats {
  connected: boolean;
  totalConnections: number;
  totalErrors: number;
  lastError?: string;
  uptime: number;
  reconnectAttempts: number;
}

class RedisManager {
  private client: Redis | null = null;
  private isInitialized = false;
  private isShuttingDown = false;
  private stats: RedisStats = {
    connected: false,
    totalConnections: 0,
    totalErrors: 0,
    uptime: 0,
    reconnectAttempts: 0,
  };

  private startTime = Date.now();

  async init(): Promise<Redis> {
    if (this.client && this.isInitialized) return this.client;
    if (this.isShuttingDown) throw new Error('Redis is shutting down');

    this.client = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      db: config.redis.db,
      connectTimeout: 10000,
      keyPrefix: config.redis.keyPrefix,

      retryStrategy: (times) => {
        const maxDelay = 30000; // max wait 30s
        const delay = Math.min(50 * 2 ** times, maxDelay);
        const jitter = Math.random() * 100; // randomize to avoid thundering herd
        return delay + jitter;

        return Math.min(times * 50, 30000);
      },

      lazyConnect: false,
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
    });

    this.client.on('connect', () => {
      logger.info('✅ Redis connected');
      this.stats.connected = true;
      this.stats.totalConnections++;
    });

    this.client.on('ready', () => {
      logger.info('🚀 Redis ready for operations');
      this.isInitialized = true;
    });

    this.client.on('error', (err) => {
      logger.error(err, '❌ Redis error:');
      this.stats.totalErrors++;
      this.stats.lastError = err.message;
      this.stats.connected = false;
    });

    this.client.on('end', () => {
      logger.warn('🔌 Redis connection ended');
      this.stats.connected = false;
      this.isInitialized = false;
    });

    this.client.on('reconnecting', (delay: number) => {
      logger.warn(`Redis reconnecting in ${delay}ms`);
      this.stats.connected = false;
      this.stats.reconnectAttempts++;
    });

    try {
      // await this.client.connect();
      await this.client.ping();
      return this.client;
    } catch (error) {
      logger.error(error, 'Failed to connect to Redis:');
      this.stats.totalErrors++;
      this.stats.lastError = error instanceof Error ? error.message : String(error);
      throw error;
    }
  }

  getClient(): Redis {
    if (!this.client || !this.isInitialized) {
      throw new Error('Redis client not initialized. Call init() first.');
    }
    return this.client;
  }

  async healthCheck(): Promise<{ healthy: boolean; message: string; stats: RedisStats }> {
    try {
      if (!this.client || !this.isInitialized) {
        return {
          healthy: false,
          message: 'Redis client not initialized',
          stats: this.getStats(),
        };
      }

      const pong = await this.client.ping();
      if (pong === 'PONG') {
        return {
          healthy: true,
          message: 'Redis is healthy',
          stats: this.getStats(),
        };
      }

      return {
        healthy: false,
        message: 'Redis ping failed',
        stats: this.getStats(),
      };
    } catch (error) {
      return {
        healthy: false,
        message: `Redis health check failed: ${error}`,
        stats: this.getStats(),
      };
    }
  }

  getStats(): RedisStats {
    return {
      ...this.stats,
      uptime: Date.now() - this.startTime,
    };
  }

  async gracefulShutdown(): Promise<void> {
    if (this.isShuttingDown) return;

    this.isShuttingDown = true;
    logger.info('🛑 Shutting down Redis client...');

    if (this.client) {
      try {
        await this.client.quit();
        logger.info('✅ Redis client closed gracefully');
      } catch (error) {
        logger.error(error, 'Error during Redis shutdown:');
        this.client.disconnect();
      }
    }

    this.client = null;
    this.isInitialized = false;
  }
}

const redisManager = new RedisManager();

process.on('SIGTERM', async () => {
  await redisManager.gracefulShutdown();
});

process.on('SIGINT', async () => {
  await redisManager.gracefulShutdown();
});

export const initRedis = () => redisManager.init();
export const getRedisClient = () => redisManager.getClient();
export const getRedisHealth = () => redisManager.healthCheck();
export const getRedisStats = () => redisManager.getStats();
