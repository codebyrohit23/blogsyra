import { config } from '@/core/config';
import { createHmac, timingSafeEqual } from 'crypto';

const HMAC_SECRET = config.otp.hmacSecret;

export function hashOTP(otp: string): string {
  return createHmac('sha256', HMAC_SECRET).update(otp).digest('hex');
}

export function verifyOTP(input: string, storedHash: string): boolean {
  const inputHash = hashOTP(input);

  return timingSafeEqual(Buffer.from(inputHash, 'hex'), Buffer.from(storedHash, 'hex'));
}

export function generateOTP(length = 6): string {
  const digits = '0123456789';
  let otp = '';

  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  return otp;
}
