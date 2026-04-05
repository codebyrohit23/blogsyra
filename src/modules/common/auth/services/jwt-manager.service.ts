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
import { addTime, generateUniqueId } from '@/shared/utils';

import { JWTService } from './jwt.service';

export class JWTManagerService {
  constructor(private readonly jwtService: JWTService) {}

  public generateEmailVerificationToken(payload: EmailVerificationTokenInput): TokenResult {
    const { id, role } = payload;

    const jti = generateUniqueId();

    const tokenPayload: EmailVerificationTokenPayload = {
      sub: id,
      type: TokenType.EMAIL_VERIFICATION,
      jti,
      role,
    };

    const token = this.jwtService.generateEmailVerificationToken(tokenPayload);

    const ttl = config.token.resetPassword.expiresIn;

    const expiresAt = addTime({ seconds: ttl });

    return {
      jti,
      token,
      expiresAt,
    };
  }

  public verifyEmailVerificationToken(token: string): EmailVerificationTokenPayload {
    const payload = this.jwtService.verifyEmailVerificationToken(token);
    return payload;
  }

  public generateTokenPair(payload: AuthTokenPairInput): AuthTokenPairResponse {
    const { id, sessionId, role, tokenFamily } = payload;

    const acessJti = generateUniqueId();
    const refreshJti = generateUniqueId();

    const accessPayload: AccessTokenPayload = {
      sub: id,
      type: TokenType.ACCESS,
      sessionId,
      jti: acessJti,
      role,
    };

    const refreshPayload: RefreshTokenPayload = {
      sub: id,
      type: TokenType.REFRESH,
      sessionId,
      tokenFamily,
      jti: refreshJti,
      role,
    };

    const accessToken = this.jwtService.generateAccessToken(accessPayload);
    const refreshToken = this.jwtService.generateRefreshToken(refreshPayload);

    const accessTokenTTL = config.token.access.expiresIn;
    const refreshTokenTTL = config.token.refresh.expiresIn;

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

  verifyAccessToken(token: string): AccessTokenPayload {
    const payload = this.jwtService.verifyAccessToken(token);
    return payload;
  }

  public verifyRefreshToken(token: string): RefreshTokenPayload {
    const payload = this.jwtService.verifyRefreshToken(token);
    return payload;
  }

  public generateResetPasswordToken(payload: ResetPasswordTokenInput): TokenResult {
    const { id, role } = payload;

    const jti = generateUniqueId();

    const tokenPayload: ResetPasswordTokenPayload = {
      sub: id,
      type: TokenType.RESET_PASSWORD,
      jti,
      role,
    };

    const token = this.jwtService.generateResetPasswordToken(tokenPayload);

    const resetPasswordTTL = config.token.resetPassword.expiresIn;

    const expiresAt = addTime({ seconds: resetPasswordTTL });

    return {
      jti,
      token,
      expiresAt,
    };
  }

  public verifyResetPasswordToken(token: string): ResetPasswordTokenPayload {
    const payload = this.jwtService.verifyResetPasswordToken(token);
    return payload;
  }
}
