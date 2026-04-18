import { OtpRepository } from './otp.repository';
import { cacheService } from '@/infra/cache';
import { OtpService } from './otp.service';
// import { emailService } from '../email';

const otpRepository = new OtpRepository();

export const otpService = new OtpService(otpRepository, cacheService);
