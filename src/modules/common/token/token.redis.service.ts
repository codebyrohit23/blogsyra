// import { RedisKeys, RedisService } from '@db/redis/index';
// import ms, { StringValue } from 'ms';

// export class TokenRedisService extends RedisService {
//   async storeRefreshToken(sessionId: string, token: string): Promise<void> {
//     return this.set(
//       RedisKeys.AUTH.SESSION.key(sessionId),
//       token,
//       ms(RedisKeys.AUTH.SESSION.time as StringValue)
//     );
//   }
//   async getRefreshToken(sessionId: string): Promise<string | null> {
//     return this.get<string>(RedisKeys.AUTH.SESSION.key(sessionId));
//   }

//   async revokeRefreshToken(sessionId: string): Promise<void> {
//     await this.del(RedisKeys.AUTH.SESSION.key(sessionId));
//   }

//   async blacklistAccessToken(jti: string): Promise<void> {
//     return this.set(RedisKeys.AUTH.BLACKLIST.key(jti), jti);
//   }
//   async isAccessTokenBlacklisted(jti: string): Promise<boolean> {
//     return this.exists(RedisKeys.AUTH.SESSION.key(jti));
//   }

//   async storeResetPasswordToken(jti: string, token: string): Promise<void> {
//     return await this.set(
//       RedisKeys.AUTH.RESET_PASSWORD.key(jti),
//       token,
//       ms(RedisKeys.AUTH.RESET_PASSWORD.time as StringValue)
//     );
//   }
//   async getResetPasswordToken(jti: string): Promise<string | null> {
//     return this.get<string>(RedisKeys.AUTH.RESET_PASSWORD.key(jti));
//   }
//   async revokeResetPasswordToken(jti: string): Promise<void> {
//     await this.del(RedisKeys.AUTH.RESET_PASSWORD.key(jti));
//   }
// }
