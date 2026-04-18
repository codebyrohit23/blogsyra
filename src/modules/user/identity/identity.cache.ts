import { buildKey } from '@/infra/cache';
import { MongoId } from '@/shared/types';
import { toStringId } from '@/shared/utils';

export const IdentityCacheKeys = {
  byEmail: (email: string) => buildKey('identity', 'email', email),

  byUserId: (userId: MongoId) => buildKey('identity', 'userId', toStringId(userId)),
};
