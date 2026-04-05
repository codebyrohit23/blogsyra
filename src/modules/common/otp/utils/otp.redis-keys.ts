import { buildKey } from '@/core/cache';
import { RefType } from 'mongoose';
import { OtpRefType } from '../otp.type';

export const OTP_REDIS_KEYS = {
  otp: (refId: string, purpose: string, refType: OtpRefType) =>
    buildKey('otp', refType, purpose, refId),

  patterns: {
    otp: () => buildKey('otp', '*'),
  },
};
