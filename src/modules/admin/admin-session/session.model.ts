// import { DEFAULT_TIMEZONE, MODELS, Platform } from '@/shared/constants';
// import mongoose, { HydratedDocument, InferSchemaType, Schema, Types } from 'mongoose';
// import { SessionRefType, SessionStatusEnum } from './session.type';

// const SessionSchema = new Schema(
//   {
//     refId: {
//       type: Schema.Types.ObjectId,
//       refPath: 'refType',
//       required: true,
//     },

//     refType: {
//       type: String,
//       required: true,
//       enum: Object.values(SessionRefType),
//     },

//     sessionId: {
//       type: String,
//       required: true,
//     },

//     deviceId: {
//       type: String,
//       required: true,
//     },

//     platform: {
//       type: String,
//       enum: Object.values(Platform),
//       required: true,
//     },

//     loggedInAt: {
//       type: Date,
//       required: true,
//       default: Date.now,
//     },

//     expiresAt: Date,

//     loggedOutAt: Date,

//     lastActiveAt: {
//       type: Date,
//       default: Date.now,
//     },

//     fcmToken: String,

//     timezone: {
//       type: String,
//       default: DEFAULT_TIMEZONE,
//     },

//     ip: String,
//     location: String,

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

// SessionSchema.index({ refId: 1, status: 1 });

// SessionSchema.index({ refId: 1, deviceId: 1 }, { unique: true });

// SessionSchema.index({ sessionId: 1 }, { unique: true });

// export const SessionModel = mongoose.model(MODELS.ADMIN.ADMIN_SESSION, SessionSchema);

// export type Session = InferSchemaType<typeof SessionSchema>;

// export type CreateSessionInput = Omit<Session, 'status' | 'createdAt' | 'updatedAt'>;
// export type UpdateSessionInput = Partial<Session>;

// export type SessionDocument = HydratedDocument<Session>;
// export type SessionLean = { _id: Types.ObjectId } & Session;
