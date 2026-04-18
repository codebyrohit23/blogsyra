// import { buildKey, CacheVersionService } from '@/infra/cache';
// import { MongoId } from '@/shared/types';
// import { toStringId } from '@/shared/utils';

// export const AuthCacheKeys = {
//   session: {
//     byId: (id: MongoId) => buildKey('auth', 'session', toStringId(id)),
//     bySessionId: (sessionId: string) => buildKey('session', 'sid', sessionId),
//     list: (queryKey: string, version: number) => buildKey('sessions', `v${version}`, queryKey),
//   },

//   token: {
//     blackList: (jti: string) => buildKey('auth', 'blacklist', 'jti', jti),
//   },
// };

// export const AUTH_CACHE_VERSION_KEYS = {
//   LIST: 'users:list:version',
// };

// export class AuthCacheVersion {
//   constructor(private readonly version: CacheVersionService) {}

//   async getListVersion() {
//     return this.version.get(AUTH_CACHE_VERSION_KEYS.LIST);
//   }

//   async bumpListVersion() {
//     return this.version.bump(AUTH_CACHE_VERSION_KEYS.LIST);
//   }
// }
