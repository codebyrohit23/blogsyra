import jwt, { SignOptions } from 'jsonwebtoken';
import {
  AccessTokenPayload,
  EmailVerificationTokenPayload,
  RefreshTokenPayload,
  ResetPasswordTokenPayload,
  TokenType,
} from '../types';
import { config } from '@/core/config';
import { PRIVATE_KEY, PUBLIC_KEY } from '@/core/security';
import { ApiError } from '@/shared/utils';
import { HttpStatus, REDIS_TTL } from '@/shared/constants';

export class JWTService {
  constructor() {} // private readonly privateKey: string = PRIVATE_KEY // private readonly publicKey: string = PUBLIC_KEY,

  // private readonly ACCESS_EXPIRE = REDIS_TTL.ACCESS_TOKEN;
  // private readonly REFRESH_EXPIRE = REDIS_TTL.REFRESH_TOKEN;
  // private readonly RESET_PASSWORD_EXPIRE = REDIS_TTL.RESET_PASSWORD_TOKEN;
  // private readonly EMAIL_VERIFICATION_EXPIRE = REDIS_TTL.EMAIL_VERIFICATION_TOKEN;

  private readonly privateKey: string = config.auth.jwt.privateKey;
  private readonly publicKey: string = config.auth.jwt.publicKey;

  private readonly ACCESS_EXPIRE = config.auth.jwt.access.expiresIn;
  private readonly REFRESH_EXPIRE = config.auth.jwt.refresh.expiresIn;
  private readonly RESET_PASSWORD_EXPIRE = config.auth.jwt.resetPassword.expiresIn;
  private readonly EMAIL_VERIFICATION_EXPIRE = config.auth.jwt.emailVerification.expiresIn;

  private readonly ISSUER = `${config.app.appName}:${config.app.nodeEnv}`;
  private readonly ALGORITHM: 'RS256' = 'RS256';

  private readonly baseOptions: SignOptions = {
    algorithm: this.ALGORITHM,
    issuer: this.ISSUER,
  };

  // ACCESS TOKEN
  public generateAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, this.privateKey, {
      ...this.baseOptions,
      expiresIn: this.ACCESS_EXPIRE,
    });
  }

  public verifyAccessToken(token: string): AccessTokenPayload {
    const payload = jwt.verify(token, this.publicKey, {
      algorithms: [this.ALGORITHM],
      issuer: this.ISSUER,
    }) as AccessTokenPayload;

    if (payload.type !== TokenType.ACCESS) {
      throw new ApiError('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    return payload;
  }

  // REFRESH TOKEN
  public generateRefreshToken(payload: RefreshTokenPayload): string {
    return jwt.sign(payload, this.privateKey, {
      ...this.baseOptions,
      expiresIn: this.REFRESH_EXPIRE,
    });
  }

  public verifyRefreshToken(token: string): RefreshTokenPayload {
    const payload = jwt.verify(token, this.publicKey, {
      algorithms: [this.ALGORITHM],
      issuer: this.ISSUER,
    }) as RefreshTokenPayload;

    if (!payload || payload.type !== TokenType.REFRESH) {
      throw new ApiError('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    return payload;
  }

  // RESET PASSWORD TOKEN
  public generateResetPasswordToken(payload: ResetPasswordTokenPayload): string {
    return jwt.sign(payload, this.privateKey, {
      ...this.baseOptions,
      expiresIn: this.RESET_PASSWORD_EXPIRE,
    });
  }

  public verifyResetPasswordToken(token: string): ResetPasswordTokenPayload {
    const payload = jwt.verify(token, this.publicKey, {
      algorithms: [this.ALGORITHM],
      issuer: this.ISSUER,
    }) as ResetPasswordTokenPayload;

    if (!payload || payload.type !== TokenType.RESET_PASSWORD) {
      throw new ApiError('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    return payload;
  }

  // EMAIL VERIFICATION TOKEN
  public generateEmailVerificationToken(payload: EmailVerificationTokenPayload): string {
    return jwt.sign(payload, this.privateKey, {
      ...this.baseOptions,
      expiresIn: this.EMAIL_VERIFICATION_EXPIRE,
    });
  }

  public verifyEmailVerificationToken(token: string): EmailVerificationTokenPayload {
    const payload = jwt.verify(token, this.publicKey, {
      algorithms: [this.ALGORITHM],
      issuer: this.ISSUER,
    }) as EmailVerificationTokenPayload;

    console.log(payload.type, TokenType.EMAIL_VERIFICATION);

    if (!payload || payload.type !== TokenType.EMAIL_VERIFICATION) {
      throw new ApiError('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    return payload;
  }
}
