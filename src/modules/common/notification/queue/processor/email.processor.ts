import { baseTemplate, EmailService } from '@email/index';
import { NotificationDocument, NotificationLogService, ReceiverType } from '@notification/index';

const notificationLogService = new NotificationLogService();

export const emailProcessor = async (logId: string) => {
  const log = await notificationLogService.getNotificationLog(logId);

  const notification = log.notificationId as NotificationDocument;

  const receiver = log.receiverId;

  const { title, message } = notification;

  const { email } = receiver as ReceiverType;

  const content = baseTemplate(title, message);

  await EmailService.SGSendEmail({ to: email, subject: title, html: content });

  const notificationPayload = {
    isDelivered: true,
    deliveredAt: new Date(),
  };

  console.log('email', email);
  await notificationLogService.updateNotificationLog(logId, notificationPayload);
};
