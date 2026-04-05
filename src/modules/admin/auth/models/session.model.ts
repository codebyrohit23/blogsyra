// import { MODELS } from '@/shared/constants';
// import mongoose, { HydratedDocument, InferSchemaType, Schema, Types } from 'mongoose';
// import { AdminDeviceEnum, SessionRevokeReasonEnum, SessionStatusEnum } from '../auth.type';

// const SessionSchema = new Schema(
//   {
//     adminId: {
//       type: Schema.Types.ObjectId,
//       ref: MODELS.ADMIN.ADMIN,
//       required: true,
//     },

//     sessionId: {
//       type: String,
//       required: true,
//     },

//     deviceId: {
//       type: String,
//       required: true,
//     },

//     deviceType: {
//       type: String,
//       enum: Object.values(AdminDeviceEnum),
//       required: true,
//     },

//     refreshToken: {
//       type: String,
//       select: false,
//     },

//     expiresAt: {
//       type: Date,
//       index: { expireAfterSeconds: 0 },
//     },

//     revoked: {
//       type: Boolean,
//       default: false,
//     },

//     revokeReason: {
//       type: String,
//       enum: Object.values(SessionRevokeReasonEnum),
//     },

//     loggedOutAt: Date,

//     fcmToken: String,

//     os: String,
//     ip: String,
//     location: String,

//     loggedInAt: {
//       type: Date,
//       default: Date.now,
//     },

//     lastActiveAt: {
//       type: Date,
//       default: Date.now,
//     },

//     status: {
//       type: String,
//       enum: Object.values(SessionStatusEnum),
//       default: SessionStatusEnum.ACTIVE,
//     },
//   },
//   {
//     timestamps: true,
//     collection: 'admin_sessions',
//   }
// );

// SessionSchema.index({ adminId: 1, status: 1 });

// SessionSchema.index({ adminId: 1, deviceId: 1 }, { unique: true });

// SessionSchema.index({ sessionId: 1 }, { unique: true });

// export const SessionModel = mongoose.model(MODELS.ADMIN.ADMIN_SESSION, SessionSchema);

// export type Session = InferSchemaType<typeof SessionSchema>;

// export type CreateSessionInput = Omit<Session, 'createdAt' | 'updatedAt'>;
// export type UpdateSessionInput = Partial<Session>;

// export type SessionDocument = HydratedDocument<Session>;
// export type SessionLean = { _id: Types.ObjectId } & Session;
