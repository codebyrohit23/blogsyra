import { eventsRedis, workerRedis } from '@queue/connection/redis.connection';
import { QueueEnum } from '@queue/type';
import { QueueEvents, Worker } from 'bullmq';
import { processNotification } from './processor/notification.processer';

export const NotificationWorker = new Worker(
  QueueEnum.NOTIFICATION,
  async (job) => {
    await processNotification(job.data.logId);
  },
  { connection: workerRedis, concurrency: 20 }
);

export const NotificationQueueEvents = new QueueEvents(QueueEnum.NOTIFICATION, {
  connection: eventsRedis,
});

// NotificationQueueEvents.on('completed', (job) => {
//   console.log(`Job ${job} completed successfully.`);
// });

// NotificationQueueEvents.on('failed', (job, err) => {
//   console.error(`Job ${job} failed with error:`, err);
// });

// NotificationWorker.on('stalled', (job) => {
//   console.warn(`Job ${job} stalled.`);
// });

// console.log('🚀 NotificationWorker loaded');

// NotificationWorker.on('ready', () => {
//   console.log('✅ NotificationWorker READY');
// });

// NotificationWorker.on('error', (err) => {
//   console.error('❌ Worker error:', err);
// });
