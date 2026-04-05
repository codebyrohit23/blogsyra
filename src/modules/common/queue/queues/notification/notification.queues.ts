// import { Queue, QueueEvents } from 'bullmq';
// import { QueueEnum } from '../../type/queue.type';
// import { queueRedis } from '@queue/connection/redis.connection';

// export const NotificationQueue = new Queue(QueueEnum.NOTIFICATION, {
//   connection: queueRedis,
//   defaultJobOptions: {
//     attempts: 5,
//     backoff: { type: 'exponential', delay: 5000 },
//     removeOnComplete: true,
//     removeOnFail: false,
//     priority: 5,
//   },
// });

// export const NotificationQueueEvents = new QueueEvents(QueueEnum.NOTIFICATION, {
//   connection: queueRedis,
// });
