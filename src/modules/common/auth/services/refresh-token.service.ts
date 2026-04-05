import { jwtInvalidError } from '@/core/error';
import { RefreshTokenRepository } from '../repositories';
import { RefreshTokenDocument, RefreshTokenLean } from '../models';
import {
  CreateRefreshTokenInput,
  RefreshTokenPayload,
  RefreshTokenStatus,
  SessionStatus,
} from '../types';

export class RefreshTokenService {
  constructor(private readonly repo: RefreshTokenRepository) {}

  public async create(payload: CreateRefreshTokenInput): Promise<RefreshTokenDocument> {
    const token = await this.repo.create(payload);

    if (!token) throw new Error('Failed to create login token');

    return token;
  }

  public async validateRefreshToken(payload: RefreshTokenPayload) {
    const { tokenFamily, jti } = payload;

    const isTokenRevoked = await this.isTokenRevoked(jti);

    if (isTokenRevoked) throw jwtInvalidError();

    const isLatest = await this.isLatestTokenInFamily(tokenFamily, jti);
    if (!isLatest) throw jwtInvalidError();
  }

  public async revokeTokenBySession(sessionId: string) {
    return this.repo.updateMany({ sessionId }, { status: SessionStatus.LOGGED_OUT });
  }

  private async getRefreshTokenByJti(jti: string): Promise<RefreshTokenLean | null> {
    return this.repo.findOne({ filter: { jti } });
  }

  private async isTokenRevoked(jti: string): Promise<boolean> {
    const token = await this.getRefreshTokenByJti(jti);

    if (!token) return true;

    return token.status !== RefreshTokenStatus.ACTIVE;
  }

  private async isLatestTokenInFamily(tokenFamily: string, currentJti: string): Promise<boolean> {
    const latestToken = await this.repo.findOne({
      filter: { tokenFamily },
      sort: { createdAt: -1 },
    });

    if (!latestToken) return false;

    return latestToken.jti === currentJti;
  }

  public async revokeToken(jti: string) {
    return this.repo.updateOne({ jti }, { status: RefreshTokenStatus.REVOKED });
  }
}
