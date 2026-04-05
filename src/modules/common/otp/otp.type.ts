import { Channel, MODELS } from '@/shared/constants';
import { Types } from 'mongoose';

export interface CreateOtpInput {
  refId: Types.ObjectId;
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

export interface EncryptedOTP {
  encrypted: string;
  iv: string;
  tag: string;
}

export interface ICreateOtp {
  refId: Types.ObjectId;
  refType: OtpRefType;
  purpose: OtpPurpose;
  expiresAt: Date;
}

export interface IVerifyOtp {
  refId: Types.ObjectId;
  refType: OtpRefType;
  purpose: OtpPurpose;
  code: string;
}
