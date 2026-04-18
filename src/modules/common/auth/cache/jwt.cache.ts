import { buildKey } from '@/infra/cache';

export const JwtCacheKeys = {
  blackList: (jti: string) => buildKey('auth', 'blacklist', 'jti', jti),
};
