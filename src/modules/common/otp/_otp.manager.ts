import { GenerateOtpResult, OtpEnum } from './otp.type';
import { AppError } from '@utils/index';
import { OtpRedis } from './otp.redis.service';
import { HttpStatus } from '@/constants/enums';
import { otpConfig } from '@/config';

export class OtpManager {
  private static redis = new OtpRedis();

  static async generateOtp(type: OtpEnum, targetId: string): Promise<GenerateOtpResult> {
    const otp = this.randomOtp(otpConfig.LENGTH);
    const existing = await this.redis.getOtp(type, targetId);

    if (existing && new Date(existing.expiresAt) > new Date()) {
      const wait = Math.ceil((new Date(existing.expiresAt).getTime() - Date.now()) / 1000);
      throw new AppError(`OTP already sent. Please wait ${wait}s.`, HttpStatus.TOO_MANY_REQUESTS);
    }

    await this.redis.setOtp({ otp, type, targetId });
    return {
      otp,
      expiresIn: existing ? existing.expiresAt : otpConfig.FORGOT_EXPIRES_IN || '5m',
    };
  }

  static async verifyOtp(type: OtpEnum, targetId: string, otp: string): Promise<boolean> {
    const result = await this.redis.verifyOtp({ otp, type, targetId });
    if (!result.valid) {
      throw new AppError(result.reason || 'Invalid Otp', HttpStatus.BAD_REQUEST);
    }
    return true;
  }

  static async incrementAttempts(type: OtpEnum, targetId: string): Promise<void> {
    const updated = await this.redis.incrementAttempts(type, targetId);
    if (!updated) {
      throw new AppError('OTP not found or expired.', HttpStatus.NOT_FOUND);
    }
  }

  static async deleteOtp(type: OtpEnum, targetId: string): Promise<void> {
    await this.redis.deleteOtp(type, targetId);
  }

  /**
   * Utility to generate numeric OTP of configurable length.
   */
  private static randomOtp(length: number): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
  }
}
