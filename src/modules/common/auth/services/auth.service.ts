import { ApiError, generateUniqueId } from '@/shared/utils';
import {
  AuthTokenPairResponse,
  CreateSessionAndIssueTokensPayload,
  CreateSessionAndIssueTokensResponse,
  EmailVerificationTokenInput,
  ResetPasswordTokenInput,
  SessionRefType,
  TokenType,
  VerifiedTokenResponse,
} from '../types';

import { JWTManagerService } from './jwt-manager.service';
import { SessionService } from './session.service';
import { RefreshTokenService } from './refresh-token.service';
import { Role } from '@/shared/constants';

export class AuthService {
  constructor(
    private readonly jwtManagerService: JWTManagerService,
    private readonly sessionService: SessionService,
    private readonly refreshTokenService: RefreshTokenService
  ) {}

  public async getEmailVerificationToken(payload: EmailVerificationTokenInput) {
    return this.jwtManagerService.generateEmailVerificationToken(payload);
  }

  public async createSessionAndIssueTokens(
    payload: CreateSessionAndIssueTokensPayload
  ): Promise<CreateSessionAndIssueTokensResponse> {
    const sessionId = generateUniqueId();
    const tokenFamily = generateUniqueId();

    const jwtPayload = {
      id: payload.id,
      sessionId,
      tokenFamily,
      role: payload.role,
    };

    const jtwtTokenResponse = await this.jwtManagerService.generateTokenPair(jwtPayload);

    const { refresh } = jtwtTokenResponse;

    const refType = payload.role === Role.ADMIN ? SessionRefType.ADMIN : SessionRefType.USER;

    const tokenPayload = {
      jti: refresh.jti,
      tokenFamily,
      sessionId,
      expiresAt: refresh.expiresAt,
    };

    const sessionPayload = {
      ...payload,
      sessionId,
      refId: payload.id,
      refType,
      expiresAt: refresh.expiresAt,
    };

    const [session, _refreshToken] = await Promise.all([
      this.sessionService.createSession(sessionPayload),
      this.refreshTokenService.create(tokenPayload),
    ]);

    return { session, token: jtwtTokenResponse };
  }

  public async getResetPasswordToken(payload: ResetPasswordTokenInput) {
    return this.jwtManagerService.generateResetPasswordToken(payload);
  }

  public async verifyToken(token: string, type: TokenType): Promise<VerifiedTokenResponse> {
    switch (type) {
      case TokenType.EMAIL_VERIFICATION:
        return this.jwtManagerService.verifyEmailVerificationToken(token);

      case TokenType.ACCESS:
        return this.jwtManagerService.verifyAccessToken(token);

      case TokenType.REFRESH:
        return this.jwtManagerService.verifyRefreshToken(token);

      case TokenType.RESET_PASSWORD:
        return this.jwtManagerService.verifyResetPasswordToken(token);

      default:
        throw new ApiError('Invalid token type');
    }
  }

  public async refresh(refreshToken: string): Promise<AuthTokenPairResponse> {
    const refreshPayload = await this.jwtManagerService.verifyRefreshToken(refreshToken);

    await this.refreshTokenService.validateRefreshToken(refreshPayload);

    await this.refreshTokenService.revokeToken(refreshPayload.jti);

    const jwtPayload = {
      id: refreshPayload.sub,
      sessionId: refreshPayload.sessionId,
      tokenFamily: refreshPayload.tokenFamily,
      role: refreshPayload.role,
    };

    const jtwtTokenResponse = await this.jwtManagerService.generateTokenPair(jwtPayload);

    const { refresh } = jtwtTokenResponse;

    const tokenPayload = {
      jti: refresh.jti,
      tokenFamily: jwtPayload.tokenFamily,
      sessionId: jwtPayload.sessionId,
      expiresAt: refresh.expiresAt,
    };

    await this.refreshTokenService.create(tokenPayload);

    return jtwtTokenResponse;
  }

  public async logout(aceessToken: string) {
    const { jti, sessionId } = await this.jwtManagerService.verifyAccessToken(aceessToken);
    await Promise.all([
      this.revokeToken(jti),
      this.sessionService.logout(sessionId),
      this.refreshTokenService.revokeTokenBySession(sessionId),
    ]);
  }

  public async revokeToken(jti: string) {
    return this.jwtManagerService.revokeToken(jti);
  }
}
