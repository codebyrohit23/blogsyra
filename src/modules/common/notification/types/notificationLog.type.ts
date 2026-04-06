// import { BaseDocument, Ref } from '@/types';
// import { Types } from 'mongoose';
// import { NotificationDocument } from './notification.type';
// import { AdminDocument } from '@admin/admins';
// import { UserDocument } from '@user/user.types';

// export enum ReceiverTypeEnum {
//   ADMIN = 'Admin',
//   TEACHER = 'Teacher',
//   STUDENT = 'Student',
//   SCHOOL = 'School',
// }

// export type ReceiverType = AdminDocument | UserDocument;

// export interface NotificationLogDocument extends BaseDocument {
//   notificationId: Types.ObjectId | NotificationDocument;
//   receiverType: ReceiverTypeEnum;
//   receiverId: Types.ObjectId | AdminDocument | UserDocument;
//   isRead: boolean;
//   readAt?: Date;
//   isDelivered: boolean;
//   deliveredAt?: Date;
//   isArchived: boolean;
// }
