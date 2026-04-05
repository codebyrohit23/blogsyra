import { z } from 'zod';

import { OBJECT_Id_REGEX } from '@utils/index';
import { ReceiverTypeEnum } from '../types/notificationLog.type';
import { objectIdSchema } from '@/schema/objectId.schema';

export const createNotificationLogSchema = z.object({
  // notificationId: z.string().regex(OBJECT_Id_REGEX, 'Invalid notification id'),
  notificationId: objectIdSchema,
  receiverType: z.nativeEnum(ReceiverTypeEnum, {
    errorMap: () => ({ message: 'Invalid receiver type' }),
  }),
  // receiverId: z.string().regex(OBJECT_Id_REGEX, 'Invalid receiver id'),
  receiverId: objectIdSchema,
  isRead: z.boolean().optional(),
  readAt: z.date().optional(),
  isDelivered: z.boolean().optional(),
  deliveredAt: z.date().optional(),
  isArchived: z.boolean().optional(),
});

export const updateNotificationLogSchema = createNotificationLogSchema.partial().strict();

export type CreateNotificationLogInput = z.infer<typeof createNotificationLogSchema>;
export type UpdateNotificationLogInput = z.infer<typeof updateNotificationLogSchema>;
