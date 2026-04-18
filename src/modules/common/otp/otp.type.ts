import { Channel, MODELS } from '@/shared/constants';
import { MongoId } from '@/shared/types';

export interface CreateOtpInput {
  refId: MongoId;
  refType: OtpRefType;
  purpose: OtpPurpose;
  otpHash: string;
  channel?: Channel;
  attempts?: number;
  maxAttempts?: number;

  deviceId?: string;
  ip?: string;
  userAgent?: string;
}

export enum OtpPurpose {
  // SIGNUP = 'SIGNUP',
  // LOGIN = 'LOGIN',
  RESET_PASSWORD = 'reset_password',
  VERIFY_EMAIL = 'verify_email',
}

export enum OtpStatus {
  ACTIVE = 'active',
  VERIFIED = 'verified',
  EXPIRED = 'expired',
  BLOCKED = 'blocked',
}

export const OtpRefType = {
  ADMIN: MODELS.ADMIN.ADMIN,
  USER: MODELS.USER.CORE,
} as const;

export type OtpRefType = (typeof OtpRefType)[keyof typeof OtpRefType];

export interface ICreateOtp {
  refId: MongoId;
  refType: OtpRefType;
  purpose: OtpPurpose;
  expiresAt: Date;
}

export interface IVerifyOtp {
  refId: MongoId;
  refType: OtpRefType;
  purpose: OtpPurpose;
  code: string;
}
