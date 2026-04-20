import http from 'http';

// import '@queue/queues/notification/notification.worker';
// import { runSeeds } from '@/core/db/seeds/admin';
import './worker';

import { config } from '@/core/config';
import { logger } from '@/core/logger';

import { initRedis } from './infra/cache';
import { app } from './app';
import { connectDB } from './infra/db/mongo';

const PORT = config.app.port;

const start = async () => {
  try {
    await connectDB();

    logger.info('✅  Databse  connected');

    const server = http.createServer(app);

    await initRedis();

    server.listen(PORT, () => {
      logger.info(`${config.app.appName || 'app'} listening on port ${PORT} ${config.app.nodeEnv}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: unknown) => {
      logger.error(reason, 'UNHANDLED REJECTION - shutting down');
      shutdown(server, 1);
    });

    // Handle uncaught exceptions (sync)
    process.on('uncaughtException', (error: Error) => {
      logger.error(error, 'UNCAUGHT EXCEPTION - shutting down');
      shutdown(server, 1);
    });

    // Handle SIGTERM (K8s/Heroku graceful stop)
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Graceful shutdown start.');
      shutdown(server, 0);
    });

    // Handle SIGINT (Ctrl+C)
    process.on('SIGINT', () => {
      logger.info('SIGINT received. Graceful shutdown start.');
      shutdown(server, 0);
    });

    const shutdown = (srv: http.Server, code: number) => {
      srv.close(async () => {
        try {
          //   await disconnectDB();
        } catch (error) {
          logger.warn(error, 'Error during DB disconnect');
        } finally {
          logger.info('Server closed. Exiting now.');
          process.exit(code);
        }
      });
      // Fallback: if close hangs, force exit after timeout
      setTimeout(() => {
        logger.warn('Force exit after timeout');
        process.exit(code || 1);
      }, 10_000).unref();
    };
  } catch (error) {
    logger.error(error, 'Failed to start server');
    process.exit(1);
  }
};

void start();
