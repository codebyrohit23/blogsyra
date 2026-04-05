// import { TokenRedisService } from './token.redis.service.js';

// export class TokenRepository {
//   private static tokenService = new TokenRedisService();

//   static async storeRefreshToken(sessionId: string, token: string): Promise<void> {
//     return this.tokenService.storeRefreshToken(sessionId, token);
//   }
//   static async getRefreshToken(sessionId: string): Promise<string | null> {
//     return this.tokenService.getRefreshToken(sessionId);
//   }
//   static async revokeRefreshToken(sessionId: string): Promise<void> {
//     return this.tokenService.revokeRefreshToken(sessionId);
//   }
//   static async blacklistAccessToken(jti: string): Promise<void> {
//     return this.tokenService.blacklistAccessToken(jti);
//   }
//   static async isAccessTokenBlacklisted(jti: string): Promise<boolean> {
//     return this.tokenService.isAccessTokenBlacklisted(jti);
//   }

//   static async storeResetPasswordToken(jti: string, token: string): Promise<void> {
//     return this.tokenService.storeResetPasswordToken(jti, token);
//   }
//   static async getResetPasswordToken(jti: string): Promise<string | null> {
//     return this.tokenService.getResetPasswordToken(jti);
//   }
//   static async revokeResetPasswordToken(jti: string): Promise<void> {
//     return this.tokenService.revokeResetPasswordToken(jti);
//   }
// }
