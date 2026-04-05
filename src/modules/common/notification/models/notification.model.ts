import { Schema, model } from 'mongoose';
import {
  NotificationChannelEnum,
  NotificationDocument,
  NotificationPriorityEnum,
  NotificationType,
  SenderEnum,
} from '../types/notification.type';

const NotificationSchema = new Schema<NotificationDocument>(
  {
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: Schema.Types.Mixed },
    senderType: {
      type: String,
      enum: Object.values(SenderEnum),
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      refPath: 'senderType',
      index: true, // ✅ Enables sender-based queries
    },
    channel: {
      type: [String],
      enum: Object.values(NotificationChannelEnum),
      default: [NotificationChannelEnum.IN_APP],
      index: true, // ✅ For analytics: "how many EMAIL vs PUSH"
    },
    priority: {
      type: String,
      enum: Object.values(NotificationPriorityEnum),
      default: NotificationPriorityEnum.NORMAL,
      index: true, // ✅ For sorting & priority queues
    },
  },
  { timestamps: true }
);

// ✅ Compound indexes for performance
NotificationSchema.index({ senderType: 1, sender: 1 });
NotificationSchema.index({ type: 1, priority: 1 });
NotificationSchema.index({ createdAt: -1 }); // ✅ For pagination (most recent first)
NotificationSchema.index({ updatedAt: -1 });

// ✅ Optional text index for searching title/message
NotificationSchema.index({ title: 'text', message: 'text' });

export const Notification = model<NotificationDocument>('Notification', NotificationSchema);
