// import { RoleEnum } from '@/shared/constants';

// export enum TokenType {
//   ACCESS = 'ACCESS',
//   REFRESH = 'REFRESH',
//   RESET_PASSWORD = 'RESET_PASSWORD',
//   EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
// }

// export interface BaseTokenPayload {
//   sub: string;
//   deviceId?: string;
//   type: TokenType;
//   role: RoleEnum;
//   jti: string;
//   iat?: number;
//   exp?: number;
//   iss?: string;
// }

// export interface AccessTokenPayload extends BaseTokenPayload {
//   type: TokenType.ACCESS;
//   sessionId: string;
// }

// export interface RefreshTokenPayload extends BaseTokenPayload {
//   type: TokenType.REFRESH;
//   tokenFamily?: string;
//   sessionId: string;
// }

// export interface ResetPasswordTokenPayload extends BaseTokenPayload {
//   type: TokenType.RESET_PASSWORD;
// }

// export interface EmailVerificationTokenPayload extends BaseTokenPayload {
//   type: TokenType.EMAIL_VERIFICATION;
// }

// export interface TokenResult {
//   token: string;
//   expiresAt?: Date;
// }

// export interface TokenPairResult {
//   sessionId: string;
//   access: TokenResult;
//   refresh: TokenResult;
// }

// export interface GenerateTokenPairInput {
//   id: string;
//   deviceId: string;
//   sessionId: string;
//   role: RoleEnum;
// }

// export interface GenerateResetPasswordInput {
//   id: string;
//   role: RoleEnum;
// }
