/* 
  Refresh Input 
*/
export interface RefreshTokenBase {
  jti: string;
  tokenFamily: string;
  sessionId: string;
  expiresAt: Date;
  status?: RefreshTokenStatus;
}

export type CreateRefreshTokenInput = RefreshTokenBase;

export type UpdateRefreshTokenInput = Partial<RefreshTokenBase>;

export enum RefreshTokenStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
}

// export interface ICreateRefreshToken {
//   jti: string;
//   tokenFamily: string;
//   sessionId: string;
//   expiresAt: Date;
// }
