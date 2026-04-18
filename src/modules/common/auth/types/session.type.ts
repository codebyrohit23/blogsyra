import { MODELS, Platform } from '@/shared/constants';
import { MongoId } from '@/shared/types';

export interface CreateSessionInput {
  sessionId: string;
  refId: MongoId;
  refType: SessionRefType;
  platform: Platform;
  deviceId: string;
  loggedInAt?: Date;

  expiresAt?: Date;
  loggedOutAt?: Date;
  lastActiveAt?: Date;
  fcmToken?: string;
  timezone?: string;
  ip?: string;
  location?: string;
  status?: SessionStatus;
}

export const SessionRefType = {
  ADMIN: MODELS.ADMIN.ADMIN,
  USER: MODELS.USER.CORE,
} as const;

export type SessionRefType = (typeof SessionRefType)[keyof typeof SessionRefType];

export enum SessionStatus {
  ACTIVE = 'active',
  LOGGED_OUT = 'logged_out',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

// export interface ICreateSession {
//   sessionId: string;
//   refId: Types.ObjectId;
//   refType: SessionRefType;
//   platform: Platform;
//   deviceId: string;
//   expiresAt: Date;

//   fcmToken: string;
//   timezone: string;

//   ip?: string;
//   location?: string;
// }
