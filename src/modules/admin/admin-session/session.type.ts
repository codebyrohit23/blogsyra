// import { MODELS } from '@/shared/constants';
// import { Types } from 'mongoose';

// // export enum AdminDeviceEnum {
// //   WEB = 'WEB',
// //   MOBILE = 'MOBILE',
// //   DESKTOP = 'DESKTOP',
// //   TABLET = 'TABLET',
// // }

// export const SessionRefType = {
//   ADMIN: MODELS.ADMIN.ADMIN,
//   USER: MODELS.APP.USER,
// } as const;

// export type SessionRefType = (typeof SessionRefType)[keyof typeof SessionRefType];

// export enum SessionStatusEnum {
//   ACTIVE = 'ACTIVE',
//   LOGGED_OUT = 'LOGGED_OUT',
//   EXPIRED = 'EXPIRED',
//   REVOKED = 'REVOKED',
// }

// export enum SessionRevokeReasonEnum {
//   LOGOUT = 'LOGOUT',
//   PASSWORD_CHANGE = 'PASSWORD_CHANGE',
//   ADMIN_FORCE_LOGOUT = 'ADMIN_FORCE_LOGOUT',
//   TOKEN_COMPROMISED = 'TOKEN_COMPROMISED',
//   SESSION_EXPIRED = 'SESSION_EXPIRED',
// }

// export interface CreateSessionPayload {
//   adminId: Types.ObjectId;
//   sessionId: string;
//   deviceId: string;
//   deviceType: AdminDeviceEnum;
//   refreshTokenHash: string;
//   expiresAt: Date;
//   fcmToken: string;

//   os?: string;
//   ip?: string;
//   location?: string;
// }
