import { appConfig } from './modules/app.config';
import { dbConfig } from './modules/db.config';
import { tokenConfig } from './modules/token.config';
import { authConfig } from './modules/auth.config';
import { redisConfig } from './modules/redis.config';
import { otpConfig } from './modules/otp.config';
import { rateLimitConfig } from './modules/rate-limit.config';
import { emailConfig } from './modules/email.config';
import { sendGridConfig } from './modules/sendgrid.config';
import { cloudinaryConfig } from './modules/cloudinary.config';

export const config = {
  app: appConfig,
  db: dbConfig,
  token: tokenConfig,
  auth: authConfig,
  redis: redisConfig,
  otp: otpConfig,
  rateLimit: rateLimitConfig,
  email: emailConfig,
  sendGrid: sendGridConfig,
  cloudinary: cloudinaryConfig,
} as const;
