// import { RedisKeys, RedisService } from '@db/redis/index';
// import ms, { StringValue } from 'ms';
// import { OtpEnum } from './otp.type';
// import { otpConfig } from '@/config';

// interface OtpPayload {
//   otp: string;
//   type: OtpEnum;
//   targetId: string;
// }

// interface OtpData {
//   otp: string;
//   targetId: string;
//   attempts: number;
//   expiresAt: string;
//   lockedUntil: string | null;
// }

// interface OtpVerificationResult {
//   valid: boolean;
//   reason?: string;
// }

// function addMilliseconds(date: Date, msValue: number): Date {
//   return new Date(date.getTime() + msValue);
// }

// function isAfter(date1: Date, date2: Date): boolean {
//   return date1.getTime() > date2.getTime();
// }

// export class OtpRedis extends RedisService {
//   private getKey(type: OtpEnum, targetId: string): string {
//     return RedisKeys.OTP.key(type, targetId);
//   }

//   private getExpiryDuration(type: OtpEnum): number {
//     switch (type) {
//       case OtpEnum.FORGOT_PASSWORD:
//         return ms(otpConfig.FORGOT_EXPIRES_IN as StringValue);
//       case OtpEnum.EMAIL_VERIFICATION:
//         return ms(otpConfig.EMAIL_EXPIRES_IN as StringValue);
//       default:
//         return ms('5m');
//     }
//   }

//   async setOtp({ otp, type, targetId }: OtpPayload): Promise<OtpData> {
//     const ttlMs = this.getExpiryDuration(type);
//     const expiresAt = addMilliseconds(new Date(), ttlMs);

//     const payload: OtpData = {
//       otp,
//       targetId,
//       attempts: 0,
//       expiresAt: expiresAt.toISOString(),
//       lockedUntil: null,
//     };

//     const key = this.getKey(type, targetId);
//     await this.set(key, payload, ttlMs / 1000);
//     return payload;
//   }

//   async verifyOtp({
//     otp,
//     type,
//     targetId,
//   }: {
//     otp: string;
//     type: OtpEnum;
//     targetId: string;
//   }): Promise<OtpVerificationResult> {
//     const key = this.getKey(type, targetId);
//     const otpData = await this.get<OtpData>(key);

//     if (!otpData) return { valid: false, reason: 'OTP expired or not found' };

//     // Locked
//     if (otpData.lockedUntil && isAfter(new Date(otpData.lockedUntil), new Date())) {
//       return { valid: false, reason: 'Too many attempts. Try again later.' };
//     }

//     // Wrong OTP → increment attempts
//     if (otpData.otp !== otp) {
//       otpData.attempts += 1;

//       if (otpData.attempts >= otpConfig.MAX_ATTEMPTS) {
//         otpData.lockedUntil = addMilliseconds(new Date(), ms('2h')).toISOString();
//       }

//       await this.set(key, otpData);
//       return { valid: false, reason: 'Invalid OTP' };
//     }

//     // ✅ Correct OTP
//     await this.del(key);
//     return { valid: true };
//   }

//   async incrementAttempts(type: OtpEnum, targetId: string): Promise<OtpData | null> {
//     const key = this.getKey(type, targetId);
//     const otpData = await this.get<OtpData>(key);
//     if (!otpData) return null;

//     otpData.attempts += 1;

//     if (otpData.attempts >= otpConfig.MAX_ATTEMPTS) {
//       otpData.lockedUntil = addMilliseconds(new Date(), ms('2h')).toISOString();
//     }

//     await this.set(key, otpData);
//     return otpData;
//   }

//   async getOtp(type: OtpEnum, targetId: string): Promise<OtpData | null> {
//     return this.get<OtpData>(this.getKey(type, targetId));
//   }

//   async deleteOtp(type: OtpEnum, targetId: string): Promise<void> {
//     await this.del(this.getKey(type, targetId));
//   }
// }
