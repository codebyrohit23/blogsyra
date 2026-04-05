// import { TokenService } from './token.service';

// import {
//   AccessTokenPayload,
//   RefreshTokenPayload,
//   TokenPairResult,
//   TokenType,
//   GenerateTokenPairInput,
//   GenerateResetPasswordInput,
//   ResetPasswordTokenPayload,
//   TokenResult,
// } from './token.type';

// import { config } from '@/core/config';
// import { addTime, generateUniqueId } from '@/shared/utils';

// export class TokenManager {
//   constructor(private readonly tokenService: TokenService) {}

//   public generateTokenPair(payload: GenerateTokenPairInput): TokenPairResult {
//     const { id, sessionId, deviceId, role } = payload;

//     const jti = generateUniqueId();
//     const tokenFamily = generateUniqueId();

//     const accessPayload: AccessTokenPayload = {
//       sub: id,
//       deviceId,
//       type: TokenType.ACCESS,
//       sessionId,
//       jti,
//       role,
//     };

//     const refreshPayload: RefreshTokenPayload = {
//       sub: id,
//       deviceId,
//       type: TokenType.REFRESH,
//       sessionId,
//       tokenFamily,
//       jti,
//       role,
//     };

//     const accessToken = this.tokenService.generateAccessToken(accessPayload);
//     const refreshToken = this.tokenService.generateRefreshToken(refreshPayload);

//     const accessTokenTTL = config.token.access.expiresIn;
//     const refreshTokenTTL = config.token.refresh.expiresIn;

//     const accessTokenExpiresAt = addTime({ seconds: accessTokenTTL });
//     const refreshTokenExpiresAt = addTime({ seconds: refreshTokenTTL });

//     return {
//       sessionId,
//       access: {
//         token: accessToken,
//         expiresAt: accessTokenExpiresAt,
//       },

//       refresh: {
//         token: refreshToken,
//         expiresAt: refreshTokenExpiresAt,
//       },
//     };
//   }

//   verifyAccessToken(aceessToken: string): AccessTokenPayload {
//     const payload = this.tokenService.verifyAccessToken(aceessToken);
//     return payload;
//   }

//   public verifyRefreshToken(refreshToken: string): RefreshTokenPayload {
//     const payload = this.tokenService.verifyRefreshToken(refreshToken);
//     return payload;
//   }

//   public generateResetPasswordToken(payload: GenerateResetPasswordInput): TokenResult {
//     const { id, role } = payload;

//     const jti = generateUniqueId();

//     const resetPasswordPayload: ResetPasswordTokenPayload = {
//       sub: id,
//       type: TokenType.RESET_PASSWORD,
//       jti,
//       role,
//     };

//     const resetPasswordToken = this.tokenService.generateResetPasswordToken(resetPasswordPayload);

//     const resetPasswordTTL = config.token.resetPassword.expiresIn;

//     const accessTokenExpiresAt = addTime({ seconds: resetPasswordTTL });

//     return {
//       token: resetPasswordToken,
//       expiresAt: accessTokenExpiresAt,
//     };
//   }
// }
