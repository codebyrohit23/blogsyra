import { Role } from '@/shared/constants';

export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
  RESET_PASSWORD = 'reset_password',
  EMAIL_VERIFICATION = 'email_verification',
}

export interface BaseTokenPayload {
  sub: string;
  type: TokenType;
  role: Role;
  jti: string;
  iat?: number;
  exp?: number;
  iss?: string;
}

export interface AccessTokenPayload extends BaseTokenPayload {
  type: TokenType.ACCESS;
  sessionId: string;
}

export interface RefreshTokenPayload extends BaseTokenPayload {
  type: TokenType.REFRESH;
  tokenFamily: string;
  sessionId: string;
}

export interface ResetPasswordTokenPayload extends BaseTokenPayload {
  type: TokenType.RESET_PASSWORD;
}

export interface EmailVerificationTokenPayload extends BaseTokenPayload {
  type: TokenType.EMAIL_VERIFICATION;
}

export interface TokenResult {
  jti: string;
  token: string;
  expiresAt: Date;
}

export interface AuthTokenPairResponse {
  access: TokenResult;
  refresh: TokenResult;
}

export interface AuthTokenPairInput {
  id: string;
  sessionId: string;
  tokenFamily: string;
  role: Role;
}

export interface ResetPasswordTokenInput {
  id: string;
  role: Role;
}

export interface EmailVerificationTokenInput {
  id: string;
  role: Role;
}

export type VerifiedTokenResponse =
  | AccessTokenPayload
  | RefreshTokenPayload
  | ResetPasswordTokenPayload
  | EmailVerificationTokenPayload;

// export type TokenPayloadMap = {
//   [TokenType.ACCESS]: AccessTokenPayload;
//   [TokenType.REFRESH]: RefreshTokenPayload;
//   [TokenType.RESET_PASSWORD]: ResetPasswordTokenPayload;
//   [TokenType.EMAIL_VERIFICATION]: EmailVerificationTokenPayload;
// };
