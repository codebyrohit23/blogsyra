import { DEFAULT_TIMEZONE, MODELS, Platform } from '@/shared/constants';
import mongoose, { HydratedDocument, InferSchemaType, Schema, Types } from 'mongoose';
import { SessionRefType, SessionStatus } from '../types';

const SessionSchema = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
    },

    refId: {
      type: Schema.Types.ObjectId,
      refPath: 'refType',
      required: true,
    },

    refType: {
      type: String,
      required: true,
      enum: Object.values(SessionRefType),
    },

    platform: {
      type: String,
      enum: Object.values(Platform),
      required: true,
    },

    deviceId: {
      type: String,
      required: true,
    },

    loggedInAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    expiresAt: Date,

    loggedOutAt: Date,

    lastActiveAt: {
      type: Date,
      default: Date.now,
    },

    fcmToken: String,

    timezone: {
      type: String,
      default: DEFAULT_TIMEZONE,
    },

    ip: String,
    location: String,

    status: {
      type: String,
      enum: Object.values(SessionStatus),
      default: SessionStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

SessionSchema.index({ refId: 1, status: 1 });

SessionSchema.index({ refId: 1, deviceId: 1 }, { unique: true });

SessionSchema.index({ sessionId: 1 }, { unique: true });

export const SessionModel = mongoose.model(MODELS.COMMON.SESSION, SessionSchema);

export type Session = InferSchemaType<typeof SessionSchema>;

export type SessionDocument = HydratedDocument<Session>;
export type SessionLean = { _id: Types.ObjectId } & Session;
