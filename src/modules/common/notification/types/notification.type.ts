// import { Types } from 'mongoose';
// import { ReceiverTypeEnum } from './notificationLog.type';

// export enum NotificationType {
//   NEW_MESSAGE = 'NEW_MESSAGE',
//   NEW_ASSIGNMENT = 'NEW_ASSIGNMENT',
//   FEE_REMINDER = 'FEE_REMINDER',
//   SYSTEM_ALERT = 'SYSTEM_ALERT',
// }

// export enum SenderEnum {
//   ADMIN = 'ADMIN',
//   USER = 'USER',
// }
// export enum NotificationChannelEnum {
//   EMAIL = 'EMAIL',
//   SMS = 'SMS',
//   PUSH = 'PUSH',
//   IN_APP = 'IN_APP',
// }
// export enum NotificationPriorityEnum {
//   LOW = 'LOW',
//   NORMAL = 'NORMAL',
//   HIGH = 'HIGH',
// }

// // NotificationDocument interface extends BaseDocument
// export interface NotificationDocument {
//   type: NotificationType;
//   title: string;
//   message: string;
//   data?: any;
//   senderType: SenderEnum;
//   senderId: Types.ObjectId;
//   channel: NotificationChannelEnum[];
//   priority: NotificationPriorityEnum;
// }

// export interface NotificationCreatePayload {
//   type: NotificationType;
//   title: string;
//   message: string;
//   data?: any;
//   senderType: SenderEnum;
//   senderId: Types.ObjectId;
//   channel: NotificationChannelEnum[];
//   priority: NotificationPriorityEnum;
//   receiverType: ReceiverTypeEnum;
//   receiverIds: Types.ObjectId[] | string[];
// }
