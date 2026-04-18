import {
  AccessTokenPayload,
  RefreshTokenPayload,
  AuthTokenPairResponse,
  TokenType,
  ResetPasswordTokenInput,
  TokenResult,
  AuthTokenPairInput,
  ResetPasswordTokenPayload,
  EmailVerificationTokenInput,
  EmailVerificationTokenPayload,
} from '../types';

import { config } from '@/core/config';

import { addTime, generateUniqueId, toStringId } from '@/shared/utils';

import { JWTService } from './jwt.service';
import { CacheService } from '@/infra/cache';
import { jwtInvalidError } from '@/core/error';
import { JwtCacheKeys } from '../cache';

export class JWTManagerService {
  constructor(
    private readonly jwtService: JWTService,
    private readonly cache: CacheService
  ) {}

  public generateEmailVerificationToken(payload: EmailVerificationTokenInput): TokenResult {
    const { id, role } = payload;

    const jti = generateUniqueId();

    const tokenPayload: EmailVerificationTokenPayload = {
      sub: toStringId(id),
      type: TokenType.EMAIL_VERIFICATION,
      jti,
      role,
    };

    const token = this.jwtService.generateEmailVerificationToken(tokenPayload);

    const ttl = config.auth.jwt.resetPassword.expiresIn;

    const expiresAt = addTime({ seconds: ttl });

    return {
      jti,
      token,
      expiresAt,
    };
  }

  public async verifyEmailVerificationToken(token: string): Promise<EmailVerificationTokenPayload> {
    const payload = this.jwtService.verifyEmailVerificationToken(token);
    await this.isRvoked(payload.sub);
    return payload;
  }

  public generateTokenPair(payload: AuthTokenPairInput): AuthTokenPairResponse {
    const { id, sessionId, role, tokenFamily } = payload;

    const acessJti = generateUniqueId();
    const refreshJti = generateUniqueId();

    const accessPayload: AccessTokenPayload = {
      sub: toStringId(id),
      type: TokenType.ACCESS,
      sessionId,
      jti: acessJti,
      role,
    };

    const refreshPayload: RefreshTokenPayload = {
      sub: toStringId(id),
      type: TokenType.REFRESH,
      sessionId,
      tokenFamily,
      jti: refreshJti,
      role,
    };

    const accessToken = this.jwtService.generateAccessToken(accessPayload);
    const refreshToken = this.jwtService.generateRefreshToken(refreshPayload);

    const accessTokenTTL = config.auth.jwt.access.expiresIn;
    const refreshTokenTTL = config.auth.jwt.refresh.expiresIn;

    const accessTokenExpiresAt = addTime({ seconds: accessTokenTTL });
    const refreshTokenExpiresAt = addTime({ seconds: refreshTokenTTL });

    return {
      access: {
        jti: acessJti,
        token: accessToken,
        expiresAt: accessTokenExpiresAt,
      },

      refresh: {
        jti: refreshJti,
        token: refreshToken,
        expiresAt: refreshTokenExpiresAt,
      },
    };
  }

  public async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    const payload = this.jwtService.verifyAccessToken(token);
    await this.isRvoked(payload.sub);
    return payload;
  }

  public async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    const payload = this.jwtService.verifyRefreshToken(token);
    await this.isRvoked(payload.sub);
    return payload;
  }

  public generateResetPasswordToken(payload: ResetPasswordTokenInput): TokenResult {
    const { id, role } = payload;

    const jti = generateUniqueId();

    const tokenPayload: ResetPasswordTokenPayload = {
      sub: toStringId(id),
      type: TokenType.RESET_PASSWORD,
      jti,
      role,
    };

    const token = this.jwtService.generateResetPasswordToken(tokenPayload);

    const resetPasswordTTL = config.auth.jwt.resetPassword.expiresIn;

    const expiresAt = addTime({ seconds: resetPasswordTTL });

    return {
      jti,
      token,
      expiresAt,
    };
  }

  public async verifyResetPasswordToken(token: string): Promise<ResetPasswordTokenPayload> {
    const payload = this.jwtService.verifyResetPasswordToken(token);
    await this.isRvoked(payload.sub);
    return payload;
  }

  public async revokeToken(jti: string) {
    const cacheKey = JwtCacheKeys.blackList(jti);
    return this.cache.set(cacheKey, 1);
  }

  private async isRvoked(jti: string) {
    const cacheKey = JwtCacheKeys.blackList(jti);

    const isRevoked = await this.cache.get(cacheKey);

    if (isRevoked) {
      throw jwtInvalidError();
    }
  }
}
