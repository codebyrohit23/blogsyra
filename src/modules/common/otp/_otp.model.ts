// import { Schema, UpdateQuery, model } from 'mongoose';
// import { OtpDocument, OtpEnum } from './otp.type';
// import { ChannelEnum, RoleEnum } from '@/types';

// const otpSchema = new Schema<OtpDocument>(
//   {
//     targetId: { type: Schema.Types.ObjectId, required: true },
//     role: { type: String, enum: Object.values(RoleEnum), required: true },
//     type: { type: String, enum: Object.values(OtpEnum), required: true },
//     otp: { type: String, required: true },
//     sessionId: { type: String },
//     attempts: { type: Number, default: 0 },
//     expiresAt: { type: Date, required: true },
//     lockedUntil: { type: Date },
//     channel: {
//       type: String,
//       enum: Object.values(ChannelEnum),
//       required: true,
//       default: ChannelEnum.EMAIL,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Unique index: ensures only one active OTP per target + role + type
// otpSchema.index({ targetId: 1, role: 1, type: 1 }, { unique: true });

// // TTL index: automatically deletes OTPs after expiration
// otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// // Optional: Compound index for faster validation queries
// // Example: find OTP by targetId + role + type + channel
// otpSchema.index({ targetId: 1, role: 1, type: 1, channel: 1 });

// otpSchema.methods = {
//   isAccountLocked(): Promise<boolean> {
//     return this.lockedUntil && this.lockedUntil > Date.now();
//   },

//   async incrementAttempts(): Promise<void> {
//     if (this.lockedUntil && this.lockedUntil < Date.now()) {
//       return this.updateOne({
//         $unset: { lockedUntil: 1 },
//         $set: { attempts: 1 },
//       } as UpdateQuery<OtpDocument>);
//     }

//     const updates: UpdateQuery<OtpDocument> = {
//       $inc: { attempts: 1 },
//     };

//     if (this.attempts + 1 >= 5) {
//       updates.$set = { lockedUntil: new Date(Date.now() + 2 * 60 * 60 * 1000) };
//     }

//     return this.updateOne(updates);
//   },
//   async resetAttempts(): Promise<void> {
//     const updates: UpdateQuery<OtpDocument> = {
//       $set: { attempts: 0 },
//       $unset: { lockedUntil: 1 },
//     };

//     return this.updateOne(updates);
//   },
// };
// export const Otp = model<OtpDocument>('Otp', otpSchema);
