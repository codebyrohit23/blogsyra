import { Platform, Role } from '@/shared/constants';
import { SessionLean } from '../models';
import { AuthTokenPairResponse } from './jwt.type';
import { MongoId } from '@/shared/types';

export interface CreateSessionAndIssueTokensPayload {
  id: MongoId;
  role: Role;

  platform: Platform;
  deviceId: string;
  fcmToken: string;

  timezone: string;
  ip?: string;
  location?: string;
}

export interface CreateSessionAndIssueTokensResponse {
  session: SessionLean;
  token: AuthTokenPairResponse;
}
