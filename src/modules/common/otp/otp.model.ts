import mongoose, { InferSchemaType, Schema, Types, HydratedDocument } from 'mongoose';
import { Channel, MODELS } from '@/shared/constants';
import { OtpPurpose, OtpRefType, OtpStatus } from './otp.type';
import { config } from '@/core/config';

const OtpSchema = new Schema(
  {
    // 🔗 Who this OTP belongs to (User/Admin/etc.)
    refId: {
      type: Schema.Types.ObjectId,
      refPath: 'refType',
      required: true,
    },

    refType: {
      type: String,
      required: true,
      enum: Object.values(OtpRefType), // dynamic models
    },

    // 🎯 Purpose of OTP
    purpose: {
      type: String,
      enum: Object.values(OtpPurpose),
      required: true,
    },

    // 🔐 Store hashed OTP (NEVER plain)
    otpHash: {
      type: String,
      required: true,
    },

    // 📡 Channel
    channel: {
      type: String,
      enum: Object.values(Channel),
      default: Channel.EMAIL,
    },

    // 🔢 Attempts control
    attempts: {
      type: Number,
      default: 0,
    },

    maxAttempts: {
      type: Number,
      default: config.otp.maxAttempts,
    },

    // ⏳ Expiry
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },

    // 🚦 Status
    status: {
      type: String,
      enum: Object.values(OtpStatus),
      default: OtpStatus.ACTIVE,
    },

    // 🔐 Security tracking (optional but recommended)
    deviceId: String,
    ip: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

// 🔍 Optimized indexes
OtpSchema.index({ refId: 1, purpose: 1, status: 1 });
// OtpSchema.index({ expiresAt: 1 });

export const OtpModel = mongoose.model(MODELS.COMMON.OTP, OtpSchema);

export type Otp = InferSchemaType<typeof OtpSchema>;
export type OtpDocument = HydratedDocument<Otp>;
export type OtpLean = { _id: Types.ObjectId } & Otp;
