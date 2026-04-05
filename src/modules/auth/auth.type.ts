import { TokenResult } from '@/modules/common/auth';
import { UserDocument } from '../user';
import { Identity } from '../user/identity/identity.model';

export enum LoginTYpe {
  EMAIL = 'email',
  PHONE = 'phone',
  GOOGLE = 'google',
  APPLE = 'apple',
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserIAndIdentity {
  user: Partial<UserDocument>;
  identity: Partial<Identity>;
}

export interface AuthResponse {
  user: Partial<UserDocument>;
  identity: Partial<Identity>;
  token: AuthTokenResponse;
}

export interface VerifyOtpResponse {
  token: string;
}
