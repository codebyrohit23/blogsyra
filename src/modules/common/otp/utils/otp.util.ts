import { config } from '@/core/config';
import { EncryptedOTP } from '../otp.type';
import { randomBytes, createCipheriv, createDecipheriv, createHmac, timingSafeEqual } from 'crypto';

// const ENCRYPTION_KEY = config.otp.encryptionKey;
const HMAC_SECRET = config.otp.hmacSecret;

// export function encryptOTP(otp: string): EncryptedOTP {
//   const iv = randomBytes(12);

//   const cipher = createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);

//   const encrypted = Buffer.concat([cipher.update(otp, 'utf8'), cipher.final()]);

//   const tag = cipher.getAuthTag();

//   return {
//     encrypted: encrypted.toString('hex'),
//     iv: iv.toString('hex'),
//     tag: tag.toString('hex'),
//   };
// }

// export function decryptOTP(data: EncryptedOTP): string {
//   const decipher = createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, Buffer.from(data.iv, 'hex'));

//   decipher.setAuthTag(Buffer.from(data.tag, 'hex'));

//   const decrypted = Buffer.concat([
//     decipher.update(Buffer.from(data.encrypted, 'hex')),
//     decipher.final(),
//   ]);

//   return decrypted.toString('utf8');
// }

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
