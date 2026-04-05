import { AuthTokenPairResponse, TokenResult } from '@/modules/common/auth';
import { AdminDocument } from '../admins';

export interface LoginResponse {
  admin: Partial<AdminDocument>;
  tokensResponse: AuthTokenPairResponse;
}

interface AuthTokenResponse {
  access: TokenResult;
}

export interface AuthResponse {
  admin: Partial<AdminDocument>;
  token: AuthTokenResponse;
}
