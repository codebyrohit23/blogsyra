import { Schema, model } from 'mongoose';
import { NotificationLogDocument, ReceiverTypeEnum } from '../types/notificationLog.type';

const NotificationLogSchema = new Schema<NotificationLogDocument>(
  {
    notificationId: {
      type: Schema.Types.ObjectId,
      ref: 'Notification',
      required: true,
      index: true,
    },
    receiverType: {
      type: String,
      enum: Object.values(ReceiverTypeEnum),
      required: true,
      index: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'receiverType',
      index: true,
    },
    isRead: { type: Boolean, default: false, index: true },
    readAt: { type: Date },
    isDelivered: { type: Boolean, default: true },
    deliveredAt: { type: Date, default: Date.now },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Compound indexes for performance
NotificationLogSchema.index({ receiverType: 1, receiverId: 1 });
NotificationLogSchema.index({ notificationId: 1, receiverId: 1 });
NotificationLogSchema.index({ isRead: 1, receiverId: 1 });
NotificationLogSchema.index({ createdAt: -1 });

export const NotificationLog = model<NotificationLogDocument>(
  'NotificationLog',
  NotificationLogSchema
);
