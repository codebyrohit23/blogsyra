import { env } from '../env';

export const otpConfig = {
  // encryptionKey: env.OTP_ENC_KEY,
  hmacSecret: env.OTP_HMAC_SECRET,
  otpLength: 6,
  ttl: 5 * 60, // 5 minutes
  resendCooldown: 30, // 30 seconds
  maxAttempts: 5,
};
