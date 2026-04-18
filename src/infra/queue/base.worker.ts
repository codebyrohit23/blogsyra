import { Worker, Job } from 'bullmq';
import { logger } from '@/core/logger';
import { queueRedisClient } from './queue-redis.clinet';

export abstract class BaseWorker<T> {
  private worker: Worker;

  constructor(queueName: string) {
    this.worker = new Worker(queueName, async (job: Job<T>) => this.process(job), {
      connection: queueRedisClient,
      concurrency: 5,
    });

    this.worker.on('completed', (job) => {
      logger.info(`✅ Job completed: ${job.name}`);
    });

    this.worker.on('failed', (job, err) => {
      logger.error(err, `❌ Job failed: ${job?.name}`);
    });
  }

  protected abstract process(job: Job<T>): Promise<void>;
}
