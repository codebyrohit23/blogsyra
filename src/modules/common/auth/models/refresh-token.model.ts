import mongoose, { HydratedDocument, InferSchemaType, Schema, Types } from 'mongoose';
import { RefreshTokenStatus } from '../types';
import { MODELS } from '@/shared/constants';

const RefreshTokenSchema = new Schema(
  {
    jti: {
      type: String,
      required: true,
    },

    tokenFamily: {
      type: String,
      required: true,
    },

    sessionId: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      index: { expireAfterSeconds: 0 },
    },

    status: {
      type: String,
      enum: Object.values(RefreshTokenStatus),
      default: RefreshTokenStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

RefreshTokenSchema.index({ jti: 1 }, { unique: true });

RefreshTokenSchema.index({ jti: 1, status: 1 });

RefreshTokenSchema.index({ tokenFamily: 1 });

export const RefreshTokenModel = mongoose.model(MODELS.COMMON.REFRESH_TOKEN, RefreshTokenSchema);

export type RefreshToken = InferSchemaType<typeof RefreshTokenSchema>;

// export type CreateRefreshTokenInput = Omit<RefreshToken, 'status' | 'createdAt' | 'updatedAt'>;
// export type UpdateRefreshTokenInput = Partial<RefreshToken>;

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;
export type RefreshTokenLean = { _id: Types.ObjectId } & RefreshToken;
