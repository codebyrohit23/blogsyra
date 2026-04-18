import { REDIS_TTL } from '@/shared/constants';

export const tokenConfig = {
  // privateKey: env.TOKEN_PRIVATE_KEY?.replace(/\\n/g, '\n') // escaped newlines → real newlines
  //   .replace(/\r\n/g, '\n') // Windows line endings
  //   .trim(),
  // publicKey: env.TOKEN_PUBLIC_KEY?.replace(/\\n/g, '\n').trim(),
  // access: {
  //   expiresIn: REDIS_TTL.REFRESH_TOKEN,
  // },
  // refresh: {
  //   expiresIn: REDIS_TTL.REFRESH_TOKEN,
  // },
  // resetPassword: {
  //   expiresIn: REDIS_TTL.REFRESH_TOKEN,
  // },
  // emailVerification: {
  //   expiresIn: REDIS_TTL.EMAIL_VERIFICATION_TOKEN,
  // },
};
