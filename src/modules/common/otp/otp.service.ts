import { Types } from 'mongoose';
import { OtpRepository } from './otp.repository';
import { ICreateOtp, IVerifyOtp, OtpPurpose, OtpRefType, OtpStatus } from './otp.type';
import { generateOTP, hashOTP, OTP_REDIS_KEYS, verifyOTP } from './utils';
import { config } from '@/core/config';
import { CacheService } from '@/core/cache';
import { logger } from '@/core/logger';
import { ApiError, toISO } from '@/shared/utils';
import { OtpLean } from './otp.model';
import { EmailService, otpTemplate } from '../email';

export class OtpService {
  constructor(
    private readonly repo: OtpRepository,
    private readonly cache: CacheService,
    private readonly emailService: EmailService
  ) {}

  public async sendOtp(
    refId: Types.ObjectId,
    email: string,
    purpose: OtpPurpose,
    refType: OtpRefType
  ) {
    const lastOtp = await this.getOtp(refId, purpose, refType);

    const now = Date.now();
    const COOLDOWN = config.otp.resendCooldown;

    if (lastOtp && lastOtp.createdAt && now - new Date(lastOtp.createdAt).getTime() <= COOLDOWN) {
      logger.info(
        `Please wait ${lastOtp.createdAt && now - lastOtp.createdAt.getTime()}s before requesting OTP again`
      );
      return;
    }

    const expiresAt = new Date(now + config.otp.ttl * 1000);

    await this.repo.updateMany(
      { refId, purpose, refType, status: OtpStatus.ACTIVE },
      { status: OtpStatus.EXPIRED }
    );

    const otpCode = await this.createOtp({ refId, refType, purpose, expiresAt });

    const expiresIn = config.otp.ttl / 60;

    const html = otpTemplate({ code: otpCode, expiresIn });
    await this.emailService.sendEmail({ to: email, subject: 'Your Verification Code', html });
    return otpCode;
  }

  public async verifyOtp(payload: IVerifyOtp) {
    const { refType, refId, purpose, code } = payload;

    const otpRecord = await this.getOtp(refId, purpose, refType);

    if (!otpRecord) {
      throw new ApiError('Invalid or expired OTP');
    }

    const now = Date.now();

    const expiresAt = new Date(otpRecord?.expiresAt).getTime();

    if (expiresAt < now || otpRecord.attempts >= config.otp.maxAttempts) {
      throw new ApiError('Invalid or expired OTP');
    }

    if (!verifyOTP(code, otpRecord.otpHash)) {
      const updated = await this.incrementAttempts(otpRecord._id);

      const redisKey = OTP_REDIS_KEYS.otp(refId.toString(), purpose, refType);

      if (updated && updated.attempts >= config.otp.maxAttempts) {
        await Promise.all([
          this.repo.updateOne({ _id: updated._id }, { status: OtpStatus.BLOCKED }),
          this.cache.del(redisKey),
        ]);
      }
      const ttl = Math.max(0, Math.floor((expiresAt - now) / 1000));

      await this.cache.set(redisKey, updated, ttl);

      throw new ApiError('Invalid or expired OTP');
    }

    const redisKey = OTP_REDIS_KEYS.otp(refId.toString(), purpose, refType);

    await Promise.all([
      this.repo.updateOne({ _id: otpRecord._id }, { status: OtpStatus.VERIFIED }),
      this.cache.del(redisKey),
    ]);
  }

  private async getOtp(
    refId: Types.ObjectId,
    purpose: OtpPurpose,
    refType: OtpRefType
  ): Promise<OtpLean | null> {
    const redisKey = OTP_REDIS_KEYS.otp(refId.toString(), purpose, refType);

    const cached = await this.cache.get<OtpLean>(redisKey);

    if (cached) return cached;

    const filter = {
      refId,
      purpose,
      refType,
      status: OtpStatus.ACTIVE,
    };

    const otp = await this.repo.findOne({ filter, sort: { createdAt: -1 } });

    if (otp) {
      const ttl = Math.floor((otp.expiresAt.getTime() - Date.now()) / 1000);

      if (ttl > 0 && otp) {
        await this.cache.set(redisKey, otp, ttl);
      }
    }

    return otp;
  }

  private async createOtp(payload: ICreateOtp): Promise<string> {
    const otpCode = generateOTP(config.otp.otpLength);

    const otpHash = hashOTP(otpCode);

    const otp = await this.repo.create({ ...payload, otpHash });

    const redisKey = OTP_REDIS_KEYS.otp(payload.refId.toString(), payload.purpose, payload.refType);

    const ttl = Math.max(0, Math.floor((otp.expiresAt.getTime() - Date.now()) / 1000));

    if (ttl > 0) {
      await this.cache.set(redisKey, otp, ttl);
    }

    return otpCode;
  }

  private async incrementAttempts(id: Types.ObjectId): Promise<OtpLean | null> {
    return this.repo.updateOne(
      { _id: id, attempts: { $lt: config.otp.maxAttempts } },
      { $inc: { attempts: 1 } }
    );
  }
}

// A. Per User (phone/email)
// 3 OTPs per 10 minutes
// 5 OTPs per hour

// 10 requests per minute
// 100 per hour
