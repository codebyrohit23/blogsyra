import { buildKey, CacheVersionService } from '@/infra/cache';
import { MongoId } from '@/shared/types';

export const UserCacheKeys = {
  byId: (id: MongoId) => buildKey('user', id.toString()),

  byUsername: (username: string) => buildKey('user', 'username', username),

  list: (queryKey: string, version: number) => buildKey('users', `v${version}`, queryKey),
};

export const USER_CACHE_VERSION_KEYS = {
  LIST: 'users:list:version',
};

export class UserCacheVersion {
  constructor(private readonly version: CacheVersionService) {}

  async getListVersion() {
    return this.version.get(USER_CACHE_VERSION_KEYS.LIST);
  }

  async bumpListVersion() {
    return this.version.bump(USER_CACHE_VERSION_KEYS.LIST);
  }
}
