import { env } from '../env';

export const authConfig = {
  saltRounds: env.BCRYPT_SALT_ROUNDS,
};
