import {
  NotificationChannelEnum,
  NotificationDocument,
  NotificationLogService,
} from '@/modules/common/notification';
import { emailProcessor } from './email.processor';

const notificationLogService = new NotificationLogService();

export const processNotification = async (notificationLogId: string) => {
  console.log('notification', notificationLogId);

  const log = await notificationLogService.getNotificationLog(notificationLogId);

  const notification = log.notificationId as NotificationDocument;

  const channels = notification.channel;

  if (!notification || !channels || !channels.length) return;

  if (channels.includes(NotificationChannelEnum.EMAIL)) emailProcessor(notificationLogId);
};
