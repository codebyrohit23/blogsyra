import { NotificationService } from './services/notification.service';
import { NotificationCreatePayload } from './types/notification.type';
import { NotificationLogService } from './services/notificationLog.service';
import { NotificationDispatcher } from './delivery/notification.dispatcher';
import { NotificationQueue } from './queue/notification.queue';

export class NotificationManager {
  private notificationService = new NotificationService();
  private notificationLogService = new NotificationLogService();
  private dispatcher = new NotificationDispatcher();

  genrateAndSendNotification = async (payload: NotificationCreatePayload): Promise<void> => {
    const { receiverType, receiverIds } = payload;

    // const session = await mongoose.startSession();

    try {
      // session.startTransaction();
      // 1) create notification
      const notification = await this.notificationService.createNotification(
        {
          ...payload,
          senderId: payload?.senderId?.toString(),
        }
        // session
      );

      // 2) create NotificationLog (one per receiver)
      const logs = receiverIds.map((receiverId) => ({
        notificationId: notification._id.toString(),
        receiverType: receiverType,
        receiverId: receiverId.toString(),
        isRead: false,
        isDelivered: false,
        priority: payload.priority,
      }));

      // await this.notificationLogService.createNotificationLogs(logs, session);
      await this.notificationLogService.createNotificationLogs(logs);

      // await session.commitTransaction();
      // session.endSession();

      const logsIds = await this.notificationLogService.findAll(
        { notificationId: notification._id },
        { projection: '_id' }
      );

      const jobs = logsIds.map((notification) => ({
        name: 'deliver',
        data: { logId: notification._id.toString() },
      }));

      await NotificationQueue.addBulk(jobs);
    } catch (err) {
      // await session.abortTransaction();
      // session.endSession();
      throw err;
    }
  };

  async createNotificationWithLogs(payload: NotificationCreatePayload): Promise<string> {
    const notification = await this.notificationService.createNotification({
      ...payload,
      senderId: payload?.senderId?.toString(),
    });

    const logs = payload.receiverIds.map((receiverId) => ({
      notificationId: notification._id.toString(),
      receiverId: receiverId?.toString(),
      receiverType: payload.receiverType,
      isRead: false,
      isDelivered: false,
      priority: payload.priority,
    }));

    await this.notificationLogService.createNotificationLogs(logs);

    return notification._id.toString();
  }

  // 🔹 MOST COMMON (ASYNC)
  async createAndDispatchAsync(payload: NotificationCreatePayload) {
    const notificationId = await this.createNotificationWithLogs(payload);
    await this.dispatcher.dispatchAsync(notificationId);
  }

  async createAndDispatchSync(payload: NotificationCreatePayload) {
    const notificationId = await this.createNotificationWithLogs(payload);
    await this.dispatcher.dispatchSync(notificationId);
  }
}
