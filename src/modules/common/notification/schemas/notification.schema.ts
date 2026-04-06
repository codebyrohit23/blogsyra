// import { z } from 'zod';

// import {
//   NotificationChannelEnum,
//   NotificationPriorityEnum,
//   NotificationType,
//   SenderEnum,
// } from '../types/notification.type';
// import { OBJECT_Id_REGEX } from '@utils/index';

// const notificationBaseSchema = {
//   type: z.nativeEnum(NotificationType, {
//     errorMap: () => ({ message: 'Invalid notification type' }),
//   }),

//   title: z
//     .string()
//     .min(2, 'Notification title must be at least 2 characters')
//     .max(100, 'Notification title cannot exceed 100 characters'),

//   message: z
//     .string()
//     .min(2, 'Notification message must be at least 2 characters')
//     .max(500, 'Notification message cannot exceed 500 characters'),

//   data: z.record(z.any()).optional(),

//   senderType: z.nativeEnum(SenderEnum, {
//     errorMap: () => ({ message: 'Invalid sender type' }),
//   }),

//   senderId: z.string().regex(OBJECT_Id_REGEX, 'Invalid sender Id'),

//   channel: z
//     .array(
//       z.nativeEnum(NotificationChannelEnum, {
//         errorMap: () => ({ message: 'Invalid notification channel' }),
//       })
//     )
//     .default([NotificationChannelEnum.IN_APP]),

//   priority: z
//     .nativeEnum(NotificationPriorityEnum, {
//       errorMap: () => ({ message: 'Invalid priority type' }),
//     })
//     .default(NotificationPriorityEnum.NORMAL),
// };
// export const createNotificationSchema = z.object({
//   ...notificationBaseSchema,
// });
// export const updateNotificationSchema = z
//   .object({
//     ...notificationBaseSchema,
//   })
//   .partial()
//   .strict();

// export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
// export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>;
