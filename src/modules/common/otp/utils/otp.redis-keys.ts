import { buildKey } from '@/infra/cache';
import { OtpRefType } from '../otp.type';
import { MongoId } from '@/shared/types';

export const OTP_REDIS_KEYS = {
  otp: (refId: MongoId, purpose: string, refType: OtpRefType) =>
    buildKey('otp', refType, purpose, refId.toString()),

  patterns: {
    otp: () => buildKey('otp', '*'),
  },
};
