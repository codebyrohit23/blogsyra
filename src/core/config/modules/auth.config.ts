import { REDIS_TTL } from '@/shared/constants';
import { env } from '../env';
import { SALT_ROUNDS } from '@/shared/constants';

export const authConfig = {
  jwt: {
    privateKey: env.JWT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    publicKey: env.JWT_PUBLIC_KEY?.replace(/\\n/g, '\n'),

    access: {
      expiresIn: REDIS_TTL.REFRESH_TOKEN,
    },
    refresh: {
      expiresIn: REDIS_TTL.REFRESH_TOKEN,
    },
    resetPassword: {
      expiresIn: REDIS_TTL.REFRESH_TOKEN,
    },
    emailVerification: {
      expiresIn: REDIS_TTL.EMAIL_VERIFICATION_TOKEN,
    },
  },

  saltRounds: SALT_ROUNDS,

  google: {
    clinetId: env.GOOGLE_CLIENT_ID,
  },
};
