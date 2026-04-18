import { IdentityLean, UserDocument } from '../user';

export enum LoginTYpe {
  EMAIL = 'email',
  PHONE = 'phone',
  // GOOGLE = 'google',
  // APPLE = 'apple',
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserIAndIdentity {
  user: Partial<UserDocument>;
  identity: Partial<IdentityLean> | null;
}

export interface AuthResponse {
  user: Partial<UserDocument>;
  identity: Partial<IdentityLean> | null;
  token: AuthTokenResponse;
}

export interface VerifyOtpResponse {
  token: string;
}
