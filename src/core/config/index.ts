import { SALT_ROUNDS } from '@/shared/constants/constants';
import {
  appConfig,
  dbConfig,
  redisConfig,
  otpConfig,
  sendGridConfig,
  cloudinaryConfig,
  tokenConfig,
  authConfig,
} from './modules';

export const config = {
  app: appConfig,
  db: dbConfig,
  redis: redisConfig,
  auth: authConfig,
  // auth: {
  //   ...authConfig,
  //   saltRounds: SALT_ROUNDS,
  //   token: tokenConfig,
  // },
  otp: otpConfig,
  sendGrid: sendGridConfig,
  cloudinary: cloudinaryConfig,
} as const;
