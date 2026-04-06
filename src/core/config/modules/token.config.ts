import { env } from '../env';

export const tokenConfig = {
  privateKey: env.TOKEN_PRIVATE_KEY?.replace(/\\n/g, '\n') // escaped newlines → real newlines
    .replace(/\r\n/g, '\n') // Windows line endings
    .trim(),

  publicKey: env.TOKEN_PUBLIC_KEY?.replace(/\\n/g, '\n').trim(),

  access: {
    // secret: env.ACCESS_TOKEN_SECRET,
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  },
  refresh: {
    // secret: env.REFRESH_TOKEN_SECRET,
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  },
  resetPassword: {
    // secret: env.RESET_PASSWORD_TOKEN_SECRET,
    expiresIn: env.RESET_PASSWORD_TOKEN_EXPIRES_IN,
  },
  emailVerification: {
    // secret: env.EMAIL_VERIFICATION_TOKEN_SECRET,
    expiresIn: env.EMAIL_VERIFICATION_TOKEN_EXPIRES_IN,
  },
};
