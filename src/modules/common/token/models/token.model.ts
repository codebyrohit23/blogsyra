// import { MODELS } from '@/shared/constants';
// import mongoose, { HydratedDocument, InferSchemaType, Schema, Types } from 'mongoose';
// import { AdminDeviceEnum, TokenRevokeReasonEnum, TokenStatusEnum } from '../auth.type';

// const TokenSchema = new Schema(
//   {
//     jti: {
//       type: String,
//       required: true,
//     },

//     tokenFamily: {
//       type: String,
//       required: true,
//     },

//     expiresAt: {
//       type: Date,
//       index: { expireAfterSeconds: 0 },
//     },

//     revoked: {
//       type: Boolean,
//       default: false,
//     },

//     status: {
//       type: String,
//       enum: Object.values(TokenStatusEnum),
//       default: TokenStatusEnum.ACTIVE,
//     },
//   },
//   {
//     timestamps: true,
//     collection: 'admin_sessions',
//   }
// );

// TokenSchema.index({ adminId: 1, status: 1 });

// TokenSchema.index({ adminId: 1, deviceId: 1 }, { unique: true });

// TokenSchema.index({ sessionId: 1 }, { unique: true });

// export const TokenModel = mongoose.model(MODELS.ADMIN.ADMIN_SESSION, TokenSchema);

// export type Token = InferSchemaType<typeof TokenSchema>;

// export type CreateTokenInput = Omit<Token, 'createdAt' | 'updatedAt'>;
// export type UpdateTokenInput = Partial<Token>;

// export type TokenDocument = HydratedDocument<Token>;
// export type TokenLean = { _id: Types.ObjectId } & Token;

// i want flow create access and refresh token give to user wehn user again refresh balacklist previos refresh token
// and also check currennt refresh token jti is the latest jti if token is valid and does not the old jti than revoke all token family ? all token with that token famuly
