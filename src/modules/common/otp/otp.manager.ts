// import { CacheService } from '@/core/cache';
// import { OtpService } from './otp.service';
// import { OtpPurpose, OtpRefType } from './otp.type';
// import { Role } from '@/shared/constants';
// import { RefType, Types } from 'mongoose';
// import { config } from '@/core/config';
// import { logger } from '@/core/logger';

// export class OtpManager {
//   constructor(
//     private readonly otpService: OtpService,
//     private readonly cache: CacheService
//   ) {}

//   public async sendOtp(refId: Types.ObjectId, purpose: OtpPurpose, refType: OtpRefType) {
//     const lastOtp = await this.otpService.getOtp(refId, purpose);

//     const now = Date.now();
//     const COOLDOWN = config.otp.resendCooldown;

//     if (lastOtp && lastOtp.createdAt && now - lastOtp.createdAt.getTime() >= COOLDOWN) {
//       logger.info(`Wait ${now - lastOtp.createdAt.getTime()}s before requesting OTP again`);
//       return;
//     }

//     const expiresAt = new Date(now + config.otp.ttl * 1000);

//     const otpCode = await this.otpService.createOtp({ refId, refType, purpose, expiresAt });

//     return otpCode;
//   }

//   public async verifyOtp(refId: Types.ObjectId, refType: RefType, purpose: OtpPurpose) {

//     const otpDoc = await this.otpService.getOtp()
//   }
// }
