import { Queue, JobsOptions } from 'bullmq';
import { logger } from '@/core/logger';
import { queueRedisClient } from './queue-redis.clinet';

export interface BaseJobOptions extends JobsOptions {}

export class BaseQueue<T> {
  protected queue: Queue;

  constructor(queueName: string) {
    this.queue = new Queue(queueName, {
      connection: queueRedisClient,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    });
  }

  /**
   * Add job to queue
   */
  async add(jobName: string, data: T, options?: BaseJobOptions) {
    try {
      const job = await this.queue.add(jobName, data, options);

      return job;
    } catch (error) {
      logger.error(error, `❌ Failed to add job: ${jobName}`);
      throw error;
    }
  }

  /**
   * Add delayed job
   */
  async addDelayed(jobName: string, data: T, delayMs: number) {
    return this.add(jobName, data, { delay: delayMs });
  }

  /**
   * Add bulk jobs
   */
  async addBulk(jobs: { name: string; data: T }[]) {
    return this.queue.addBulk(
      jobs.map((job) => ({
        name: job.name,
        data: job.data,
      }))
    );
  }

  /**
   * Pause queue
   */
  async pause() {
    await this.queue.pause();
  }

  /**
   * Resume queue
   */
  async resume() {
    await this.queue.resume();
  }
}
