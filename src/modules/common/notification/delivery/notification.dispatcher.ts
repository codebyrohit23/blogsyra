import { NotificationQueue } from '@notification/queue/notification.queue';
import { NotificationLogService } from '@notification/services/notificationLog.service';

export class NotificationDispatcher {
  private logService = new NotificationLogService();

  async dispatchAsync(notificationId: string) {
    const logs = await this.logService.findAll({ notificationId });

    const jobs = logs.map((log) => ({
      name: 'deliver',
      data: { logId: log._id.toString() },
    }));

    await NotificationQueue.addBulk(jobs);
  }

  async dispatchSync(notificationId: string) {
    const logs = await this.logService.findAll({ notificationId });

    for (const log of logs) {
      // Direct call (FCM / Email)
      // No queue
      // await sendDirectNotification(log._id.toString());
      console.log('log', log);
    }
  }
}
